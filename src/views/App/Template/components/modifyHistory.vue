<template>
  <div>
    <!--ModifyHistory-->
    <el-card v-show="modifyHistoryVisible">
      <div slot="header" style="width:50%;margin-bottom:20px">
        <md-input icon="edit"  v-model="name">Name of this form</md-input>
      </div>

      <div class="clearfix">
        <span><el-tag type="success">{{currentQuestion.position}}</el-tag>
        </span>
      </div>
      <div v-if="currentQuestion.relation" style="margin-top: 20px;margin-bottom: 30px">
        <div class="questionTitle">{{currentQuestion.label}}</div>
        <el-select v-model="currentQuestion.answer" placeholder="Please Select"
                   @change="answerChange">
          <el-option
            v-for="(item,index) in currentQuestion.optionArray"
            :label="item.answer"
            :value="index">
          </el-option>
        </el-select>
      </div>
      <div v-else>
        <div v-if="currentQuestion.type=='text'" :disabled="currentQuestion.disabled" style="height: 50px; margin-bottom: 30px">
          <md-input icon="edit"  v-model="currentQuestion.answer">{{currentQuestion.label}}</md-input>
        </div>
        <div v-if="currentQuestion.type=='textarea'" style="margin-top: 20px;margin-bottom: 30px">
          <div class="questionTitle">{{currentQuestion.label}}</div>
          <el-input
            :disabled="currentQuestion.disabled"
            type="textarea"
            :rows="3"
            placeholder="Please enter the content"
            v-model="currentQuestion.answer">
          </el-input>
        </div>
        <div v-if="currentQuestion.type=='radio'" style="margin-top: 20px;margin-bottom: 30px">
          <div class="questionTitle">{{currentQuestion.label}}</div>
          <el-radio-group v-model="currentQuestion.answer" :disabled="currentQuestion.disabled">
            <el-radio v-for="option in currentQuestion.optionArray" :label="option"></el-radio>
          </el-radio-group>
        </div>
        <div v-if="currentQuestion.type=='select'" style="margin-top: 20px;margin-bottom: 30px">
          <div class="questionTitle">{{currentQuestion.label}}</div>
          <el-select v-model="currentQuestion.answer" placeholder="Please Select" :disabled="currentQuestion.disabled">
            <el-option
              v-for="item in currentQuestion.optionArray"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div v-if="currentQuestion.type=='checkbox'" style="margin-top: 20px;margin-bottom: 30px">
          <div class="questionTitle">{{currentQuestion.label}}</div>
          <el-checkbox-group v-model="currentQuestion.answer" :disabled="currentQuestion.disabled">
            <el-checkbox v-for="item in currentQuestion.optionArray" :label="item"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-if="currentQuestion.type=='picture'" style="margin-top: 20px;margin-bottom: 30px">
          <div class="questionTitle">{{currentQuestion.label}}</div>
          <el-upload
            class="technology-uploader"
            :action="ip + '/uploadimage'"
            :show-file-list="false"
            :auto-upload="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="currentQuestion.answer!==''" :src="currentQuestion.answer" class="technology">
            <i v-else class="el-icon-plus technology-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <el-row>
        <el-button @click="prevQuestion" :disabled="prevButtonDisabled" type="primary" size="small" icon="el-icon-arrow-left">prev</el-button>
        <el-button @click="nextQuestion" :disabled="nextButtonDisabled" type="primary" size="small">next<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        <el-popover
          ref="popover"
          placement="top"
          width="190"
          v-model="popoverVisible">
          <p>Are you sure to update?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverVisible = false">Cancel</el-button>
            <el-button type="primary" size="mini" @click="popoverVisible= false;confirmUpdate()">Confirm</el-button>
          </div>
        </el-popover>
        <el-button v-popover:popover size="small" type="primary" style="float: right;margin-left:10px">Update</el-button>
        <el-button size="small" type="success" style="float: right" @click="preview">Preview</el-button>
      </el-row>
    </el-card>
    <!--Preview-->
    <div v-show="previewVisible" style="padding-top: 0">
      <el-button icon="el-icon-back" style="margin-bottom: 20px" @click="backToModify"></el-button>

      <el-card>
        <div v-html="html"></div>
      </el-card>
    </div>


  </div>
</template>

