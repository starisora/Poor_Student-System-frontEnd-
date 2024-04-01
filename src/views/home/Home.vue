<template>
  <div id="homePage">
    <h1 style="text-align: center;font-size: 50px">欢迎你,{{user.name}}</h1>
<!--    <el-radio-group v-model="size">-->
<!--      <el-radio label="">默认</el-radio>-->
<!--      <el-radio label="medium">中等</el-radio>-->
<!--      <el-radio label="small">小型</el-radio>-->
<!--      <el-radio label="mini">超小</el-radio>-->
<!--    </el-radio-group>-->

    <el-descriptions class="margin-top" title="个人信息" :column="1" :size="size" border>
<!--      按钮-->
<!--      <template slot="extra">-->
<!--        <el-button type="primary" size="small">操作</el-button>-->
<!--      </template>-->
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          账号
        </template>
        {{user.num}}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-edit"></i>
          姓名
        </template>
        {{ user.name }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          年龄
        </template>
        {{ user.age }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-male"></i>
          性别
        </template>
        <el-tag
            :type="user.sex === 1 ? 'primary' : 'success'"
            disable-transitions>{{user.sex === 1 ? '男' : '女'}}
        </el-tag>
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          电话
        </template>
        {{ user.phone }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-lock"></i>
          角色权限
        </template>
        <el-tag
            :type="user.roleId === 0 ?
              'danger' : (user.roleId === 1 ?
              'primary' : 'success')"
            disable-transitions>{{
            user.roleId === 0 ?
                '超级管理员' : (user.roleId === 1 ?
                '管理员' : '用户')
          }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <p id="homeTime" style="text-align: center;font-size: 30px">现在是：{{ currentTime }}</p>

  </div>
</template>

<script>
export default {
name: "Home",
  data () {
    return {
      user:JSON.parse(sessionStorage.getItem('submitUser')),
      size: '',
      currentTime: null,
    };
  },
  mounted() {
    this.getCurrentTime();
  },
  methods: {
    getCurrentTime() {
      const date = new Date();
      const hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      let dayOfWeek = date.getDay();
      if(seconds<10){
        seconds='0'+seconds
      }
      if (minutes<10){
        minutes='0'+minutes
      }
      switch (dayOfWeek) {
        case 0:
          dayOfWeek = '日';
          break;
        case 1:
          dayOfWeek = '一';
          break;
        case 2:
          dayOfWeek = '二';
          break;
        case 3:
          dayOfWeek = '三';
          break;
        case 4:
          dayOfWeek = '四';
          break;
        case 5:
          dayOfWeek = '五';
          break;
        case 6:
          dayOfWeek = '六';
          break;
        default:
          dayOfWeek = '';
          break;
      }

      this.currentTime = `${year}年${month}月${day}日 星期${dayOfWeek} ${hours}:${minutes}:${seconds}`;

      // 每秒更新时间
      setInterval(() => {
        const date = new Date();
        const hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        if(seconds<10){
          seconds='0'+seconds
        }
        if (minutes<10){
          minutes='0'+minutes
        }

        this.currentTime = `${year}年${month}月${day}日 星期${dayOfWeek} ${hours}:${minutes}:${seconds}`;
      }, 1000);
    },
  },
}
</script>

<style scoped>
#homePage{
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 10px;
}
#homeTime{
  margin-top: 10px;
}
</style>