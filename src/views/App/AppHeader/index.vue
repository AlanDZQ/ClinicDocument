<template>
  <header class="plythal-header-wrapper">
    <div class="top">
      <div class="icon-setting">
        <a class="el-icon-setting" style="width: 30px"></a>
        <a class="el-icon-more" style="width: 30px"></a>
      </div>
    </div>
    <div class="plythal-nav-wrapper">
      <div class="plythal-nav-left">
        <a class="logo-wrapper" href="">
          <div class="plythal-logo"></div>
        </a>
      </div>

      <!--<el-menu default-active="1"  router="true" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64"-->
               <!--text-color="#fff" active-text-color=#409EFF style="height: 10px; margin-top:58px;">-->
        <!--<el-menu-item index="/app/template">Template</el-menu-item>-->
        <!--<el-submenu index="2">-->
          <!--<template slot="title">User Center</template>-->
          <!--<el-menu-item index="/app/template">Form1</el-menu-item>-->
          <!--<el-menu-item index="2-2">Form2</el-menu-item>-->
          <!--<el-menu-item index="2-3">Form3</el-menu-item>-->
        <!--</el-submenu>-->
        <!--&lt;!&ndash;<el-menu-item index="3">Option 1</el-menu-item>&ndash;&gt;-->

      <!--</el-menu>-->

      <!--<div class="plythal-nav-right">-->
      <!--<button class="nav-right-btn" @click="toMyList">-->
      <!--<i class="fa fa-th-list" aria-hidden="true"></i>-->
      <!--<span>My List</span>-->
      <!--</button>-->
      <!--<button class="nav-right-btn" @click="toHistoryOrder">-->
      <!--<i class="fa fa-clock-o" aria-hidden="true"></i>-->
      <!--<span>History Order</span>-->
      <!--</button>-->
      <!--</div>-->
    </div>
  </header>
</template>
<script>
  export default {
    methods:{
      handleSelect(){

      }
    }
  }
</script>

<style scoped>
  .top {
    height: 40px;
    position: relative;
    display: flex;
    flex-direction: column;
    /*height: 146px;*/
    background: rgba(0, 0, 0, 0.83);
    background-size: 100% 147px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .38);
  }

  .plythal-header-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    /*height: 146px;*/
    background: rgba(0, 0, 0, 0.8);
    background-size: 100% 147px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .38);
  }

  .plythal-nav-wrapper {
    flex: 1;
    display: flex;
    position: relative;
    justify-content: space-between;
  }

  .plythal-nav-left {
    flex: 1;
    display: flex;
    position: relative;
  }

  .logo-wrapper {
    /*flex-basis: 8%*/
    margin-left: 20%;
    padding: 14px;
    width: 192px;
  }

  .plythal-logo {
    height: 90px;
    background-image: url(./logo.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .icon-setting {
    margin-left: 90%;
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    height: 100%;
    text-align: center;
    margin-top: 10px;
  }


</style>