<script>
  import MdInput from '@/components/MDinput'

  export default {
    components: {
      MdInput
    },
    props: {
      templateId: {
        type: Number,
        default:-1
      },
      historyId: {
        type: Number,
        default:-1
      },
      historyQuestionForm: {
        type:Array,
        default: function () {
          return []
        }
      },
      historyName: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
//        ip: 'http://121.42.252.18:5000',
//        ip: 'http://192.168.0.15:5000',
        ip: '',
        html: '',
        previewVisible: false,
        modifyHistoryVisible: true,
        relation: [],
        questionForm: [],
        name: '',
        currentQuestion:{},
        currentQuestionIndex: 0,
        prevButtonDisabled: true,
        nextButtonDisabled: false,
        popoverVisible: false,
        selectedHistoryId: '' //记录选择的是哪个history的answer，如果后面的问题与当前问题关联相同的category，则去这个history里找答案
      }
    },
    watch: {
      // 模板改变 重新获取模板的关联关系
      templateId (val, oldVal) {
        if ( val !== oldVal) {
          this.getRelation();
        }
      },
      historyId(val, oldVal){
        console.log(this.historyQuestionForm)
        if ( val !== oldVal) {
          this.questionForm = this.historyQuestionForm.map(this.copyObj)
          this.name = this.historyName
          this.currentQuestion = {};
          // 初始化第一个问题
          this.currentQuestion = this.questionForm[0];
          this.currentQuestionIndex = 0;
          this.prevButtonDisabled = true;
          this.nextButtonDisabled = false;
          this.nameDialog = false;
        }
      },
//      questionForm:{
//        handler(val, oldVal){
//          // currentQuestion为空触发
//          if(!this.currentQuestion.label){
//            this.currentQuestion = this.questionForm[0]
//          }
//        },
//        deep:true
//      }

    },
    mounted () {
      this.resetForm ()
//      this.questionForm = this.historyQuestionForm.map(this.copyObj)
//      this.name = this.historyName
//      this.currentQuestion = {};
//      // 初始化第一个问题
//      this.currentQuestion = this.questionForm[0];
    },
    methods: {
      //对象的浅拷贝
      copyObj (obj) {
        let res = {}
        for (var key in obj) {
          res[key] = obj[key]
        }
        return res
      },
      // 获取关联关系
      getRelation () {
        let self = this;
        self.$axios({
          url: this.ip +  `/app/getQuestion/${self.templateId}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            let questionForm = res.data.questionForm;
            let length = questionForm.length;
            for (let i = 0; i < length; ++i) {
              //记录关联关系
              if (questionForm[i].relation) {
                let selectedCategory = questionForm[i].selectedCategory
                let categoryId = selectedCategory[selectedCategory.length - 1]

                let isExist = false
                let j = 0
                for (j; j < this.relation.length; ++j) {
                  if (categoryId === this.relation[j].categoryId) {
                    isExist = true
                    break
                  }
                }
                if (isExist) {
                  this.relation[j].questionIndex.push(i)
                } else {
                  this.relation.push({categoryId: categoryId, questionIndex: [i]})
                }
              }
            }
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      // 关联表的选项改变时触发
      answerChange (value) {
        this.currentQuestion.answer = this.currentQuestion.optionArray[value].answer
        this.selectedHistoryId = this.currentQuestion.optionArray[value].id
        this.fillQuestion()
      },
      //当前一个问题选完答案后，后面关联相同category的问题，自动填写答案，
      fillQuestion() {
        //获取当前问题关联的category
        if (this.currentQuestion.relation) {
          let selectedCategory = this.currentQuestion.selectedCategory
          let categoryId = selectedCategory[selectedCategory.length - 1]
          //把除当前问题之外的关联相同category的问题自动填上答案
          for (let i = 0; i < this.relation.length; ++i) {
            if (this.relation[i].categoryId === categoryId) {
              // 第一个问题为当前问题，已经选好答案，从第二个问题开始答案随第一个随动
              let j = 0;
              for (let index in this.relation[i].questionIndex) {
                // 跳过第一个问题
                if (j === 0){
                  ++j;
                  continue
                }
                this.getAnswer (categoryId, this.questionForm[index].selectedPosition, this.selectedHistoryId, index)
              }
            }
          }
        }
      },
      // 获取categoryId、questionId、historyId唯一确定的问题的答案
      getAnswer (categoryId, questionId, historyId, index) {
        let self = this;
        self.$axios({
          url: this.ip +  `/app/getAnswer?CategoryId=${categoryId}&QueId=${questionId}&HistoryId=${historyId}&UserId=${this.$store.getters.userId}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            this.questionForm[index].answer = res.data.answer;
            this.questionForm[index].disabled = true; // 自动填充的问题不能修改
          }
        }).catch(function (error) {
          console.log(error)
        })

      },
      //当父组件的dialog关闭时调用此方法，重置子组件绑定的值
      resetForm () {
        this.questionForm = this.historyQuestionForm.map(this.copyObj)
        this.name = this.historyName
        this.currentQuestion = {};
        // 初始化第一个问题
        this.currentQuestion = this.questionForm[0];
      },
      prevQuestion() {
        --this.currentQuestionIndex;
        this.currentQuestion = this.questionForm[this.currentQuestionIndex];
        this.nextButtonDisabled = false;
        if (this.currentQuestionIndex === 0) {
          this.prevButtonDisabled = true;
        }

      },
      nextQuestion() {
        if(this.currentQuestion.required && (this.currentQuestion.answer === ''||this.currentQuestion.answer.length === 0)) {
          this.$message({
            message: 'Please answer the question',
            type: 'warning'
          });
          return;
        }
        if(this.questionForm.length === 1) {
          this.$message({
            message: 'Only one question',
            type: 'warning'
          });
          return;
        }
        ++this.currentQuestionIndex;
        this.currentQuestion = this.questionForm[this.currentQuestionIndex];
        this.prevButtonDisabled = false;
        if (this.currentQuestionIndex === this.questionForm.length - 1) {
          this.nextButtonDisabled = true;
        }
      },
      confirmUpdate(){
        if(this.currentQuestion.required && (this.currentQuestion.answer === ''||this.currentQuestion.answer.length === 0)) {
          this.$message({
            message: 'Please answer the question',
            type: 'warning'
          });
          return;
        }
        if(this.name === ''){
          this.$message({
            message: 'Please enter name of this form',
            type: 'warning',
            duration: 2000
          })
          return;
        }
        this.updateForm();
//        console.log(this.questionForm)
      },
      preview () {
        if(this.currentQuestion.required && (this.currentQuestion.answer === ''||this.currentQuestion.answer.length === 0)) {
          this.$message({
            message: 'Please answer the question',
            type: 'warning'
          });
          return;
        }
        // 预览请求
        let self = this;
        self.$axios({
          url: this.ip +  `/app/preview`,
          method: 'post',
          data: {
            categoryId: this.templateId,
            data: this.questionForm
          }
        }).then(res => {
          if (res.data.result === 'success') {
            this.html = res.data.html
            this.modifyHistoryVisible = false
            this.previewVisible = true
          }
        }).catch(function (error) {
          console.log(error)
        })

      },
      backToModify () {
        this.modifyHistoryVisible = true;
        this.previewVisible = false;
      },
      updateForm () {
        let self = this;
        self.$axios({
          url: this.ip +  `/app/modifyHistory/${this.templateId}`,
          method: 'put',
          data:{
            userId: this.$store.getters.userId,
            historyId: this.historyId,
            data: this.questionForm,
            name: this.name}
        }).then(res => {
          if (res.data.result === 'success') {
            this.$message({
              message: 'Update Success',
              type: 'success',
              duration: 2000
            })
//          更新呢成功后 调用父组件的方法 关闭父组件的窗口 列表刷新
            this.$emit('updateSuccess',[this.questionForm, this.name])
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage
            this.$message({
              message: errorMessage,
              type: 'error',
              duration: 2000
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      resetQuestion(){
        // 页面切回 第一个问题，清空答案
        for(let i=0;i<this.questionForm.length;++i){
          if(this.questionForm[i].type === 'checkbox'){
            this.questionForm[i].answer = []
          }else{
            this.questionForm[i].answer = ''
          }
        }
        this.currentQuestionIndex = 0;
        this.currentQuestion = this.questionForm[0];
        this.prevButtonDisabled = true;
        this.nextButtonDisabled = false;
        this.name = '';
      },

      handleAvatarSuccess(res, file) {
        alert(1)
        alert(res.url)
        this.currentQuestion.answer = res.url;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('The format of this picture is not JPG');
        }
        if (!isLt2M) {
          this.$message.error('The size of this picture is more than 2MB!');
        }
        return isJPG && isLt2M;
      },
    }
  }
</script>

<style scoped>
  .questionTitle {
    font-weight: bold;
    color: #9E9E9E;
    margin: 0 30px 30px 0
  }
  .technology-uploader >>> .el-upload--text{
    width: 250px!important;
    height: 178px!important;
  }
  .technology-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .technology-uploader >>> .el-upload:hover {
    border-color: #20a0ff;
  }
  .technology-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .technology {
    width: 250px;
    height: 178px;
    display: block;
  }

</style>
