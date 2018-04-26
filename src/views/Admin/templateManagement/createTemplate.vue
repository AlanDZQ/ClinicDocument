<template>
  <div class="app-container">
    <el-row type="flex" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="Please Enter Template Name"
          v-model="templateName"
          clearable
          style="margin-bottom: 10px;width: 100%">
        </el-input>
      </el-col>
      <el-col :span="8">
        <div>
          <el-cascader placeholder="Template Category" expand-trigger="click" :options="categoryCascader" v-model="selectedParentCategory"
                       :props="categoryProps" ref="catCascader" :show-all-levels="false"></el-cascader>
          <!--<el-button type="plain" @click="updateCategoryParent"><i class="fa fa-check no-margin" aria-hidden="true"></i> Apply-->
          <!--</el-button>-->
        </div>
      </el-col>
    </el-row>



    <el-row class="explanation">
      <code>{{code}}</code>
    </el-row>
    <div>
      <tinymce :height="200" v-model="content" :templateName="templateName" :templateCategory="selectedParentCategory"></tinymce>
    </div>
    <!--<div class="editor-content" v-html="content"></div>-->
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'tinymce-demo',
  components: { Tinymce },
  data() {
    return {
//      ip: 'http://121.42.252.18:5000',
//      ip: 'http://192.168.0.15:5000',
      ip: '',
      categoryCascader: [],
      selectedParentCategory: [],
      categoryProps: {
        value: 'id',
        children: 'children',
        label: 'name'
      },
      code: '文本 {{text}}  单选 {{radio}}  多选 {{checkbox}}  多行输入 {{textarea}}  下拉列表 {{select}}  图片 {{picture}}  表格 {{table:1-1}} 例子如下',
      templateName: '',
      content: ['<!DOCTYPE html><html><head></head><body>',
        '<table style="border-collapse: collapse; width: 100%; margin-left: auto; margin-right: auto;" border="1">',
        '<tbody>',
        '<tr style="height: 52px;">',
        '<td style="width: 100.035%; height: 52px;" colspan="7">',
        '<p style="text-align: center;">Applicant Information</p>',
        '</td>',
        '</tr>',
        '<tr style="height: 49px; text-align: center;">',
        '<td style="width: 16.4889%; height: 49px;" colspan="2">',
        '<p>Last Name</p>',
        '</td>',
        '<td style="width: 18.2888%; height: 49px;">{{text}}</td>',
        '<td style="width: 15.2568%; height: 49px;">',
        '<p>First Name</p>',
        '</td>',
        '<td style="width: 16.7288%; height: 49px;">{{text}}</td>',
        '<td style="width: 16.6046%; height: 49px;">',
        '<p>M.I.</p>',
        '</td>',
        '<td style="width: 16.6667%; height: 49px;">{{text}}</td>',
        '</tr>',
        '<tr style="height: 51px; text-align: center;">',
        '<td style="width: 16.4889%; height: 51px;" colspan="2">',
        '<p>Street Address</p>',
        '</td>',
        '<td style="width: 50.2744%; height: 51px;" colspan="3">{{text}}</td>',
        '<td style="width: 16.6046%; height: 51px;">',
        '<p>Apartment/Unit</p>',
        '</td>',
        '<td style="width: 16.6667%; height: 51px;">{{select}}</td>',
        '</tr>',
        '<tr style="height: 48px; text-align: center;">',
        '<td style="width: 16.4889%; height: 14px;" colspan="2">',
        '<p>City</p>',
        '</td>',
        '<td style="width: 18.2888%; height: 14px;">{{text}}</td>',
        '<td style="width: 15.2568%; height: 14px;">',
        '<p>State</p>',
        '</td>',
        '<td style="width: 16.7288%; height: 14px;">{{text}}</td>',
        '<td style="width: 16.6046%; height: 14px;">',
        '<p>ZIP</p>',
        '</td>',
        '<td style="width: 16.6667%; height: 14px;">{{text}}</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="width: 5.06387%; height: 230px; text-align: center;" rowspan="5"><br />',
        '<p>&nbsp;</p>',
        '<p>Work Experience</p>',
        '<p>&nbsp;</p>',
        '<p>&nbsp;</p>',
        '</td>',
        '<td style="width: 29.7139%; height: 46px; text-align: center;" colspan="2">Starting and Ending Months</td>',
        '<td style="width: 31.9856%; height: 46px; text-align: center;" colspan="2">Work Unit</td>',
        '<td style="width: 33.2713%; height: 46px; text-align: center;" colspan="2">Main Duty</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="width: 29.7139%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-1}}</p>',
        '</td>',
        '<td style="width: 31.9856%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-2}}</p>',
        '</td>',
        '<td style="width: 33.2713%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-3}}</p>',
        '</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="width: 29.7139%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-1}}</p>',
        '</td>',
        '<td style="width: 31.9856%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-2}}</p>',
        '</td>',
        '<td style="width: 33.2713%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-3}}</p>',
        '</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="height: 46px; width: 29.7139%; text-align: center;" colspan="2">',
        '<p>{{table:1-1}}</p>',
        '</td>',
        '<td style="height: 46px; width: 31.9856%; text-align: center;" colspan="2">',
        '<p>{{table:1-2}}</p>',
        '</td>',
        '<td style="height: 46px; width: 33.2713%; text-align: center;" colspan="2">',
        '<p>{{table:1-3}}</p>',
        '</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="width: 29.7139%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-1}}</p>',
        '</td>',
        '<td style="width: 31.9856%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-2}}</p>',
        '</td>',
        '<td style="width: 33.2713%; height: 46px; text-align: center;" colspan="2">',
        '<p>{{table:1-3}}</p>',
        '</td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</body></html>'].join("")
    }
  },
  methods: {
    loadCategories() {
      let self = this;
      self.$axios({
        method: 'get',
        url: this.ip + '/admin/getAllCategory',
//        url: 'http://192.168.0.15:5000/admin/getAllCategory',
//        url: 'http://121.42.252.18:5000/admin/getAllCategory',
      }).then(res => {
        if (res.data.result === 'success') {
          self.categoryCascader = res.data.treeData;
          let tempTree = res.data.treeData;
          this.depthTraversal(tempTree[0])

          console.log(tempTree)
          self.categoryCascader = tempTree;
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
    //深度遍历 删除children为[]的obj的children属性
    depthTraversal(treeNode) {
      if (treeNode.children.length !== 0) {
        for (let i = 0; i < treeNode.children.length; ++i) {
          this.depthTraversal(treeNode.children[i])
        }
      }else if (treeNode.children.length === 0) {
        delete treeNode.children
      }

    }
  },
  mounted: function () {
    let self = this;
    self.loadCategories();
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
.explanation {
  background: #eef1f6;
  padding: 15px 10px;
  margin-bottom: 20px;
  display: block;
  line-height: 36px;
}
</style>


