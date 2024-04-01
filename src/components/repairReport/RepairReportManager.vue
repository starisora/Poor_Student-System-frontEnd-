<template>
  <div>
    <!--搜索-->
    <div style="margin-bottom: 5px">
      <!--@keyup.enter.native回车事件调用函数-->
<!--      <el-input v-model="name" placeholder="请输入名字" suffix-icon="el-icon-search" style="width: 20%" size="small"-->
<!--                @keyup.enter.native="loadPost"></el-input>-->
      <el-select v-model="situationType" filterable placeholder="请选择报修类型" size="small" style="margin-left: 5px">
        <el-option
            v-for="item in situationTypeData"
            :key="item.id"
            :label="item.situationType"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="question" filterable placeholder="请选择是否解决" size="small" style="margin-left: 5px">
        <el-option
            v-for="item in questions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" size="small" @click="resetParam">重置</el-button>
    </div>
    <!--背景颜色/文字颜色-->
    <el-table :data="tableData"
              :header-cell-style="{background:'#aaa0a0',color:'white'}"
              :border=true
    >
      <el-table-column prop="id" label="ID" width="120px">
      </el-table-column>
      <el-table-column prop="situationType" label="保修类型" width="180px" :formatter="situationTypeFormatter">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180px">
      </el-table-column>
      <el-table-column prop="userName" label="申请人" width="180px" :formatter="userFormatter">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="180px">
      </el-table-column>
      <el-table-column prop="status" label="报修状态" width="180px">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status === 1+'' ? 'success' : 'danger'"
              disable-transitions>{{scope.row.status === 1+'' ? '已解决' : '未解决'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <!--          编辑需要整行数据,删除只需要id即可-->
          <el-button size="small" type="primary" @click="check(scope.row)">查看详情</el-button>
          <!--          点击确认按钮时触发-->
<!--          <el-popconfirm-->
<!--              confirm-button-text='好的'-->
<!--              cancel-button-text='不用了'-->
<!--              icon="el-icon-info"-->
<!--              icon-color="red"-->
<!--              title="确定删除吗？"-->
<!--              @confirm="del(scope.row.id)"-->
<!--              style="margin-left: 5px"-->
<!--          >-->
<!--            &lt;!&ndash;slot="reference"触发 Popconfirm 显示的 HTML 元素&ndash;&gt;-->
<!--            <el-button slot="reference" size="small" type="danger">删除</el-button>-->
<!--          </el-popconfirm>-->
          <!--          <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <!--对话框表单-->
    <!--centerDialogVisible表示小窗口是否显示-->
    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :model="form" label-width="80px" :rules="rule" :disabled="true">
        <!--这里加prop是为了检查,form需要索引这个属性-->
        <el-form-item label="报修类型" prop="situationType">
          <!--:span="11"属性可以增加长度-->
          <el-col :span="20">
            <el-input v-model="form.situationType"></el-input>
<!--            <span>{{form.situationType}}</span>-->
          </el-col>
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-col :span="20">
            <el-input v-model="form.createTime"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="申请人" prop="userName">
          <el-col :span="20">
            <el-input v-model="form.userName"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-col :span="20">
            <el-input v-model="form.remark"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-col :span="20">
            <el-input v-model="form.status"></el-input>
          </el-col>
        </el-form-item>

<!--        <el-form-item label="电话" prop="phone">-->
<!--          <el-col :span="20">-->
<!--            <el-input v-model="form.phone"></el-input>-->
<!--          </el-col>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="doMod">已解决</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RepairReportManager",
  data() {
    //单独判断年龄输入
    let checkAge = (rule,value,callback) =>{
      if(value>150){
        callback(new Error('年龄过大'))
      }else {
        callback()
      }
    };

    //查询账号是否重复
    let checkDuplicate = (rule,value,callback) =>{
      if(this.form.id){
        return callback();
      }
      this.$axios.get(this.$httpUrl+'/repairReport/findByNum?num='+this.form.num).then(res=>res.data).then(res=>{
        //没有查到数据就回调
        if (res.code===400){
          callback()
        }else if (res.code===200){
          //200说明能查到,重复了,返回错误信息
          callback(new Error("账号已经存在"))
        }
      })
    }

    return {
      // tableData: Array(10).fill(item)//生成10个装item数据的数组
      tableData: [],
      situationType:'',
      situationTypeData:[],
      userData:[],
      pageSize:5,
      pageNum:1,
      total:0,
      name:'',
      question:'',
      questions:[
        {
          value:'1',
          label:'解决',
        },
        {
          value: '0',
          label: '未解决',
        }
      ],
      centerDialogVisible:false,
      form:{
        id:"",
        situationType:"",
        createTime:"",
        userName:"",
        remark:"",
        status:"",
      },
      //交互数据
      param:{},
      //输入规则
      rule: {
        num: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          { validator:checkDuplicate,trigger: 'blur'}
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 3, message: '长度在 1 到 3 个位', trigger: 'blur' },
          { pattern:/([1-9][0-9]*){1,3}$/, message: "年龄必须为正整数字", trigger: 'blur'},
          { validator:checkAge,trigger: 'blur'}
        ],
        phone: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          { pattern:/^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message:"请输入正确的手机号码", trigger: "blur"}
        ],
      }
    }
  },
  methods:{
    loadGet(){
      //axios请求，并且筛选出data
      this.$axios.get(this.$httpUrl+'/repairReport/list').then(res=>res.data).then(res=>{
        console.log(res)
      })
    },
    loadPost(){
      //axios请求，并且筛选出data
      this.$axios.post(this.$httpUrl+'/repairReport/listPage',{
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        param:{
          situationType:this.situationType+'',
          status:this.question+'',
          // roleId:"2",
        }
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          this.tableData = res.data
          this.total = res.total
          // this.$message({
          //   message: '查询成功',
          //   type: 'success'
          // });
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.loadPost()
    },
    resetParam(){
      this.situationType=""
    },
    del(id){
      console.log(id)
      this.$axios.get(this.$httpUrl+'/repairReport/del?id='+id).then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          //alert("成功")
          this.$message({
            message: '成功',
            type: 'success'
          });
          this.centerDialogVisible=false
          this.loadPost()
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    doMod(){
      if (this.form.status+''==='1'){
        this.$message('该问题已解决');
        return
      }
      this.$axios.post(this.$httpUrl+'/repairReport/editStatus', {
        param:{
          id:this.form.id,
          status:"1",
        }
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          //alert("成功")
          this.$message({
            message: '成功',
            type: 'success'
          });
          this.centerDialogVisible=false
          this.loadPost()
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    check(row){
      console.log(row)
      this.centerDialogVisible = true
      this.$nextTick(()=>{
        //赋值到表单
        this.form.id = row.id
        this.form.situationType = row.situationType
        this.form.createTime = row.createTime
        this.form.userName = row.userName
        this.form.remark = row.remark+''
        this.form.status = row.status+''
      })
    },
    close(){
      this.centerDialogVisible = false
      // this.$nextTick(()=>{
      //   this.form.id=""
      // })
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //获取报修类型
    loadSituationType(){
      //获取楼层数
      this.$axios.post(this.$httpUrl+'/situationType/list').then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          this.situationTypeData = res.data
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    //获取报修类型
    loadUser(){
      //获取楼层数
      this.$axios.post(this.$httpUrl+'/user/list').then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          this.userData = res.data
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    situationTypeFormatter(row){
      let temp = this.situationTypeData.find(item=>{
        return item.id+'' === row.situationType+''
      })
      return temp && temp.situationType
    },
    userFormatter(row){
      let temp = this.userData.find(item=>{
        return item.id+'' === row.userName+''
      })
      return temp && temp.name
    },
  },
  beforeMount() {
    // this.loadGet();
    this.loadPost();
    this.loadSituationType();
    this.loadUser();
  }
}
</script>

<style scoped>

</style>