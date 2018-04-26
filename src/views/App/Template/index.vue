<template>
  <div class="template">
    <div class="section_header">
      <h3>Template</h3>
    </div>
    <el-row type="flex" :gutter="50">
      <el-col :span="6">
        <div style="margin-bottom: 55px">
          <el-input
            placeholder="Enter keywords to filter Template"
            v-model="filterText"
            size="medium"
            style="width:100% ;float:left;font-size: 16px">
          </el-input>
        </div>
        <div>
          <el-card>
            <el-tree
              class="filter-tree"
              empty-text="No Data"
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
              ref="tree">
            </el-tree>
          </el-card>
        </div>
      </el-col>

      <el-col :span="18" v-if="nodeClick">
        <div class="introduction-title">
          <h3>{{title}}</h3>
          <div style="float:right">
            <el-button type="success" size="small" @click="createForm">Create Form</el-button>
            <el-button type="primary" size="small" @click="viewHistory">View History</el-button>
          </div>
        </div>
        <!--Introduction-->
        <el-card style="margin-top:20px" v-show="introductionVisible">
          <div class="introduction-content" v-html="introduction">
            <!--{{introduction}}-->
          </div>
        </el-card>
        <!--<el-input-->
          <!--type="textarea"-->
          <!--:autosize="{ minRows: 4, maxRows: 10}"-->
          <!--placeholder="Please enter description of the template"-->
          <!--v-model="introduction">-->
        <!--</el-input>-->
        <!--<el-button @click="test"></el-button>-->
        <!--Create Form-->
        <div style="margin-top:20px" v-show="createVisible">
          <create-form :templateId="selectedTemplateId"></create-form>
        </div>
        <!--View History-->
        <div style="margin-top:20px" v-show="viewHistoryVisible">
          <history ref="history" :templateId="selectedTemplateId"></history>
        </div>
      </el-col>

    </el-row>
  </div>

</template>

<script>
  import store from '@/store'
  import { mapState,mapMutations } from 'vuex'
  import createForm from './components/createForm.vue'
  import history from './components/history.vue'
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {
      ElButton,
      createForm,
      history
    },
    //  name: 'HelloWorld',
    watch: {
        filterText (val) {
        this.$refs.tree.filter(val)
      }
    },

    mounted () {
      this.loadTree()
    },
    data () {
      return {
//        ip: 'http://121.42.252.18:5000',
//        ip:'http://192.168.0.15:5000',
        ip: '',
        title: '',
        introduction: '',
        nodeClick: false,
        introductionVisible: false,
        createVisible: false,
        viewHistoryVisible: false,
        selectedTemplateId:undefined,
        filterText: '',
        treeData: [],
        defaultProps: {
          value: 'id',
          children: 'children',
          label: 'name'
        },
      }
    },
    methods: {
      loadTree () {
        let self = this
        self.$axios({
          url: this.ip +  `/app/getTemplate/${this.$store.getters.userId}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            self.treeData = res.data.treeData
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
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      handleNodeClick (data) {
        //点击根节点不触发
        if (data.children !== undefined) {
          return
        }
        //如果点击相同的叶节点 也不触发
        if (this.selectedTemplateId === data.id) {
          return
        }
        this.selectedTemplateId = data.id
        //请求Introduction
        this.getIntroduction();

//        alert(this.selectedTemplateId)
//        this.activeName = 'first';
        this.nodeClick = true;
        this.introductionVisible = true;
        this.createVisible = false;
        this.viewHistoryVisible = false;
      },
      getIntroduction () {
        let self = this
        self.$axios({
          url:  this.ip +  `/app/getTemplateIntroduction/${self.selectedTemplateId}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            self.title = res.data.title;
            self.introduction = res.data.introduction.replace(/(\r\n)|(\n)/g,'<br>');
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
      createForm () {
        this.introductionVisible = false;
        this.viewHistoryVisible = false;
        this.createVisible = true;

      },
      viewHistory () {
        this.introductionVisible = false;
        this.createVisible = false;
        this.viewHistoryVisible = true;
        this.$refs.history.loadHistory(1)
      },
      test () {
        let str = '123'
        str = str + this.introduction
        console.log(str)
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .template {
    padding: 40px 10%;
    /*position: absolute;*/
    background-color: #f5f5f5;
    width: 100%;
    min-height:615px;
    /*height: 100%;*/
  }
  .section_header {
    width: 100%;
    margin-bottom: 30px;
    display: block;
  }
  .section_header h3 {
    font-weight: 300;
    font-style: italic;
    font-size: 27px;
    border-bottom: 1px solid #B4B4B4;
    padding-bottom: 0px;
    display: inline-block;
    margin: 0;
  }
  .introduction-title h3{
    font-weight: 300;
    font-style: italic;
    font-size: 27px;
    border-bottom: 1px solid #B4B4B4;
    padding-bottom: 0px;
    display: inline-block;
    margin: 0;
  }
  .introduction-content{
    /*white-space:pre;*/
    /*word-wrap:break-word;*/
    /*word-break:break-all;*/
    /*overflow: hidden;!*这个参数根据需要来绝对要不要*!*/
    /*width: 60%;*/
    font-weight: 100;
    font-style: oblique;
    font-family: inherit;
    font-size: 25px;
    border-bottom: 0px solid rgba(99, 99, 99, 0.6);
    padding-bottom: 0px;
    display: inline-block;
    margin: 0;
  }
  .top {
    width: 20px;
    background-color: slategrey;
  }
  .header{
    position:relative;
    margin-bottom: 50px;
    width:50px;
    background-color:black;
  }
  .main{
    margin-left: 10%;
    margin-right: 10%;
    /*background-image: url("../../../static/picture/背景.jpg");*/
    /*background-repeat:repeat-x;*/
  }

  .filter-tree >>> .el-tree-node__label {
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .filter-tree >>>  .el-tree-node.is-current >.el-tree-node__content {
    background-color: darkgray;
    color: white;
  }
  .filter-tree {
    width: 90%;
  }
  .title{
    text-align: center;
    margin-top: 60px;
  }

</style>




