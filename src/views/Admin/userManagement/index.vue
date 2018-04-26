<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="User Name" v-model="listQuery.username">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="Email" v-model="listQuery.email">
      </el-input>
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="Sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">Search</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">Add</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="handleDownload">Export</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="give me some more time" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="Id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="User Name">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="Email">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="Tel">
        <template slot-scope="scope">
          <span>{{scope.row.tel}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="Password">
        <template slot-scope="scope">
          <span>{{scope.row.password}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations" min-width="250" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="handleUpdate(scope.row)">edit</el-button>
          <el-button size="mini" type="primary" @click="handleEditTemplate(scope.row)">template</el-button>
          <el-button v-if="scope.row.status!='enabled'" size="mini" type="success" @click="handleModifyStatus(scope.row,'enabled')">enabled
          </el-button>
          <el-button v-if="scope.row.status!='disabled'" size="mini" @click="handleModifyStatus(scope.row,'disabled')">disabled
          </el-button>
          <el-popover
            ref="popover5"
            placement="top"
            width="190"
            v-model="scope.row.popoverVisible">
            <p>Are you sure to delete the user <b>{{scope.row.username}}</b> ?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.popoverVisible = false">Cancel</el-button>
              <el-button type="primary" size="mini" @click="scope.row.popoverVisible= false;handleDelete(scope.row)">Confirm</el-button>
            </div>
          </el-popover>
          <el-button v-popover:popover5 size="mini" type="danger">delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--Edit-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item v-if="dialogStatus=='create'" label="UserName" prop="username">
          <el-input v-model="temp.username"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="UserName" prop="username">
          <el-input v-model="temp.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Passsword" prop="password">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
        <el-form-item label="Tel" prop="tel">
          <el-input v-model="temp.tel"></el-input>
        </el-form-item>
        <el-form-item label="Status">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please Select">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">Confirm</el-button>
        <el-button v-else type="primary" @click="updateData">Confirm</el-button>
      </div>
    </el-dialog>

    <!--Template-->
    <el-dialog :title="'Assign Templates to User '+ temp.username" :visible.sync="dialogTemplateVisible">
      <el-row type="flex" :gutter="20">
        <el-col :span="10">
          <el-card>
            <el-input
              style="margin-bottom: 5px"
              placeholder="Filter"
              v-model="filterText1">
            </el-input>
            <el-tree
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              node-key="id"
              :filter-node-method="filterNode1"
              show-checkbox
              ref="tree1">
              <!--@check-change="handleCheckChange"-->
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="4">
          <div>
            <el-button @click="editUserTemplate" type="primary" size="mini" style="display:inline-block;position: absolute;top:40%;left:46%">Apply<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </div>
        </el-col>
        <el-col :span="10">
          <el-card>
            <el-input
              style="margin-bottom: 5px"
              placeholder="Filter"
              v-model="filterText2">
            </el-input>
            <el-tree
              class="filter-tree"
              :data="selectedTreeData"
              :props="defaultProps"
              default-expand-all
              node-key="id"
              :filter-node-method="filterNode2"
              ref="tree2">
            </el-tree>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTemplateVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmEditUserTemplate();dialogTemplateVisible = false">Confirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList,  createUser, updateUser, deleteUser} from '@/api/user'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {ElButton},
    name: 'complexTable',
    directives: {
      waves
    },
    watch: {
      filterText1(val) {
        this.$refs.tree1.filter(val);
      },
      filterText2(val) {
        this.$refs.tree2.filter(val);
      }
    },

    data() {
      return {
//        ip: 'http://121.42.252.18:5000',
//        ip: 'http://192.168.0.15:5000',
        ip: '',
        filterText1: '',
        filterText2: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        selectedTreeData: [],
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          tel: undefined,
          password: undefined,
          username: undefined,
          email: undefined,
          sort: '+id'
        },
        sortOptions: [{ label: 'Ascending  by ID', key: '+id' }, { label: 'Descending by ID', key: '-id' }],
        statusOptions: ['enabled', 'disabled'],
        temp: {
          id: '',
          username: '',
          password: '',
//          timestamp: new Date(),
          email: '',
          tel: '',
          status: 'enabled'
        },
        dialogFormVisible: false,
        dialogTemplateVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        popoverVisible: false,
        pvData: [],
        rules: {
          username: [{ required: true, message: 'user name is required', trigger: 'change' }],
          password: [{ required: true, message: 'password is required', trigger: 'change' }],
          email: [{ required: true, message: 'email is required', trigger: 'blur' }]
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          enabled: 'success',
          disabled: 'info'
        }
        return statusMap[status]
      },
    },
    created() {
      this.getList()
      this.getAllFinishedTemplate()
    },
    methods: {
      filterNode1(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      filterNode2(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },

      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          // 添加删除弹窗的visible
          for(let i = 0,len=this.list.length; i < len; ++i) {
            this.$set(this.list[i],'popoverVisible',false)
          }
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleModifyStatus(row, status) {
        row.status = status
        updateUser(row).then((res) => {
          if(res.data.result === 'success'){
            row.status = status
            this.$message({
              message: 'The operation is successful',
              type: 'success'
            })
          }
        })
      },
      resetTemp() {
        this.temp = {
          id: '',
          username: '',
          password: '',
//          timestamp: new Date(),
          email: '',
          tel: '',
          status: 'enabled'
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //treeData用于保存该用户的模板树形菜单
            this.temp.treeData = []
            createUser(this.temp).then((res) => {
              if(res.data.result === 'success'){
                this.temp.id = res.data.id
                this.list.unshift(this.temp)
                this.dialogFormVisible = false
                this.$notify({
                  title: 'Success!',
                  message: 'Create Success',
                  type: 'success',
                  duration: 2000
                })
              }else if(res.data.result === 'failure'){
                this.$message({
                  message: res.data.errorMessage,
                  type: 'error'
                })
              }

            })
          }
        })
      },
      //获取所有模板列表
      getAllFinishedTemplate () {
        let self = this;
        self.$axios({
          method: 'get',
          url: this.ip + '/admin/getAllFinishedTemplate',
        }).then(res => {
          if (res.data.result === 'success') {
            this.treeData = res.data.treeData[0].children
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleEditTemplate (row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogTemplateVisible = true
        //请求该用户的模板树形菜单, 如果用户已选则把treeTable中已选的勾选上
        let self = this
        self.$axios({
          method: 'get',
          url: this.ip + `/admin/getTemplate/${row.id}`,
        }).then(res => {
          if (res.data.result === 'success') {
            this.selectedTreeData = res.data.treeData
            //清空左侧勾选
            this.$refs.tree1.setCheckedKeys([]);

            // 如果用户模板不为空 则勾选左边对应的模板
            if (this.selectedTreeData.length !== 0) {
              let selectedKeys = []
              this.depthTraversalFindKeys(this.selectedTreeData, selectedKeys)
              console.log(selectedKeys)
              this.$refs.tree1.setCheckedKeys(selectedKeys)
            }
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
      editUserTemplate () {
        let checkedKeys = this.$refs.tree1.getCheckedKeys()
        let halfCheckedKeys = this.$refs.tree1.getHalfCheckedKeys()
        let selectedNodes = checkedKeys.concat(halfCheckedKeys)
        this.selectedTreeData = [];
        this.treeDeepCopy(this.treeData,this.selectedTreeData)
        this.depthTraversal(this.selectedTreeData, selectedNodes)
      },
      confirmEditUserTemplate () {
        let self = this;
        self.$axios({
          method: 'put',
          url: this.ip + `/admin/editUserTemplate/${this.temp.id}`,
          data:{
            treeData: this.selectedTreeData
          }
        }).then(res => {
          if (res.data.result === 'success') {
            this.$message({
              message: 'Success',
              type: 'success'
            });
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
      //树的深拷贝
      treeDeepCopy (tree,copyTree) {
        for (let i = 0, len = tree.length;i < len; ++i) {
//          console.log(treeArray[i])
          copyTree.push({id: tree[i].id, label: tree[i].label, name: tree[i].name})
          if('children' in tree[i]) {
            copyTree[i].children = []
            this.treeDeepCopy(tree[i].children,copyTree[i].children)
          }

        }

      },
      // 递归遍历 找到用户列表中的所有模板的id,
      depthTraversalFindKeys(treeArray,selectedKeys) {
        for (let i = 0, len = treeArray.length;i < len; ++i) {
//          console.log(treeArray[i])
          if (selectedKeys.indexOf(treeArray[i].id) === -1) {
            // 在选中的列表里==index  不在 == -1
            if('children' in treeArray[i]) {
              this.depthTraversalFindKeys(treeArray[i].children, selectedKeys);
            }else{
              //只把叶节点的id存入数组，根节点会根据叶节点的选中状态自动勾选成半选中状态或其他状态
              selectedKeys.push(treeArray[i].id)
            }
          }
        }
      },
      // 递归遍历 找到选中的节点, 没有选中的节点从treeArray中删除
      depthTraversal(treeArray,selectedNodes) {
        for (let i = 0, len = treeArray.length;i < len; ++i) {
//          console.log(treeArray[i])
          if (selectedNodes.indexOf(treeArray[i].id) !== -1) {
            // 在选中的列表里==0  不在 == -1
            if('children' in treeArray[i]) {
              this.depthTraversal(treeArray[i].children, selectedNodes);
            }
          } else {
            // 删除了一个元素 如果这个元素不是最后一个 索引减一才能搜索到下一个元素
            treeArray.splice(i,1);
            --i;
            --len;
          }
        }
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
//            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateUser(tempData).then((res) => {
              if(res.data.result === 'success'){
                for (const v of this.list) {
                  if (v.id === this.temp.id) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, this.temp)
                    break
                  }
                }
                this.dialogFormVisible = false
                this.$notify({
                  title: 'Success!',
                  message: 'Update Success',
                  type: 'success',
                  duration: 2000
                })
              }
            })
          }
        })
      },
      handleDelete(row) {
//        row.popoverVisible = false
        deleteUser(row).then((res) => {
          if(res.data.result === 'success'){
            this.$notify({
              title: 'Success!',
              message: 'Delete Success',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }else if(res.data.result === 'failure'){
            this.$message({
              message: res.data.errorMessage,
              type: 'error'
            })
          }

        })

      },
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['User Name', 'Email', 'Tel']
          const filterVal = ['username', 'email', 'tel']
          const data = this.formatJson(filterVal, this.list)
          export_json_to_excel(tHeader, data, 'tableData')
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
