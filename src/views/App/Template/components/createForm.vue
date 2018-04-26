<template>
  <div>
    <el-card v-show="questionForm.length">
      <div v-show="currentQuestion.type!='table'" slot="header" class="clearfix">
          <span><el-tag type="success"><em>Question <b>{{currentQuestion.position}}</b></em></el-tag>
          </span>
      </div>
      <div v-show="currentQuestion.type=='table'" slot="header" class="clearfix">
          <span><el-tag type="success"><em>Table <b>{{currentQuestion.title}}</b></em></el-tag>
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
        <div v-if="currentQuestion.type=='table'" style="margin-bottom: 30px;margin-top:-20px">
          <div v-for="(col,index) in currentQuestion.col" style="margin-bottom: 30px;width: 50%">
            <md-input icon="edit"  v-model="col.answer[index]">{{col.label}}</md-input>
          </div>
        </div>
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
          <el-button v-if="currentQuestionIndex === questionForm.length-1" size="small" type="primary" style="float: right" @click="confirmEdit">Submit</el-button>
        <el-button v-if="currentQuestionIndex === questionForm.length-1" size="small" type="success" style="float: right" @click="preview">Preview</el-button>
      </el-row>
    </el-card>
    <!--Preview-->
    <el-dialog
      :visible.sync="previewDialog">
      <el-card>
        <div v-html="html"></div>
      </el-card>
    </el-dialog>
    <el-dialog
      :visible.sync="nameDialog"
      width="30%">
      <md-input icon="edit" v-model="name">Please enter the name of this form</md-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nameDialog = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm()">Confirm</el-button>
      </span>
    </el-dialog>
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
    },
    data () {
      return {
//        ip: 'http://121.42.252.18:5000',
//        ip: 'http://192.168.0.15:5000',
        ip: '',
        html: '',
        previewDialog: false,
        questionForm: [],
        relation: [],
        currentQuestion:{},
        currentQuestionIndex: 0,
        prevButtonDisabled: true,
        nextButtonDisabled: false,
        name: '',
        nameDialog: false,
        options:[],
        selectedHistoryId: '' //记录选择的是哪个history的answer，如果后面的问题与当前问题关联相同的category，则去这个history里找答案
      }
    },
    watch: {
      templateId(val, oldVal){
        if ( val !== oldVal) {
          this.currentQuestion = {};
          this.currentQuestionIndex = 0;
          this.prevButtonDisabled = true;
          this.nextButtonDisabled = false;
          this.name = '';
          this.nameDialog = false;
          this.questionForm = [];
          this.relation = [];
          this.options = [];
          this.loadQuestion();
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
      this.loadQuestion()
    },
    methods: {
      loadQuestion() {
        let self = this;
        self.$axios({
          url: this.ip +  `/app/getQuestion/${self.templateId}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            self.questionForm = res.data.questionForm;
            let length = self.questionForm.length;
            for (let i = 0; i < length; ++i) {
              //table类型单独处理
              if (self.questionForm[i].type === 'table') {
                for (let k = 0; k < self.questionForm[i].col.length; ++k) {
                  self.$set(self.questionForm[i].col[k], 'answer', []); //数组存table该列的每一行的答案
                }
              }else {
                self.$set(self.questionForm[i], 'disabled', false);//为每个问题添加diabled字段，关联问题不能修改
                if (self.questionForm[i].type === 'checkbox') {
                  self.$set(self.questionForm[i], 'answer', []);
                } else {
                  self.$set(self.questionForm[i], 'answer', '');
                }
                if (self.questionForm[i].type === 'radio' || self.questionForm[i].type === 'select' || self.questionForm[i].type === 'checkbox') {
                  let optionArray = self.questionForm[i].option.split(',');
                  self.$set(self.questionForm[i], 'optionArray', optionArray);
                }

                //记录关联关系
                if (self.questionForm[i].relation) {
                  let selectedCategory = self.questionForm[i].selectedCategory
                  let categoryId = selectedCategory[selectedCategory.length - 1]

                  let isExist = false
                  let j = 0
                  for (j; j < this.relation.length; ++j) {
                    if (categoryId === this.relation[j].categoryId) {
                      isExist = true
                      break
                    }
                  }
                  if(isExist){
                    this.relation[j].questionIndex.push(i)
                    this.questionForm[i].relation = false // 每个数组中只有第一个遇到的问题的relation仍为true，其他关联相同category的都改为false，其他全部随第一个问题的答案随动
                  }else {
                    this.relation.push({categoryId:categoryId,questionIndex:[i]})
                  }
                }
              }

            }
            //初始化第一个问题
            if (self.questionForm[0].relation) {
              //请求选项
              let selectedCategory = self.questionForm[0].selectedCategory
              let categoryId = selectedCategory[selectedCategory.length - 1]
              let queId = self.questionForm[0].selectedPosition
              self.getQuestionOptions(categoryId, queId, 0)
            }
            self.currentQuestion = self.questionForm[0];
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //获取关联category的question的所有已填好的答案用来作为选项
      getQuestionOptions (categoryId, queId, index) {
        let self = this;
        self.$axios({
          url: this.ip +  `/app/getQuestionAnswer/${categoryId}?QueId=${queId}&UserId=${this.$store.getters.userId}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            this.options = res.data.data
            let optionArray = this.options
            self.$set(self.questionForm[index], 'optionArray', optionArray);
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
      confirmEdit(){
        if(this.currentQuestion.required && (this.currentQuestion.answer === ''||this.currentQuestion.answer.length === 0)) {
          this.$message({
            message: 'Please answer the question',
            type: 'warning'
          });
          return;
        }
        this.nameDialog = true;
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
            this.previewDialog = true
            console.log(this.html)
          }
        }).catch(function (error) {
          console.log(error)
        })

      },
      submitForm () {
        if(this.name === ''){
          this.$message({
            message: 'Please enter title',
            type: 'warning',
            duration: 2000
          })
          return;
        }
//        alert(this.$store.getters.userId)
        this.nameDialog = false;
        let self = this;
        self.$axios({
          url: this.ip +  `/app/submitAnswer/${this.templateId}`,
          method: 'post',
          data:{
            userId: this.$store.getters.userId,
            data:this.questionForm,
            name: this.name}
        }).then(res => {
          if (res.data.result === 'success') {
            this.$message({
              message: 'Submit Success',
              type: 'success',
              duration: 2000
            })
//            this.resetQuestion();
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
//        alert(1)
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
