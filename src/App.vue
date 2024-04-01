<template>
  <div id="app">
<!--    <Index></Index>-->
    <router-view/>
  </div>
</template>

<script>
// import Index from "./components/Index.vue";

export default {
  name: 'App',
  components: {
    // Index,
  },
  data(){
    return{
      user:JSON.parse(sessionStorage.getItem('submitUser')),
    }
  },

  watch:{
    //监听,解决刷新路由丢失问题
    '$store.state.menu':{
      handler(val,old){
        // console.log("val")
        // console.log(val)
        // console.log("old")
        // console.log(old)
        if (!old && this.user && this.user.num){
          // console.log("val")
          // console.log(val)
          console.log('执行路由丢失修复')
          val = JSON.parse(sessionStorage.getItem('menu'))
          this.$store.commit("setRouter",val)
        }
      },
      immediate:true
    },
  }
}
</script>

<style>
#app {
  height: auto;
  width: auto;
}
</style>
