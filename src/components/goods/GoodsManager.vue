<template>
  <div>
    <!--搜索-->
    <div style="margin-bottom: 5px">
      <!--@keyup.enter.native回车事件调用函数-->
      <el-input v-model="name" placeholder="请输入物品名" suffix-icon="el-icon-search" style="width: 20%" size="small"
                @keyup.enter.native="loadPost"></el-input>
      <el-select v-model="storage" placeholder="请选择仓库类型" size="small" style="margin-left: 5px">
        <el-option
            v-for="item in storageData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="goodsType" placeholder="请选择食品类别" size="small" style="margin-left: 5px">
        <el-option
            v-for="item in goodsTypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
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
      <el-table-column prop="name" label="物品名" width="180px">
      </el-table-column>
      <el-table-column prop="storage" label="仓库" width="180px" :formatter="formatStorage">
      </el-table-column>
      <el-table-column prop="goodsType" label="分类" width="180px" :formatter="formatGoodsType">
      </el-table-column>
      <el-table-column prop="count" label="数量" width="180px">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="180px">
      </el-table-column>

      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <!--          编辑需要整行数据,删除只需要id即可-->
          <el-button size="small" type="primary" @click="mod(scope.row)">编辑</el-button>
          <!--          点击确认按钮时触发-->
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
              style="margin-left: 5px"
          >
            <!--slot="reference"触发 Popconfirm 显示的 HTML 元素-->
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
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
      <el-form ref="form" :model="form" label-width="80px" :rules="rule">
        <!--这里加prop是为了检查,form需要索引这个属性-->

        <el-form-item label="物品名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="仓库" prop="storage">
          <el-col :span="20">
<!--            <el-input v-model="form.storage"></el-input>-->
            <el-select v-model="form.storage" placeholder="请选择仓库类型" size="small" style="margin-left: 5px">
              <el-option
                  v-for="item in storageData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="分类" prop="goodsType">
          <el-col :span="20">
<!--            <el-input v-model="form.goodsType"></el-input>-->
            <el-select v-model="form.goodsType" placeholder="请选择食品类别" size="small" style="margin-left: 5px">
              <el-option
                  v-for="item in goodsTypeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="数量" prop="count">
          <el-col :span="20">
            <el-input v-model="form.count"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-col>
        </el-form-item>


      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Goods",
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
      storage: '',
      goodsType: '',
      goodsTypeData: [],
      storageData:[],
      // tableData: Array(10).fill(item)//生成10个装item数据的数组
      tableData: [],
      pageSize:5,
      pageNum:1,
      total:0,
      name:'',
      centerDialogVisible:false,
      form:{
        id:"",
        name:"",
        storage:"",
        goodsType:"",
        count:"",
        remark:"",
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
      this.$axios.post(this.$httpUrl+'/goods/listPage',{
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        param:{
          name:this.name,
          goodsType:this.goodsType+'',
          storage:this.storage+'',
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
      this.storage="";
      this.goodsType="";
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
      this.$axios.post(this.$httpUrl+'/goods/save', this.form).then(res=>res.data).then(res=>{
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
        this.form.name = row.name
        this.form.storage = row.storage
        this.form.goodsType = row.goodsType
        this.form.count = row.count
        this.form.remark = row.remark
      })
    },
    doMod(){
      this.$axios.post(this.$httpUrl+'/goods/mod', this.form).then(res=>res.data).then(res=>{
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
      this.$axios.get(this.$httpUrl+'/goods/del?id='+id).then(res=>res.data).then(res=>{
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
    loadStorage(){
      //axios请求，并且筛选出data
      this.$axios.get(this.$httpUrl+'/storage/list').then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          this.storageData = res.data
        }else {
          this.$message.error('发生错误');
        }
      })
    },
    loadGoodsType(){
      this.$axios.get(this.$httpUrl+'/goodsType/list').then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          this.goodsTypeData = res.data
        }else {
          this.$message.error('发生错误');
        }
      })
    }
  },
  beforeMount() {
    // this.loadGet();
    this.loadPost();
    this.loadStorage();
    this.loadGoodsType();
  }
}
</script>

<style scoped>

</style>