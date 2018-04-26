<template>
  <div class="main">
    <el-row type="flex">
      <el-col :span="4" class="sidebar">
        <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">-->
          <!--<el-radio-button :label="false">展开</el-radio-button>-->
          <!--<el-radio-button :label="true">收起</el-radio-button>-->
        <!--</el-radio-group>-->
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <!--<el-submenu index="1">-->
            <!--<template slot="title">-->
              <!--<i class="el-icon-location"></i>-->
              <!--<span slot="title">All Template</span>-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
              <!--<span slot="title">Group 1</span>-->
              <!--<el-menu-item index="1-1">Template 1</el-menu-item>-->
              <!--<el-menu-item index="1-2">Template 2</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--<el-menu-item-group title="Group 2">-->
              <!--<el-menu-item index="1-3">Template 3</el-menu-item>-->
            <!--</el-menu-item-group>-->
          <!--</el-submenu>-->
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">Create Template</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-setting"></i>
            <span slot="title">...</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="20" class="right">
        <el-row style="margin-bottom: 10px">
          <div class="avatar-wrapper">
            <img class="user-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
          </div>
        </el-row>

        <div class="components-container">
          <el-input
            placeholder="Please Enter Template Name"
            v-model="templateName"
            clearable
            style="margin-bottom: 10px;width: 50%">
          </el-input>

          <el-row class="explanation">
            <code>{{code}}</code>
          </el-row>
          <div>
            <tinymce :height="200" v-model="content" :templateName="templateName"></tinymce>
          </div>
          <!--<div class="editor-content" v-html="content"></div>-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'

  export default {
    components: {
      Tinymce
    },
    watch: {
    },

    data () {
      return {
        code: '目前支持文本格式和选择. 若是文本,在表格中写入{{text}} 若是选择{{option,single,option1,option2}},例子如下',
        templateName: '',
        isCollapse: false,
        content: ['<!DOCTYPE html>',
          '<html>',
          '<head>',
          '</head>',
          '<body>',
          '<table style="border-collapse: collapse; width: 100%;" border="1">',
          '<tbody>',
          '<tr style="height: 52px;">',
          '<td style="width: 100%; height: 52px;" colspan="6">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Applicant Information</p>',
          '</td>',
          '</tr>',
          '<tr style="height: 49px;">',
          '<td style="width: 20.8636%; height: 49px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; Last Name</p>',
          '</td>',
          '<td style="width: 17.2317%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{{text}}</td>',
          '<td style="width: 11.9048%; height: 49px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; First</p>',
          '</td>',
          '<td style="width: 16.6667%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{text}}</td>',
          '<td style="width: 16.6667%; height: 49px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; M.I.</p>',
          '</td>',
          '<td style="width: 16.6667%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{{text}}</td>',
          '</tr>',
          '<tr style="height: 78px;">',
          '<td style="width: 20.8636%; height: 78px;">',
          '<p>&nbsp; &nbsp; &nbsp;Street Address</p>',
          '</td>',
          '<td style="width: 45.8032%; height: 78px;" colspan="3">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{text}}</td>',
          '<td style="width: 16.6667%; height: 78px;">',
          '<p>&nbsp; &nbsp; &nbsp;Apartment/Unit #</p>',
          '</td>',
          '<td style="width: 16.6667%; height: 78px;">&nbsp; &nbsp; &nbsp; &nbsp;{{text}}</td>',
          '</tr>',
          '<tr style="height: 48px;">',
          '<td style="width: 20.8636%; height: 48px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; City</p>',
          '</td>',
          '<td style="width: 17.2317%; height: 48px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{{text}}</td>',
          '<td style="width: 11.9048%; height: 48px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; State</p>',
          '</td>',
          '<td style="width: 16.6667%; height: 48px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;{{text}}</td>',
          '<td style="width: 16.6667%; height: 48px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ZIP</p>',
          '</td>',
          '<td style="width: 16.6667%; height: 48px;">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;{{text}}</td>',
          '</tr>',
          '<tr style="height: 49px;">',
          '<td style="width: 20.8636%; height: 43px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Phone #:</p>',
          '</td>',
          '<td style="width: 17.2317%; height: 43px;" colspan="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{text}}</td>',
          '<td style="width: 16.6667%; height: 43px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Alternate #</td>',
          '<td style="width: 16.6667%; height: 43px;" colspan="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;{{text}}</td>',
          '</tr>',
          '<tr style="height: 51px;">',
          '<td style="width: 20.8636%; height: 51px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp;Email Address:</p>',
          '</td>',
          '<td style="width: 17.2317%; height: 51px;" colspan="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{text}}</td>',
          '<td style="width: 16.6667%; height: 51px;">',
          '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Issued State: &nbsp; &nbsp;&nbsp;</p>',
          '</td>',
          '<td style="width: 16.6667%; height: 51px;" colspan="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;{{text}}</td>',
          '</tr>',
          '<tr style="height: 88px;">',
          '<td style="width: 20.8636%; height: 88px;">',
          '<p>&nbsp; &nbsp; &nbsp;&nbsp;Are you a citizen of the United States?</p>',
          '</td>',
          '<td style="width: 17.2317%; height: 88px;" colspan="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{option,single,yes,no}}</td>',
          '<td style="width: 16.6667%; height: 88px;">&nbsp;</td>',
          '<td style="width: 16.6667%; height: 88px;">&nbsp;</td>',
          '<td style="width: 16.6667%; height: 88px;">&nbsp;</td>',
          '</tr>',
          '</tbody>',
          '</table>',
          '</body>',
          '</html>'].join('')
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/main.css";
  .title{
    margin-bottom: 50px;
    text-align: center;
    margin-top: 60px;
  }
  .main{
    margin-left: 10%;
    margin-right: 10%;
  }
  .sidebar {
    margin-top: 5%;
  }
  .right {
    margin-top: 10px;
  }
  .avatar-wrapper {
    float: right;
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
    position: relative;
    .user-avatar {
      /*float :right;*/
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .explanation {
    background: #eef1f6;
    padding: 15px 10px;
    margin-bottom: 20px;
    display: block;
    line-height: 36px;
  }

</style>



