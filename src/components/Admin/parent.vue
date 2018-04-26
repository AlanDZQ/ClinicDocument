<template>
  <div>
    <child :data=data></child>
    <el-button @click="click"></el-button>

  </div>
</template>

<script>
  import child from './child.vue'
  export default {
    components: {
      child
    },
    data () {
      return {
        data: true
      }
    },
    methods: {
      click () {
        this.data = !this.data
      }
    }
  }
</script>
