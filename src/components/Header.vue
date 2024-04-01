<template>
<!--  只能有一个根节点,这里不用div包住就会有两个同级节点,所以div包住了,标签都是一个节点-->
  <div style="display: flex">

    <div style="display: flex;flex: 1 1 0;align-items: center">
      <i :class="icon" style="font-size: 20px;cursor: pointer" @click="collapse"></i>
    </div>

    <div style="flex: 1 1 0;text-align: center;font-size: 30px">
      <span>宿舍管理系统</span>
    </div>

    <!--flex: flex-grow flex-shrink flex-basis:放大,缩小,基础大小-->
    <!--justify-content(根据主轴进行对齐): flex-end(右侧开始进行对齐)-->
    <!--align-items(在交叉轴进行对齐)-->
    <!--cursor: pointer鼠标移上去有焦点-->
    <div style="display: flex;flex: 1 1 0;align-items: center;justify-content: flex-end">
      <span>{{ user.name }}</span>
<!--      <span>王小虎</span>-->
      <el-dropdown>
        <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
        <el-dropdown-menu slot="dropdown">
          <!--native原生不用加,但这个是饿了么组件,必须加-->
          <el-dropdown-item @click.native="toUser">个人资料</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
export default {
  name: "Header",
  data(){
    return {
      //接受从login来的session数据
      user:JSON.parse(sessionStorage.getItem('submitUser'))
    }
  },
  props:{
    icon:String
  },
  methods:{
    toUser(){
      console.log(1)
      this.$router.push("/home")
    },
    logout(){
      console.log(2)
      this.$confirm('确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push("/")
        sessionStorage.clear()
        this.$message({
          type: 'success',
          message: '退出成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });


    },
    collapse(){
      //给父组件(Index)传doCollapse事件
      this.$emit('doCollapse')
    },
  },
}
</script>

<style scoped>
div{
  /*border: 1px solid red;*/
}
</style>