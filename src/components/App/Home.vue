<template>
  <div class="main">
    <div class="header">
      <img src="../../../static/picture/timg.jpg" width="100%" height="300"/>
      <h1 style="font-size: 40px; position:absolute;left: 10%;top:40%;"><em>Clinic Document Generation System</em></h1>
    </div>
    <el-row>
      <el-col :span="5">
        <el-row>
          <el-input
            placeholder="Enter the keyword to filter"
            v-model="filterText"
            size="medium"
            style="width:auto ;float:left;font-size: 16px">
          </el-input>
        </el-row>
        <br>
        <el-row>
          <el-tree
            class="filter-tree"
            empty-text="No Data"
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree2">
          </el-tree>
        </el-row>



      </el-col>
      <el-col :span="19">
        <!--Create New-->
        <div v-if="nodeClick">
          <div v-if="!historyClick">
            <el-row>
              <em >{{data.label}}</em>
              <el-button style="float:right;" type="text" @click="viewHistory">view history</el-button>
            </el-row>
            <el-card class="card">
              <div v-html="data.html"></div>
              <br>
              <el-button type="small" @click="submit">submit</el-button>
            </el-card>
          </div>
        </div>

        <!--View History-->
        <div v-if="historyClick">
          <el-row>
            <em style="text-align: center">{{data.label}}</em>
            <el-button style="float:right;" type="text" @click="createNewForm">create new</el-button>
          </el-row>
          <el-table
            ref="table"
            :show-header="false"
            :data="historyTable"
            :stripe=true
            :row-key="getRowKeys"
            :expand-row-keys="expandRowKeys"
            @expand-change="expandChange"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-card class="card">
                  <div class="historyHtml" v-html="props.row.html"></div>
                  <br>
                  <div v-if="props.row.editClick">
                    <el-button type="small" @click="update(props.row)">update</el-button>
                    <el-button type="small" @click="cancelUpdate(props.row)">cancel</el-button>
                  </div>
                </el-card>
                <br>
                <div v-if="!props.row.editClick" style="float:right">
                  <el-button type="primary" size="small" @click="editHistory(props.row)">edit</el-button>
                  <el-button type="primary" size="small" @click="downLoad(props.row)">down load</el-button>
                </div>
              </template>
            </el-table-column>
            <!--显示表单创建日期-->
            <el-table-column
              min-width="20px">
              <template slot-scope="scope">
                <span><i class="el-icon-time"></i><span style="margin-left: 10px">{{ scope.row.date }}</span></span>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <div class="block">
            <el-pagination
              @current-change="handleCurrentPageChange"
              :current-page.sync="currentPage"
              :page-size="1"
              layout="prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>


      </el-col>
    </el-row>
  </div>

</template>

