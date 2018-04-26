<template>
  <div class="app-container">
    <el-row>
      <el-col  :span="5">
        <el-input placeholder="Filter keyword" v-model="filterText" style="width: 90%; margin-bottom:20px;"></el-input>

        <el-card style="width: 90%;">
          <el-tree class="filter-tree"
                   :highlight-current="true"
                   :data="treeData"
                   :filter-node-method="filterNode"
                   @node-click="handleNodeClick"
                   ref="tree">
             <span class="custom-tree-node" slot-scope="{ node, data }">
               <span><span v-show="'finished' in data && !data.finished" style="color: red;margin-left:-20px;margin-right: 10px">* </span>{{ data.name }}</span>
            </span>

          </el-tree>
        </el-card>


      </el-col>
      <el-col  :span="19" v-show="nodeClick">
        <el-card>
          <div v-html="html"></div>
        </el-card>
        <br>
        <el-button type="success" size="small" icon="el-icon-edit" @click="editIntroduction">Introduction</el-button>
        <el-button type="primary" size="small" icon="el-icon-edit" @click="editQuestion">Edit Question</el-button>
        <el-popover
          ref="popover5"
          placement="top"
          width="190"
          v-model="popoverVisible">
          <p>Are you sure to delete the Template <b>{{selectedNode.name}}</b> ?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverVisible = false">Cancel</el-button>
            <el-button type="primary" size="mini" @click="popoverVisible= false;deleteTemplate()">Confirm</el-button>
          </div>
        </el-popover>
        <el-button v-popover:popover5 type="danger" size="small" icon="el-icon-delete" style="float: right">Delete</el-button>
        <br><br>
        <!--Introduction-->
        <el-card v-show="introductionVisible">
          <div style="height:50px; width:50%">
            <md-input icon="edit"  placeholder="Enter the question" v-model="title">Title</md-input>
          </div>
          <div style="margin: 20px 0;width: 50%">
            <span class="questionTitle">Introduction of this Template: </span>
            <br><br>
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              placeholder="Please enter description of the template"
              v-model="introduction">
            </el-input>
          </div>
          <el-button v-show="finished" size="small" type="success" @click="updateTemplateIntroduction">Update</el-button>

        </el-card>
        <!--Edit Question-->
        <el-card v-show="editQuestionVisible">
          <div v-if="currentQuestion.type =='table'">
            <div style="height:50px; width:50%;margin-bottom: -15px">
              <el-tag type="success"><b><em>Table</em></b></el-tag>
            </div>
            <div style="height:50px; width:50%;margin-bottom:20px">
              <md-input icon="edit"  placeholder="Enter the title of this table" v-model="currentQuestion.title">Title</md-input>
            </div>
            <div v-for="col in currentQuestion.col">
              <div style="height:50px; width:50%;margin-bottom: -15px">
                <span><el-tag type="success">Question <b><em>No.{{col.position}}</em></b></el-tag>
                <el-tag type="" style="margin-left: 10px">Question type <b><em>{{col.type}}</em></b></el-tag></span>
              </div>
              <div style="height:50px; width:50%;margin-bottom:20px">
                <md-input icon="edit"  placeholder="Enter the question" v-model="col.label">Question</md-input>
              </div>
            </div>

          </div>
          <div v-else>
            <div style="height:50px; width:50%">
              <span><el-tag type="success">Question <b><em>No.{{currentQuestion.position}}</em></b></el-tag>
              <el-tag type="" style="margin-left: 10px">Question type <b><em>{{currentQuestion.type}}</em></b></el-tag></span>
            </div>
            <div style="height:50px; width:50%">
              <md-input icon="edit"  placeholder="Enter the question" v-model="currentQuestion.label">Question</md-input>
            </div>
            <div style="height:50px; width:50%" v-if="currentQuestion.type == 'radio'||currentQuestion.type == 'checkbox'||currentQuestion.type == 'select'">
              <md-input icon="edit"  placeholder="Enter options,Separated by commas" v-model="currentQuestion.option">Option</md-input>
            </div>
            <div style="height:40px;margin-top: 20px">
              <span class="questionTitle">Required</span>
              <el-switch
                class="switch"
                v-model="currentQuestion.required"
                active-text="Yes"
                inactive-text="No">
              </el-switch>
            </div>
            <div style="height:40px;margin-top: 20px">
              <span class="questionTitle">Unique</span>
              <el-switch
                class="switch"
                v-model="currentQuestion.unique"
                active-text="Yes"
                inactive-text="No">
              </el-switch>
            </div>
            <div style="margin-top: 20px;margin-bottom: 20px">
              <span class="questionTitle">Relation</span>
              <el-switch
                class="switch"
                v-model="currentQuestion.relation"
                active-text="Yes"
                inactive-text="No" @change="relationChange">
              </el-switch>
            </div>
            <div v-if="currentQuestion.relation" style="height:50px;margin-top: 20px;margin-bottom: 20px">
              <el-cascader placeholder="Template Category" expand-trigger="click" :options="categoryCascader" v-model="currentQuestion.selectedCategory"
                           :props="categoryProps" ref="catCascader" :show-all-levels="false" @change="categoryChange"></el-cascader>
              <span v-show="currentQuestion.selectedCategory.length">
              <el-select v-loading="currentQuestion.loading"  v-model="currentQuestion.selectedPosition" filterable placeholder="Please Select Question" @change="change1">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              </span>
            </div>
          </div>

          <el-row>
            <el-col :span="12">
              <el-pagination
                layout="prev, pager, next"
                :current-page="currentPage"
                @current-change="pageChange"
                :page-count="total">
              </el-pagination>
            </el-col>
            <el-col :span="12">
              <el-button v-show="!finished" size="small" type="success" style="float: right" @click="confirmEdit">Confirm</el-button>
              <el-button v-show="finished" size="small" type="success" style="float: right" @click="updateTemplate">Update</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>




  </div>
