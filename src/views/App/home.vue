<template>
  <div>
    <app-header></app-header>
    <app-template></app-template>
    <!--<router-view></router-view>-->
    <app-footer></app-footer>

  </div>

</template>

<script>
  import appHeader from './AppHeader'
  import appTemplate from './Template'
  import appFooter from './AppFooter'

  export default {
    components: {
      appHeader,
      appTemplate,
      appFooter
    },
    //  name: 'HelloWorld',

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>




