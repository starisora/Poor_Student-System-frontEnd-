<template>
  <div>
    <!--搜索-->
    <div style="margin-bottom: 5px">
      <!--@keyup.enter.native回车事件调用函数-->
<!--      <el-input v-model="name" placeholder="请输入物品名" suffix-icon="el-icon-search" style="width: 20%" size="small"-->
<!--                @keyup.enter.native="loadPost"></el-input>-->
      <el-select v-model="floor" placeholder="请选择楼层号" size="small" style="margin-left: 5px">
        <el-option
            v-for="item in floorData"
            :key="item.id"
            :label="item.floorNum"
            :value="item.floorNum">
        </el-option>
      </el-select>


      <el-button type="primary" size="small" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" size="small" @click="resetParam">重置</el-button>
      <el-button type="primary" size="small" style="margin-left: 5px" @click="add">新增</el-button>
    </div>
    <!--背景颜色/文字颜色-->
    <el-table :data="tableData"
              :header-cell-style="{background:'#aaa0a0',color:'white'}"
              :border=true
    >
      <!--      <el-table-column width="180px">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{scope.row}}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column prop="id" label="ID" width="120px">
      </el-table-column>
      <el-table-column prop="floorNum" label="楼层号" width="180px">
      </el-table-column>
      <el-table-column prop="num" label="宿舍号" width="180px">
      </el-table-column>
<!--      <el-table-column prop="dormitoryDirector" label="室长" width="180px" :formatter="formatDormitoryDirector">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="peopleCount" label="寝室人数" width="180px">-->
<!--      </el-table-column>-->

      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
<!--          &lt;!&ndash;          编辑需要整行数据,删除只需要id即可&ndash;&gt;-->
<!--          <el-button size="small" type="primary" @click="mod(scope.row)">编辑</el-button>-->
<!--          &lt;!&ndash;          点击确认按钮时触发&ndash;&gt;-->
<!--          <el-popconfirm-->
<!--              confirm-button-text='好的'-->
<!--              cancel-button-text='不用了'-->
<!--              icon="el-icon-info"-->
<!--              icon-color="red"-->
<!--              title="确定删除吗？"-->
<!--              @confirm="del(scope.row.id)"-->
<!--              style="margin: 5px"-->
<!--          >-->
<!--            &lt;!&ndash;slot="reference"触发 Popconfirm 显示的 HTML 元素&ndash;&gt;-->
<!--            <el-button slot="reference" size="small" type="danger">删除</el-button>-->
<!--          </el-popconfirm>-->
          <!--          <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>-->

          <el-button size="small" type="primary" @click="checkDormitory(scope.row)">查看宿舍</el-button>
          <el-button size="small" type="success" @click="userAddDormitory(scope.row)">添加宿舍成员</el-button>
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
      <el-form ref="form" :model="form" label-width="80px" :rules="rule">
        <!--这里加prop是为了检查,form需要索引这个属性-->

        <el-form-item label="楼层号" prop="floorNum">
          <el-select v-model="form.floorNum" placeholder="请选择楼层号" size="small" style="margin-left: 5px">
            <el-option
                v-for="item in floorData"
                :key="item.id"
                :label="item.floorNum"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="宿舍号" prop="num">
            <el-col :span="20">
              <el-input v-model="form.num"></el-input>
            </el-col>
        </el-form-item>

<!--        <el-form-item label="室长" prop="dormitoryDirector">-->
<!--          <el-col :span="20">-->
<!--            <el-input v-model="form.dormitoryDirector"></el-input>-->
<!--          </el-col>-->
<!--        </el-form-item>-->

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>


<!--    查看宿舍-->
    <el-dialog
        title="提示"
        :visible.sync="userInDormitoryDialogVisible"
        width="90%"
        center>
      <user-component :dormitoryNum="dormitoryNum" ref="refresh1"></user-component>
    </el-dialog>

    <!--    查看宿舍-->
    <el-dialog
        title="提示"
        :visible.sync="addUserDialogVisible"
        width="90%"
        center>
      <user-dormitory-is-null-page :dormitoryNum="dormitoryNum" ref="refresh2"></user-dormitory-is-null-page>
    </el-dialog>
  </div>
</template>

