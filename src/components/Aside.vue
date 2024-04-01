<template>
<!--背景颜色/文本颜色/激活文本/默认激活/Home菜单-->
<!--  router可以自动索引index标签的路由-->
  <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      default-active="/home"
      :collapse="isCollapse"
      style="width: auto;border-right: none"
      router
      >
    <!--slot="title",收缩后鼠标停留能看见文本-->
    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-menu-item :index="'/'+item.menuclick" v-for="(item,i) in menu" :key="i">
      <i :class="item.menuicon"></i>
      <span slot="title">{{item.menuname}}</span>
    </el-menu-item>

<!--    <el-menu-item index="/user">-->
<!--      <i class="el-icon-s-opportunity"></i>-->
<!--      <span slot="title">导航二</span>-->
<!--    </el-menu-item>-->
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  data(){
    return{
      // isCollapse:false

      //动态菜单参数,暂时模拟
      // menu:[{
      //       menuClick:'Admin',
      //       menuName:'管理员管理',
      //       menuIcon:'el-icon-s-custom',
      //     },
      //   {
      //     menuClick:'user',
      //     menuName:'用户管理',
      //     menuIcon:'el-icon-user-solid',
      //   },
      // ]
    }
  },
  computed:{
    menu:{
      get(){
        return this.$store.state.menu
      }
    }
  },
  props:{
    //给父组件传递这个参数
    isCollapse:Boolean
  },
  beforeMount() {
    //调用store.js里面的方法
    this.$store.commit("setMenu",JSON.parse(sessionStorage.getItem('menu')))
  }
}
</script>

<style scoped>
  div{
    /*border: 1px solid red;*/
  }
  .el-menu{
    height: 100%
  }
</style>