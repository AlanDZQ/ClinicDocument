<template>
  <header class="plythal-header-wrapper">
    <div class="top"></div>
    <div class="plythal-nav-wrapper">
      <div class="plythal-nav-left">
        <div class="logo-wrapper">
          <div class="plythal-logo"></div>
        </div>

        <!--<app-nav></app-nav>-->
      </div>
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

<style scoped>
  .top {
    height: 40px;
    position: relative;
    display: flex;
    flex-direction: column;
    /*height: 146px;*/
    background: rgba(0,0,0,0.83);
    background-size: 100% 147px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .38);
    /*z-index: 9999;*/
  }
  .plythal-header-wrapper{
    position: relative;
    display: flex;
    flex-direction: column;
    /*height: 146px;*/
    background:rgba(0,0,0,0.8);
    background-size: 100% 147px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .38);
    /*z-index: 9999;*/
  }
  .plythal-nav-wrapper{
    flex: 1;
    display: flex;
    position: relative;
    justify-content: space-between;
  }
  .plythal-nav-left{
    flex: 1;
    display: flex;
    position: relative;
  }
  .logo-wrapper{
    /*flex-basis: 8%*/
    margin-left: 15%;
    padding: 14px;
    /*background-color: rgba(0,0,0,0.38);*/
      /*margin-left 24px*/
      /*margin-right 12px*/
    width: 192px;
  }
  .plythal-logo{
    height: 90px;
    background-image: url(./logo.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }




</style>
