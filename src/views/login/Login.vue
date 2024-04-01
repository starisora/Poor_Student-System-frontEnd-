<!--<template>-->
<!--<span>he</span>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: "Login"-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->

<template>
  <div>
    <!--    粒子效果-->
    <vue-particles
        color="#555"
        :particleOpacity="0.7"
        :particlesNumber="120"
        shapeType="circle"
        :particleSize="4"
        linesColor="#555"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="false"
        clickMode="push"
        class="lizi"
    />

  <div id="login-container">
    <div style="text-align: center;height: 50px">
      登录
    </div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="user">
        <el-input type="text" v-model="ruleForm.num" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <!--      <el-form-item label="年龄" prop="age">-->
      <!--        <el-input v-model.number="ruleForm.age"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户'));
      } else {
        if (this.ruleForm.pass !== '') {
          this.$refs.ruleForm.validateField('pass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        num: '',
        password: '',
      },
      rules: {
        user: [
          { validator: validatePass, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        // age: [
        //   { validator: checkAge, trigger: 'blur' }
        // ]
      },
      isLogin:false
    };
  },
  methods: {
    submitForm(formName) {
      console.log(formName)
      // this.$message.success("登录成功!!!");
      //session代码
      // sessionStorage.setItem('CurUser', JSON.stringify(this.ruleForm));

      // // 存储数据
      // sessionStorage.setItem('key', 'value');
      //
      // // 读取数据
      // const value = sessionStorage.getItem('key');
      //
      // // 删除数据
      // sessionStorage.removeItem('key');
      //
      // // 清空所有数据
      // sessionStorage.clear();

      //登录验证请求
      this.$axios.post(this.$httpUrl+'/user/login',this.ruleForm).then(res=>res.data).then(res=>{
        console.log("res="+res.data)
        console.log(this.ruleForm)
        if (res.code===200){
          this.$message.success("登录成功!!!");
          sessionStorage.setItem('submitUser', JSON.stringify(res.data.user));
          sessionStorage.setItem('menu', JSON.stringify(res.data.menu));
          //调用store里面的方法(第一个参数是方法名,第二个是数据)
          // this.$store.commit("setMenu",res.data.menu)
          this.$router.replace('/index')
          // this.$message({
          //   message: '查询成功',
          //   type: 'success'
          // });
        }else {
          this.$message.error('登录失败');
        }
      })

      // this.$router.push({path: "/"});
      // this.$router.replace('/index')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
#login-container{
  width: 400px;
  height: 290px;
  background: #e5e9f2;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -220px;
  margin-top: -170px;
  border-radius: 5px;
  padding-top: 40px;
  padding-right: 40px;
}

/*粒子效果css*/
.lizi{
  z-index: -1;
  position:absolute;
  /*top:0;*/
  /*bottom: 0;*/
  width:100%;
  height: 99%;
  /*width: 100vh;*/
  /*height: 100vh;*/
  margin: 0;
  padding: 0;
  /*border:solid red 1px;*/
}
</style>
