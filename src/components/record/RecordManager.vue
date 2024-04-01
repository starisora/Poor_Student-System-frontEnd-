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
      <el-table-column prop="goods" label="物品名" width="180px">
      </el-table-column>
      <el-table-column prop="count" label="数量" width="180px">
      </el-table-column>
      <el-table-column prop="user_id" label="申请人" width="180px">
      </el-table-column>
      <el-table-column prop="admin_id" label="操作人" width="180px">
      </el-table-column>
      <el-table-column prop="createTime" label="操作时间" width="180px">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
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

  </div>
</template>

<script>
export default {
  name: "Record",
  data() {

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
      this.$axios.post(this.$httpUrl+'/record/listPage',{
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        param:{
          // name:this.name,
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