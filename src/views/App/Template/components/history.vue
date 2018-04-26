<template>
  <div>
    <el-card>
      <div style="margin-bottom: 20px;width:100%">
        <el-row type="flex">
          <el-date-picker type="date" placeholder="Start Date" v-model="startDate" style="width: 200px;"></el-date-picker>
          <span style="margin:10px 10px 0 10px">-</span>
          <el-date-picker type="date" placeholder="End Date" v-model="endDate" style="width: 200px;margin-right: 10px"></el-date-picker>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleBatchDownload">Batch Download</el-button>
        </el-row>
      </div>
      <el-table
        :show-header="false"
        :data="tableData">
        <el-table-column min-width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" min-width="240">
          <template slot-scope="scope">
            <div style="float:right;">
              <el-button
                size="mini"
                type="success"
                @click="handleView(scope.$index, scope.row)">View</el-button>
              <el-button
                style="margin-right:10px"
                size="mini"
                type="primary"
                @click="modifyVisible = true;handleModify(scope.$index, scope.row)">Modify</el-button>
              <el-popover
                ref="popover5"
                placement="top"
                width="190"
                v-model="scope.row.popoverVisible">
                <p>Are you sure to delete?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.popoverVisible = false">Cancel</el-button>
                  <el-button type="primary" size="mini" @click="scope.row.popoverVisible= false;handleDelete(scope.$index, scope.row)">Confirm</el-button>
                </div>
              </el-popover>
              <el-button v-popover:popover5 size="mini" type="danger">Delete</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-pagination
        layout="prev, pager, next"
        :current-page="currentPage"
        @current-change="pageChange"
        :page-size="8"
        :total="total">
      </el-pagination>
    </el-card>

    <!--Modify Dialog-->
    <el-dialog
      title="Modify"
      :visible.sync="modifyVisible"
      width="50%"
      @close="closeModify">
      <modify-history ref="modifyHistory" style="margin:0 20px 50px 20px" :templateId="templateId" :historyId="selectedHistoryId"
                      :historyQuestionForm="questionForm" :historyName="name" v-on:updateSuccess="updateSuccess($event)"></modify-history>
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button size="small" @click="modifyVisible = false">Cancel</el-button>-->
        <!--<el-button size="small" type="primary" @click="modifyVisible = false">Update</el-button>-->
      <!--</span>-->
    </el-dialog>


  </div>
</template>

<script>
  import createForm from './createForm.vue'
  import modifyHistory from './modifyHistory.vue'
  export default {
    components: {
      createForm,
      modifyHistory
    },
    props: {
      templateId: {
        type: Number,
//        default:
      },
    },

    watch: {
      templateId (val, oldVal) {
        if ( val !== oldVal) {
          this.startDate = undefined;
          this.endDate = undefined;
          this.currentPage = 1;
//          this.loadHistory(1);
          this.selectedHistoryId = -1,
          this.questionForm = [];
          this.name = '';
          this.modifyVisible = false;
        }
      },
    },
    data() {
      return {
//        ip: 'http://121.42.252.18:5000',
//        ip:'http://192.168.0.15:5000',
        ip: '',
        startDate: undefined,
        endDate: undefined,
        currentPage:1,
        total: 0,
        tableData: [],
        selectedHistoryId: -1,
        questionForm: [],
        name: '',
        modifyVisible: false,
        updateIndex: -1 //记录更新的记录在tabledata里的index
      }

    },

    mounted () {
//      this.loadHistory(1)
    },
    methods: {
      loadHistory(currentPage, startDate, endDate) {
        let self = this;
        self.$axios({
          url: this.ip + `/app/getHistory/${self.templateId}?userId=${this.$store.getters.userId}&page=${currentPage}&limit=8&start_time=${startDate}&end_time=${endDate}`,
          method: 'get'
        }).then(res => {
          if (res.data.result === 'success') {
            self.total = res.data.total
            self.tableData = res.data.historyList;
            // 添加删除弹窗的visible
            for(let i = 0,len=this.tableData.length; i < len; ++i) {
              this.$set(this.tableData[i],'popoverVisible',false)
            }
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      pageChange(currentPage) {
        let self = this;
        self.currentPage = currentPage;
        loadHistory(currentPage)
//        self.currentQuestion = this.questionForm[currentPage - 1];
      },
      handleFilter() {
        //不选日期 就默认搜索所有历史
        this.loadHistory(1, this.startDate, this.endDate)
      },
      handleView(index, row) {
        window.open(this.ip + `/app/pdf/${this.templateId}?id=${row.id}&userId=${this.$store.getters.userId}`)
      },
      handleModify(index, row) {
        this.questionForm = row.info;
        this.selectedHistoryId = row.id;
        this.name = row.name;
        this.updateIndex = this.tableData.indexOf(row)
      },
      closeModify () {
        this.$refs.modifyHistory.resetForm()
      },
      updateSuccess (newForm) {
        let newQuestionForm = newForm[0]
        let newName = newForm[1]
        this.modifyVisible = false;
        //刷新列表
        this.tableData[this.updateIndex].name = newName;
        this.tableData[this.updateIndex].info = newQuestionForm
      },
      handleDelete(index, row) {
        let self = this;
        self.$axios({
          url: this.ip + `/app/deleteHistory/${row.id}?userId=${this.$store.getters.userId}`,
          method: 'delete'
        }).then(res => {
          if (res.data.result === 'success') {
            this.$message({
              message: 'Delete Success',
              type: 'success',
              duration: 2000
            })
            let index = this.tableData.indexOf(row)
            this.tableData.splice(index, 1)
          } else if (res.data.result === 'failure') {
            let errorMessage = res.data.errorMessage
            this.$message({
              message: errorMessage,
              type: 'error',
              duration: 2000
            })
//
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      handleBatchDownload() {
        if (typeof(this.startDate)=="undefined") {
          this.$message({
            message: 'Please select start date',
            type: 'warning',
            duration: 2000
          })
          return;
        }
        if (typeof(this.endDate)=="undefined") {
          this.$message({
            message: 'Please select end date',
            type: 'warning',
            duration: 2000
          })
          return;
        }
//        console.log(`http://121.42.252.18:5000/DownloadPdf/${this.templateId}?start_time=${this.startDate}&end_time=${this.endDate}`)
        window.open(this.ip + `/DownloadPdf/${this.templateId}?userId=${this.$store.getters.userId}&start_time=${this.startDate}&end_time=${this.endDate}`)
      }
    }
  }
</script>

<style scoped>

</style>
