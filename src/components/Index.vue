<template>
  <el-container style="height: 100vh">
    <el-aside :width="aside_width" style="background-color: gray;height: auto">
      <Aside :isCollapse="isCollapseT"></Aside>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px;border-bottom: rgba(168,168,168,0.3) 1px solid;height: auto">
        <Header @doCollapse="doCollapseT" :icon="icon"></Header>
      </el-header>

      <el-main style="background-color: #f0f6f0">
<!--        <Main></Main>-->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "./Aside";
import Header from "./Header";
// import Main from "./Main";
export default {
  name: "Index",
  // components: {Main, Header, Aside},
  components: {Header, Aside},
  data(){
    return{
      isCollapseT:false,
      aside_width:'200px',
      icon:'el-icon-s-fold'
    }
  },
  methods:{
    doCollapseT(){
      console.log(1)
      //this索引上data
      this.isCollapseT = !this.isCollapseT
      // //展开收缩判断
      if (!this.isCollapseT){//展开
        this.aside_width='200px'
        this.icon='el-icon-s-fold'
      }else{//收缩
        this.aside_width='64px'
        this.icon='el-icon-s-unfold'
      }
    }
  },
  created() {
    // console.log("执行created")
    this.$router.push('/home')
  }
}
</script>

<style scoped>
.el-header {
  /*background-color: #B3C0D1;*/
  color: #333;
  line-height: 60px;
}
.el-main{
  padding: 5px;
}

.el-aside {
  color: #333;
}

</style>