</template>

<script>
  import MdInput from '@/components/MDinput'
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
  import ElCard from "../../../../node_modules/element-ui/packages/card/src/main.vue";
  export default {
    components: {
      ElCard,
      ElButton,
      MdInput
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted () {
      this.loadTree();
    },
    data() {
      return {
//        ip:'http://192.168.0.15:5000',
//        ip: 'http://121.42.252.18:5000',
        ip: '',
        popoverVisible: false,
        categoryProps: {
          value: 'id',
          children: 'children',
          label: 'name'
        },
        categoryCascader: [],
        options: [],
        editQuestionVisible: false,
        introductionVisible: false,
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        nodeClick: false,
        html:'',
        questionForm:[],
        title: '',
        introduction: '',
        currentQuestion: {},
        currentPage: 1,
        total: 0,
        selectedNode:{},
        finished: false,
        searchEnd: false,
      }
    },

    methods: {
      loadFinishedTemplate(){
        let self = this;
        self.$axios({
//          url: '/admin/getAllTemplate',
          url:  this.ip + '/admin/getAllFinishedTemplate',
//          url: 'http://121.42.252.18:5000/admin/getAllTemplate',
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            self.categoryCascader = res.data.treeData;
          }
        }).catch(response => {
          let body = response.data;
          let error = body.error;
          let errorMessage = body.errorMessage;
          this.$message({
            message: errorMessage,
            type: 'error'
          });
        });
      },
      loadTree () {
        let self = this;
        self.$axios({
//          url: `/admin/getAllTemplate`,
          url: this.ip + `/admin/getAllTemplate`,
//          url: `http://121.42.252.18:5000/admin/getAllTemplate`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            self.treeData = res.data.treeData[0].children;
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage;
            this.$message({
              message: errorMessage,
              type: 'error',
              duration: 2000
            })
          }
        }).catch(function (error) {
          console.log(error);
        })
      },
      filterNode (value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1
      },
      handleNodeClick (data,node) {
        // 根节点不不触发
        if (data.children !== undefined) {
          return
        }
        // 重复点击同一节点不重复发请求
        if (data.id === this.selectedNode.id) {
          return
        }
        this.popoverVisible = false;
        this.editQuestionVisible = false;
        this.introductionVisible = false;
        this.selectedNode = data
        this.finished = data.finished
        if (this.selectedNode.finished) {
          this.getFinishedTemplate()
        }else {
          this.getUnfinishedTemplate()
        }


      },
      getUnfinishedTemplate () {
        this.currentPage = 1;
        this.$axios({
          url: this.ip + `/admin/getTemplateDetail/${this.selectedNode.id}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            this.nodeClick = true;
            this.html = res.data.html;
            this.total = res.data.Nub;
            this.questionForm = res.data.questionForm;
            this.title = '';
            this.introduction = '';
            for(let i = 0; i < this.questionForm.length; ++i){
              //table组件单独处理
              if (this.questionForm[i].type === 'table') {
                this.questionForm[i].title === '';
                for (let j = 0; j < this.questionForm[i].col.length; ++j) {
                  this.questionForm[i].col[j].label = ''// 问题
                }
              }else{
                this.questionForm[i].label = ''; // 问题
                this.questionForm[i].option = ''; // type为单选或多选时的选项
                this.questionForm[i].required = false; //是否为必填项
                this.questionForm[i].unique = false; //是否该问题的答案不能与其他人的答案重复
                this.questionForm[i].relation = false; //是否关联其它表
                this.questionForm[i].selectedCategory = []; //选中的关联表
                this.questionForm[i].selectedPosition = ''; //选中的关联表的字段
                this.questionForm[i].loading = true; //选择关联表之后加载关联表的字段
              }
            }

            // 默认第一页显示第一个需要编辑的问题
            //table组件单独处理
            if (this.questionForm[0].type === 'table') {
              this.$set(this.currentQuestion, 'type', this.questionForm[0].type);
              this.$set(this.currentQuestion, 'title', this.questionForm[0].title);
              this.$set(this.currentQuestion, 'row', this.questionForm[0].row);
              this.$set(this.currentQuestion, 'col', this.questionForm[0].col);
            }else {
              this.$set(this.currentQuestion, 'position', this.questionForm[0].position);
              this.$set(this.currentQuestion, 'type', this.questionForm[0].type);
              this.$set(this.currentQuestion, 'label', this.questionForm[0].label);
              this.$set(this.currentQuestion, 'option', this.questionForm[0].option);
              this.$set(this.currentQuestion, 'required', this.questionForm[0].required);
              this.$set(this.currentQuestion, 'unique', this.questionForm[0].unique);
              this.$set(this.currentQuestion, 'relation', this.questionForm[0].relation);
              this.$set(this.currentQuestion, 'selectedCategory', this.questionForm[0].selectedCategory);
              this.$set(this.currentQuestion, 'selectedPosition', this.questionForm[0].selectedPosition);
              this.$set(this.currentQuestion, 'loading', this.questionForm[0].loading);
            }
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage;
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
      getFinishedTemplate () {
        this.currentPage = 1;
        let self = this;
        self.$axios({
          url: this.ip + `/admin/getFinishedTemplateDetail/${self.selectedNode.id}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            self.nodeClick = true;
            self.html = res.data.html;
            self.total = res.data.Nub;
            self.questionForm = res.data.questionForm;
            self.title = res.data.title;
            self.introduction = res.data.introduction;
            // 默认第一页显示第一个需要编辑的问题
            if ( self.questionForm[0].type === 'table') {
              this.$set(this.currentQuestion, 'type', this.questionForm[0].type);
              this.$set(this.currentQuestion, 'title', this.questionForm[0].title);
              this.$set(this.currentQuestion, 'row', this.questionForm[0].row);
              this.$set(this.currentQuestion, 'col', this.questionForm[0].col);
            }else {
              self.$set(self.currentQuestion, 'position', self.questionForm[0].position);
              self.$set(self.currentQuestion, 'type', self.questionForm[0].type);
              self.$set(self.currentQuestion, 'label', self.questionForm[0].label);
              self.$set(self.currentQuestion, 'option', self.questionForm[0].option);
              self.$set(self.currentQuestion, 'required', self.questionForm[0].required);
              self.$set(self.currentQuestion, 'unique', self.questionForm[0].unique);
              self.$set(self.currentQuestion, 'relation', self.questionForm[0].relation);
              self.$set(self.currentQuestion, 'selectedCategory', self.questionForm[0].selectedCategory);
              self.$set(self.currentQuestion, 'selectedPosition', self.questionForm[0].selectedPosition);
              self.$set(self.currentQuestion, 'loading', self.questionForm[0].loading);
            }

          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage;
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
      editQuestion () {
        if (this.introductionVisible) {
          this.introductionVisible = !this.introductionVisible
        }
        this.editQuestionVisible = !this.editQuestionVisible
      },
      editIntroduction () {
        if (this.editQuestionVisible) {
          this.editQuestionVisible = !this.editQuestionVisible
        }
        this.introductionVisible = !this.introductionVisible
      },
      deleteTemplate () {
        let self = this;
        self.$axios({
          url: this.ip + `/admin/deleteTemplate/${self.selectedNode.id}`,
          method: 'delete'
        }).then(res => {
          if (res.data.result === 'success') {
            this.$message({
              message: 'Delete Success',
              type: 'success',
              duration: 2000
            })
            //从树形菜单中删除
            this.searchEnd = false;
            this.depthTraversalDelete(this.treeData,this.selectedNode)
            this.nodeClick = false;

          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage;
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
      //递归遍历 找到树形菜单中已经删除的节点并删除
      depthTraversalDelete(treeArray,deleteNode) {
        for (var i in treeArray) {
          if (this.searchEnd) {
            return
          }
//          alert(treeArray[i].id)
          if (treeArray[i].id === deleteNode.id) {
            treeArray.splice(i,1);
            this.searchEnd = true;
            return;
          } else {
            this.depthTraversalDelete(treeArray[i].children, deleteNode);
          }
        }
        },
      saveQuestion () {
        //页面改变之前填好的问题保存到questionForm中
        if (this.questionForm[this.currentPage - 1].type === 'table') {
          this.questionForm[this.currentPage - 1].title = this.currentQuestion.title;
          this.questionForm[this.currentPage - 1].col = this.currentQuestion.col;
        }else {
          this.questionForm[this.currentPage - 1].label = this.currentQuestion.label;
          this.questionForm[this.currentPage - 1].option = this.currentQuestion.option;
          this.questionForm[this.currentPage - 1].required = this.currentQuestion.required;
          this.questionForm[this.currentPage - 1].unique = this.currentQuestion.unique;
          this.questionForm[this.currentPage - 1].relation = this.currentQuestion.relation;
          this.questionForm[this.currentPage - 1].selectedCategory = this.currentQuestion.selectedCategory;
          this.questionForm[this.currentPage - 1].selectedPosition = this.currentQuestion.selectedPosition;
          this.questionForm[this.currentPage - 1].loading = this.currentQuestion.loading;
        }

      },
      pageChange(currentPage) {
//        alert(currentPage + '  ' +this.currentPage)
//
        if (this.currentPage !== currentPage) {
          // 通过页码换页时，currentpage和this.currentPage是不同的
          // 提交验证失败时，会自动跳转到失败的那一页，这时currentpage === this.currentPage
          this.saveQuestion()
        }
        this.currentPage = currentPage;
        // 载入点击的页面对应的的问题
        console.log(this.questionForm)
        if (this.questionForm[this.currentPage - 1].type === 'table') {
          this.$set(this.currentQuestion, 'type', this.questionForm[currentPage - 1].type);
          this.$set(this.currentQuestion, 'title', this.questionForm[currentPage - 1].title);
          this.$set(this.currentQuestion, 'row', this.questionForm[currentPage - 1].row);
          this.$set(this.currentQuestion, 'col', this.questionForm[currentPage - 1].col);
        }else {
          this.$set(this.currentQuestion, 'position', this.questionForm[currentPage - 1].position);
          this.$set(this.currentQuestion, 'type', this.questionForm[currentPage - 1].type);
          this.$set(this.currentQuestion, 'label', this.questionForm[currentPage - 1].label);
          this.$set(this.currentQuestion, 'option', this.questionForm[currentPage - 1].option);
          this.$set(this.currentQuestion, 'required', this.questionForm[currentPage - 1].required);
          this.$set(this.currentQuestion, 'unique', this.questionForm[currentPage - 1].unique);
          this.$set(this.currentQuestion, 'relation', this.questionForm[currentPage - 1].relation);
          this.$set(this.currentQuestion, 'selectedCategory', this.questionForm[currentPage - 1].selectedCategory);
          this.$set(this.currentQuestion, 'selectedPosition', this.questionForm[currentPage - 1].selectedPosition);
          this.$set(this.currentQuestion, 'loading', this.questionForm[currentPage - 1].loading);
        }

      },
      relationChange (value) {
        //重置relation相关参数
        if(value===false){
          this.currentQuestion.selectedCategory = []
          this.currentQuestion.selectedPosition = ''
          this.currentQuestion.loading = true
        }else {
          this.loadFinishedTemplate()
        }
      },
      confirmEdit () {
        //将最后一个页面填好的问题保存到questionForm中
        if (this.questionForm[this.currentPage - 1].type === 'table') {
          this.questionForm[this.currentPage - 1].title = this.currentQuestion.title;
          this.questionForm[this.currentPage - 1].col = this.currentQuestion.col;
        }else {
          this.questionForm[this.currentPage - 1].label = this.currentQuestion.label;
          this.questionForm[this.currentPage - 1].option = this.currentQuestion.option;
          this.questionForm[this.currentPage - 1].required = this.currentQuestion.required;
          this.questionForm[this.currentPage - 1].unique = this.currentQuestion.unique;
          this.questionForm[this.currentPage - 1].relation = this.currentQuestion.relation;
          this.questionForm[this.currentPage - 1].selectedCategory = this.currentQuestion.selectedCategory;
          this.questionForm[this.currentPage - 1].selectedPosition = this.currentQuestion.selectedPosition;
          this.questionForm[this.currentPage - 1].loading = this.currentQuestion.loading;
        }


        if (this.title === '' || this.introduction === '') {
          this.$message({
            message: 'Please enter the introduction and title of this template',
            type: 'warning',
            duration: 2000
          });
          this.introductionVisible = true;
          this.editQuestionVisible = false;
          return false
        }
        if (!this.verification()) {
          return
        }

        let self = this;
        self.$axios({
          url: this.ip + `/admin/postQuestion/${self.selectedNode.id}`,
          method: 'post',
          data: {
            data: self.questionForm,
            title: self.title,
            introduction: self.introduction
          }
        }).then(res => {
          if (res.data.result === 'success') {
            this.$message({
              message: 'Submit Success',
              type: 'success',
              duration: 2000
            })
            //todo: 树形菜单中对应节点的finished改为true，刷新页面，不能重复点击confirm按钮
            this.finished = true;
            this.selectedNode.finished = true;
//            this.$set(this.selectedNode, 'finished', true)
            this.editQuestionVisible = false;
            this.introductionVisible = false;
            console.log(self.selectedNode)
            console.log(this.treeData)
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage;
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
      verification () {
        //  判断是否有没填的问题
        for (let i = 0; i < this.questionForm.length; ++i) {
          if (this.questionForm[i].label === ''){
            this.$message({
              message: 'Question ' + this.questionForm[i].position + ' did not fill question',
              type: 'warning',
              duration: 2000
            });
            this.saveQuestion()
            this.currentPage = this.questionForm[i].position;
            return false
          }else if ( (this.questionForm[i].type === 'radio' || this.questionForm[i].type === 'checkbox' ||
              this.questionForm[i].type === 'select') && this.questionForm[i].option ==='') {
            this.$message({
              message: 'Question ' + this.questionForm[i].position + ' did not fill options',
              type: 'warning',
              duration: 2000
            });
            this.saveQuestion()
            this.currentPage = this.questionForm[i].position;
            return false
          }

          if (this.questionForm[i].relation) {
            if (this.questionForm[i].selectedCategory.length === 0) {
              this.$message({
                message: 'Question ' + this.questionForm[i].position + ' didn\'t select relation category',
                type: 'warning',
                duration: 2000
              });
              this.saveQuestion()
              this.currentPage = this.questionForm[i].position;
              return false
            }
            if (this.questionForm[i].selectedPosition === '') {
              this.$message({
                message: 'Question ' + this.questionForm[i].position + ' didn\'t select relation question',
                type: 'warning',
                duration: 2000
              });
              this.saveQuestion()
              this.currentPage = this.questionForm[i].position;
              return false
            }
          }
        }
        return true
      },
      updateTemplateIntroduction (){
        if (this.title === '' || this.introduction === '') {
          this.$message({
            message: 'Please enter the introduction and title of this template',
            type: 'warning',
            duration: 2000
          });
          return false
        }
        let self = this;
        self.$axios({
          url: this.ip + `/admin/updateTemplateIntroduction/${self.selectedNode.id}`,
          method: 'post',
          data: {
            title: self.title,
            introduction: self.introduction
          }
        }).then(res => {
          if (res.data.result === 'success') {
            this.$message({
              message: 'Submit Success',
              type: 'success',
              duration: 2000
            })
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage;
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
      updateTemplate () {
        //将最后一个页面填好的问题保存到questionForm中
        if (this.questionForm[this.currentPage - 1].type === 'table'){
          this.questionForm[this.currentPage - 1].title = this.currentQuestion.title;
          this.questionForm[this.currentPage - 1].col = this.currentQuestion.col;
        }else {
          this.questionForm[this.currentPage - 1].label = this.currentQuestion.label;
          this.questionForm[this.currentPage - 1].option = this.currentQuestion.option;
          this.questionForm[this.currentPage - 1].required = this.currentQuestion.required;
          this.questionForm[this.currentPage - 1].unique = this.currentQuestion.unique;
          this.questionForm[this.currentPage - 1].relation = this.currentQuestion.relation;
          this.questionForm[this.currentPage - 1].selectedCategory = this.currentQuestion.selectedCategory;
          this.questionForm[this.currentPage - 1].selectedPosition = this.currentQuestion.selectedPosition;
          this.questionForm[this.currentPage - 1].loading = this.currentQuestion.loading;
        }
        if (!this.verification()) {
          return
        }
//        console.log(this.questionForm)
        let self = this;
        self.$axios({
          url: this.ip + `/admin/updateQuestion/${self.selectedNode.id}`,
          method: 'post',
          data: {
            data: self.questionForm,
          }
        }).then(res => {
          if (res.data.result === 'success') {
            this.$message({
              message: 'Submit Success',
              type: 'success',
              duration: 2000
            })
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage;
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
      categoryChange (value) {
        this.currentQuestion.loading = true;
        this.currentQuestion.selectedPosition = '';
        this.options = [];
        let categoryId = value[value.length - 1]
        let self = this;
        self.$axios({
//          url: `/admin/getQuestion/${categoryId}`,
          url: this.ip + `/admin/getQuestion/${categoryId}`,
//          url: `http://121.42.252.18:5000/admin/getQuestion/${categoryId}`,
          method: 'get',
        }).then(res => {
          if (res.data.result === 'success') {
            this.options = res.data.data
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage;
            this.$message({
              message: errorMessage,
              type: 'error',
              duration: 2000
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
//        alert(value)
        this.currentQuestion.loading = false;
      },
      change1 (value){
//        alert(value+ '  ' + this.currentQuestion.selectedPosition)
      }


    }
  }
</script>

<style scoped="scoped">
  .filter-tree >>> .el-tree-node__label {
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .filter-tree >>>  .el-tree-node.is-current >.el-tree-node__content {
    background-color: #d8dce5;
    color: white;
  }
  .switch {
    height: 25px;
    /*line-height: 25px;*/
  }
  .switch >>> .el-switch__label{
    font-size: medium;
    font-weight: bold;
    color: #9E9E9E;
  }
  .switch >>>.el-switch__label.is-active {
    color:  #2196F3;
  }
  .questionTitle {
    font-weight: bold;
    color: #9E9E9E;
    margin-right: 30px;

  }
</style>