<script>
  import store from '@/store'
  import { mapState,mapMutations } from 'vuex'

  export default {
    components: {
    },
    //  name: 'HelloWorld',
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },

    mounted () {
      this.loadTree()
    },
    data () {
      return {
        nodeClick: false,
        historyClick: false,
        data: {},
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        expandRowKeys: [],
        currentPage: 1,
        total: 1,
        historyTable: [],
        historyHtml: [], // 记录初始的HTML
        getRowKeys (row) {
          // todo:不好使
//          console.log(row)
//          return row.id
        }
      }
    },
    methods: {
      submit () {
        document.getElementById('table').submit()
//        document.getElementById('form').submit()
        this.$message({
          message: 'Submit Success',
          type: 'success',
          duration: 2000
        })
//        var data = '0=' + $('#0').val() + "&1=" + $('#1').val() + "&2=" + $('#2').val() + "&3=" + $('#3').val();
//        let self = this
//        console.log(document.getElementById('form'))
//        self.$axios({
//          url: `/submit/${self.data.label}`,
//          method: 'post'
////          data: data
//        }).then(res => {
//          if (res.data.result === 'success') {
//            this.$message({
//              message: 'Submit Success',
//              type: 'success',
//              duration: 2000
//            })
////            console.log(document.getElementById('form').serialize())
//          } else if (res.data.result === 'failure') {
//            let errorMessage = res.data.errorMessage
//            this.$message({
//              message: errorMessage,
//              type: 'error',
//              duration: 2000
//            })
//          }
//        }).catch(function (error) {
//          console.log(error)
//        })
      },
      loadTree () {
        let self = this
        self.$axios({
          url: `/getTreeTable`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            for (let i = 0; i < res.data.data.length; ++i) {
              self.treeData.push({id: i + 1, label: res.data.data[i]})
            }
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
        return data.label.indexOf(value) !== -1
      },
      handleNodeClick (data) {
        if (data.children !== undefined) {
          return
        }
        this.nodeClick = true
        this.historyClick = false // 子组件默认显示create new 页面
        let self = this
        self.$axios({
          url: `/getFormDetail/${data.label}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            this.$set(self.data, 'html', '')// 以这种方式添加的新属性才能实现双向绑定，新属性增加get和set监听
            this.$set(self.data, 'label', '')
            self.data.html = res.data.data
            self.data.label = data.label
//            console.log(self.data)
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
      viewHistory () {
        this.historyClick = true
        this.currentPage = 1
        let self = this
        // 请求总页数
        self.$axios.get(`/getHistory/${self.data.label}/pageNum`, {
        }).then(function (res) {
          if (res.data.result === 'success') {
            self.total = res.data.total
          }
        }).catch(function (error) {
          console.log(error)
        })
        // 请求historyTable
        self.$axios({
          url: `/getHistory/${self.data.label}?page=1`,
          method: 'get'
        }).then((res) => {
          if (res.data.result === 'success') {
            self.historyTable = []
            self.historyTable = res.data.history
            // 添加editClick，当用户点击edit时，隐藏掉这一条的edit和download按钮
            for (let i = 0; i < self.historyTable.length; ++i) {
              this.$set(self.historyTable[i], 'editClick', false)
              this.$set(self.historyTable[i], 'id', `${i}`)
            }
            // 记录初始的html
            self.historyHtml = []
            for (let i = 0; i < self.historyTable.length; ++i) {
              self.historyHtml.push(self.historyTable[i].html)
            }
            console.log(self.historyTable)
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
//       点击列表下拉触发事件
      expandChange (row, expandedRows) {
        // 点击下拉列表，还原成默认的html
//        console.log(row)
        this.cancelUpdate(row)
      },
      createNewForm () {
        this.historyClick = false
      },
      handleCurrentPageChange () {
        let self = this
        self.$axios({
          url: `/getHistory/${self.data.label}?page=${self.currentPage}`,
          method: 'get'
        }).then((res) => {
          if (res.data.result === 'success') {
            self.historyTable = []
            self.historyTable = res.data.history
            // 添加editClick，当用户点击edit时，隐藏掉这一条的edit和download按钮
            for (let i = 0; i < self.historyTable.length; ++i) {
              this.$set(self.historyTable[i], 'editClick', false)
              this.$set(self.historyTable[i], 'id', `${i}`)
            }
            // 记录初始的html
            self.historyHtml = []
            for (let i = 0; i < self.historyTable.length; ++i) {
              self.historyHtml.push(self.historyTable[i].html)
            }
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage
            this.$message({
              message: errorMessage,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      editHistory (row) {
        let index = this.historyTable.indexOf(row)
        let formId = `table${index}`
        // 请求可修改的historyHTML
        let self = this
        self.$axios({
          url: `/update/${self.data.label}`,
          method: 'post',
          data: {
            time: row.date,
            formId: formId
          }
        }).then((res) => {
          if (res.data.result === 'success') {
            row.html = res.data.data
            // 不显示edit和download按钮
            row.editClick = true
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
      update (row) {
        let self = this
        let index = this.historyTable.indexOf(row)
        document.getElementById(`table${index}`).submit()
        this.$message({
          message: 'Submit Success',
          type: 'success',
          duration: 2000
        })
        // 更新完重新发请求 刷新页面
        if (self && !self._isDestroyed) {
          setTimeout(() => {
            if (self && !self._isDestroyed) {
              self.handleCurrentPageChange()
            }
          }, 100)
        }
        // 展开刚刚修改的那行
//        self.expandRowKeys = []
//        self.expandRowKeys.push(row.id)
//        console.log(row.id)
      },
      cancelUpdate (row) {
        let index = this.historyTable.indexOf(row)
        row.editClick = false
        row.html = this.historyHtml[index]
      },
      downLoad (row) {
        window.open(`/download/${this.data.label}?time=${row.date}`)
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "../../common/main.css";
  @import "../../common/color-dark.css";
  .main{
    margin-left: 10%;
    margin-right: 10%;
    /*background-image: url("../../../static/picture/背景.jpg");*/
    /*background-repeat:repeat-x;*/
  }
  .header{
    position:relative;
    margin-bottom: 50px;
  }
  .filter-tree >>> .el-tree-node__label {
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .filter-tree {
    width: 90%;
  }
  .title{

    text-align: center;
    margin-top: 60px;
  }


  /*.historyHtml table{*/
    /*width: 100%;*/
  /*}*/
  .historyHtml >>> table td{
    border-bottom:1px
  }
</style>



