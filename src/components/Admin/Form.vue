<template>
  <div class="div">
    <el-card>
      <el-form class="form">
        <el-row v-for="(row,rowIndex) in data.rows" type="flex" justify="start" :gutter="20">
          <el-col v-for="(col,index) in row.columns" :span="col.width">
            <el-form-item :label="col.label">
              <div v-if="col.type=='text'" class="col"><el-input v-model="col.value" size="mini"></el-input></div>
              <div v-if="col.type=='radio'" class="col">
                  <span class="radio">
                  <el-radio-group v-model="col.value">
                    <el-radio v-for="option in col.option" :label='option'></el-radio>
                  </el-radio-group>
                </span>
              </div>
              <div v-if="col.type=='textarea'" class="col"><el-input type="textarea" v-model="col.value" size="mini"></el-input></div>
            </el-form-item>
          </el-col>
          <span>
            <el-button size="mini" style="float: right;margin-top: 5px" @click="removeRow(rowIndex)">Remove</el-button>
          </span>


        </el-row>
        <el-form-item class="dialog-footer">
          <el-button type="primary" size="small" @click="submitForm('dynamicValidateForm')">Submit</el-button>
          <el-button size="small" @click="addNewRow">Add New Row</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--Edit Row-->
    <el-dialog title="Row" :visible.sync="outerVisible">
      <el-select class="select" v-model="columnsOfRow" placeholder="Number of columns" size="small"  @change="columnNumChange">
        <el-option
          v-for="item in [1,2,3,4]"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-form>
        <el-row type="flex" :gutter="20">
          <el-col v-for="(col,index) in row.columns" :span="col.width">
            <el-input size="mini" style="width: 46px;margin-bottom:10px" v-model="col.ratio" @change="ratioChange"></el-input>
            <el-card>
              <el-form-item :label="col.label">
                <div v-if="col.type=='text'" class="col"><el-input size="mini"></el-input></div>
                <div v-if="col.type=='radio'" class="col">
                  <span class="radio">
                  <el-radio-group>
                    <el-radio v-for="option in col.option" :label='option'></el-radio>
                  </el-radio-group>
                </span>
                </div>
                <div v-if="col.type=='textarea'" class="col"><el-input type="textarea" size="mini"></el-input></div>
              </el-form-item>
            </el-card>
            <el-button style="margin-top:10px" size="mini" type="primary" icon="el-icon-edit" @click="editColumn(index)"></el-button>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmEditRow">Confirm</el-button>
        <el-button size="small" @click="outerVisible = false">Cancel</el-button>
      </div>

      <!--内嵌dialog-->
      <el-dialog
        width="30%"
        title="Edit"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form label-width="80px">
          <el-form-item label="Label">
            <el-input v-model="column.label"></el-input>
          </el-form-item>
          <el-form-item label="Type">
            <el-select v-model="column.type" placeholder="Please Select">
              <el-option
                v-for="item in ['text','radio','textarea']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input class="optionInput" v-if="column.type == 'radio'" v-model="optionInput" placeholder="Please enter options,Separated by commas" @blur="optionInputBlur"></el-input>
          </el-form-item>
          <el-form-item label="Required">
            <el-select v-model="column.required" placeholder="Please Select">
              <el-option
                v-for="item in ['true','false']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="innerVisible = false">Confirm</el-button>
        </div>
      </el-dialog>
    </el-dialog>

  </div>
</template>

<script>
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'

  export default {
    components: {ElFormItem},
    data () {
      return {
        columnsOfRow: '',
        optionInput: '',
        outerVisible: false,
        innerVisible: false,
        data: {
          name: '123',
          rows: [
            {
              columns: [{label: 'Last Name', field: 'last_name', type: 'text', value: '', required: 'true'}, {label: 'First', field: 'first_name', type: 'text', value: ''}, {label: 'M.I', field: 'M_I', type: 'text', value: ''}]
            }
          ]
        },
        row: {
          columns: []
        },
        column: {}

      }
    },
    methods: {
      addNewRow () {
        // 初始化数据
        this.outerVisible = true
        this.columnsOfRow = ''
        this.row = {columns: []}
        this.column = {}
      },
      columnNumChange () {
        // 初始化row
        this.row.columns = []
        for (let i = 0; i < this.columnsOfRow; ++i) {
          this.row.columns.push({label: '', field: '', type: '', option: [], value: '', required: '', width: parseInt(24 / this.columnsOfRow), ratio: 1}) // 初始时等比例划分各个列1:1:1...
        }
      },
      // 列的比例改变时触发
      ratioChange (value) {
        var re = /^[1-9]+[0-9]*$/
        if (!re.test(value)) {
          this.$message({
            message: 'Please enter a positive integer',
            type: 'error',
            duration: 1000
          })
          return
        }
        let i = 0
        let sum = 0
        while (i < this.columnsOfRow) {
          sum += parseInt(this.row.columns[i].ratio)
          ++i
        }
        for (let j = 0; j < this.columnsOfRow; ++j) {
          this.row.columns[j].width = parseInt(24 * this.row.columns[j].ratio / sum)
        }
      },
      editColumn (index) {
        // 初始化column
        this.column = {}
        this.optionInput = ''
        this.innerVisible = true
        this.column = this.row.columns[index]
        if (this.column.type === 'radio') {
          this.optionInput = this.column.option.join(',')
        }
      },
      // 输入选项框失去焦点时触发，将选项拆分写入数组
      optionInputBlur () {
        this.column.option = this.optionInput.split(',')
        // 如果没填内容，则option仍然为空数组
        if (this.column.option.length === 1 && this.column.option[0] === '') {
          this.column.option = []
        }
      },
      confirmEditRow () {
        this.outerVisible = false
        this.data.rows.push(this.row)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      removeRow (rowIndex) {
        if (rowIndex !== -1) {
          this.data.rows.splice(rowIndex, 1)
        }
      },
      addRow () {
        this.data.rows.push({
          columns: [{label: 'Street Address', field: 'street_Address', type: 'text', value: ''}, {label: 'Apartment/Unit #', field: 'apartment', type: 'text', value: ''}]
        }
      )
      }
    }
  }
</script>

<style scoped>
  .div{
    text-align: center;
  }
  /*.dialog-footer{*/
    /*text-align: center*/
  /*}*/
  .form {
    padding: 10px;
    /*margin: 10px;*/
    background-color: #F7F7F7;
  }
  .el-form-item >>> label.el-form-item__label{
    /*display: block;*/
    max-width: 65%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /*color:red*/
  }
  .col {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .select{
    margin-bottom: 20px;
  }
  .optionInput {
    margin-top: 20px;
  }
  .radio{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