<script>
import UserComponent from "../user/UserComponent";
import UserDormitoryIsNullPage from "../user/UserDormitoryIsNullPage";
export default {
  name: "Dormitory",
  components: {UserDormitoryIsNullPage, UserComponent},
  data() {
    //单独判断年龄输入
    let checkCount = (rule,value,callback) =>{
      if(value>9999){
        callback(new Error('物品输入过大'))
      }else {
        callback()
      }
    };

    return {
      floor:'',
      dormitoryNum:'',
      floorData:[],
      userData:[],
      // tableData: Array(10).fill(item)//生成10个装item数据的数组
      tableData: [],
      pageSize:5,
      pageNum:1,
      total:0,
      name:'',
      centerDialogVisible:false,
      userInDormitoryDialogVisible:false,
      addUserDialogVisible:false,
      form:{
        id:"",
        floorNum: "",
        num:"",
        dormitoryDirector:"",
      },
      //交互数据
      param:{},
      //输入规则
      rule: {
        name: [
          { required: true, message: '请输入物品名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { pattern:/^([1-9][0-9]*){1,4}$/, message: "数量必须为正整数字", trigger: 'blur'},
          { validator:checkCount,trigger: 'blur'}
        ],
        goodsType: [
          { required: true, message: '请选择分类', trigger: 'blur' },
        ],
        storage: [
          { required: true, message: '请选择仓库类型', trigger: 'blur' },
        ],
      }
    }
  },
  methods:{
    formatStorage(row){
      // 进行数据对比,将行中的仓库名和storage表中的id比对,相同则渲染storage表中的数据
      let temp = this.storageData.find(item=>{
        // console.log(item.id)
        // console.log(row.storage)
        return item.id === row.storage
      })
      return temp && temp.name
    },
    formatGoodsType(row){
      let temp = this.goodsTypeData.find(item=>{
        return item.id === row.goodsType
      })
      return temp && temp.name
    },
    loadPost(){
      //axios请求，并且筛选出data
      this.$axios.post(this.$httpUrl+'/dormitory/listPage',{
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        param:{
          floorNum:this.floor+'',
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
      this.name="";
      this.floor="";
    },
    add(){
      this.form.id=""
      this.centerDialogVisible=true
      //类似异步的东西,resetForm方法可以重置对话框内的东西,因为标签加了prop
      //它常用于在改变数据后,等待Vue完成对DOM的更新,然后执行一些操作或访问更新后的DOM元素
      this.$nextTick(()=>{
        this.resetForm();
      })
    },
    doAdd(){
      this.$axios.post(this.$httpUrl+'/dormitory/save', this.form).then(res=>res.data).then(res=>{
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
    mod(row){
      console.log(row)
      this.centerDialogVisible = true
      this.$nextTick(()=>{
        //赋值到表单
        this.form.id = row.id
        this.form.floorNum = row.floorNum
        this.form.num = row.num
      })
    },
    doMod(){
      this.$axios.post(this.$httpUrl+'/dormitory/mod', this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          //alert("成功")
          this.$message({
            message: '成功修改',
            type: 'success'
          });
          this.centerDialogVisible=false
          this.loadPost()
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    del(id){
      console.log(id)
      this.$axios.get(this.$httpUrl+'/dormitory/del?id='+id).then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          //alert("成功")
          this.$message({
            message: '成功',
            type: 'success'
          });
          // this.centerDialogVisible=false
          this.loadPost()
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    save(){
      this.$refs.form.validate((valid) => {
        //输入语法检查
        if (valid) {
          if(this.form.id){
            console.log("执行doMod")
            this.doMod()
          }else {
            console.log("执行doAdd")
            this.doAdd()
          }
        } else {
          this.$message.error('语法不符合规范');
          return false;
        }
      });
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
    //获取楼层数
    loadFloor(){
      this.$axios.post(this.$httpUrl+'/floor/list').then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          this.floorData = res.data
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    loadUser(){
      //axios请求，并且筛选出data
      this.$axios.post(this.$httpUrl+'/user/list').then(res=>res.data).then(res=>{
        // console.log("User返回")
        console.log(res)
        if (res.code===200){
          this.userData = res.data
          // this.$message({
          //   message: '查询成功',
          //   type: 'success'
          // });
        }else {
          this.$message.error('user获取失败');
        }
      })
    },
    formatDormitoryDirector(row){
      let temp = this.userData.find(item=>{
        // console.log(item.id)
        // console.log(row.storage)
        // console.log("id="+item.id)
        // console.log("row="+row.dormitoryDirector)
        return item.id+'' === row.dormitoryDirector+''
      })
      return temp && temp.name
    },
    checkDormitory(row){
      // console.log("row")
      // console.log(row.num)
      this.dormitoryNum = row.num
      this.userInDormitoryDialogVisible=true
    },
    userAddDormitory(row){
      this.dormitoryNum = row.num
      this.addUserDialogVisible = true
    },
  },

  watch:{
    addUserDialogVisible(){
      // console.log("调用addUser")
      if(this.addUserDialogVisible===true){
        this.$refs.refresh2.loadPost()
      }
    },
    userInDormitoryDialogVisible(){
      // console.log("调用userIn")
      if (this.userInDormitoryDialogVisible===true){
        this.$refs.refresh1.loadPost()
      }
    }
  },
  beforeMount() {
    // this.loadGet();
    this.loadUser()
    this.loadPost();
    // this.loadStorage();
    this.loadFloor();
  }
}
</script>

<style scoped>

</style>