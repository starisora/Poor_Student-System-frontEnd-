<template>
  <div>
    <!--搜索-->
<!--    <p>{{ dormitoryNum }}</p>-->
    <div style="margin-bottom: 5px">
      <!--@keyup.enter.native回车事件调用函数-->
      <el-input v-model="name" placeholder="请输入名字" suffix-icon="el-icon-search" style="width: 20%" size="small"
                @keyup.enter.native="loadPost"></el-input>
      <el-select v-model="sex" filterable placeholder="请选择性别" size="small" style="margin-left: 5px">
        <el-option
            v-for="item in sexs"
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
              highlight-current-row
              @current-change="handleCurrentChangeT"
    >
      <el-table-column prop="id" label="ID" width="120px">
      </el-table-column>
      <el-table-column prop="num" label="账号" width="180px">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180px">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="180px">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="180px">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.sex === 1 ? 'primary' : 'success'"
              disable-transitions>{{ scope.row.sex === 1 ? '男' : '女' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roleId" label="角色" width="180px">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.roleId === 0 ?
              'danger' : (scope.row.roleId === 1 ?
              'primary' : 'success')"
              disable-transitions>{{
              scope.row.roleId === 0 ?
                  '超级管理员' : (scope.row.roleId === 1 ?
                  '管理员' : '用户')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dormitoryNum" label="宿舍号" width="180px">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
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
    <div style="margin-top: 20px">
<!--      <el-button @click="setCurrent(tableData[0])">选中第二行</el-button>-->
<!--      <el-button @click="setCurrent()">取消选择</el-button>-->
      <el-button type="warning" @click="removeUserDormitory">移出寝室</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserComponent",
  props: ['dormitoryNum'],
  data() {
    return {
      // tableData: Array(10).fill(item)//生成10个装item数据的数组
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      name: '',
      sex: '',
      currentRow: null,
      sexs: [
        {
          value: '1',
          label: '男',
        },
        {
          value: '0',
          label: '女',
        }
      ],
      form: {
        id: "",
        num: "",
        name: "",
        password: "",
        age: "",
        sex: "1",
        phone: "",
        roleId: "2",
      },
      //交互数据
      param: {},
    }
  },
  methods: {
    loadPost() {
      //axios请求，并且筛选出data
      this.$axios.post(this.$httpUrl + '/user/listPage', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          sex: this.sex,
          roleId: "2",
          dormitoryNum: this.dormitoryNum + ""
        }
      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
          // this.$message({
          //   message: '查询成功',
          //   type: 'success'
          // });
        } else {
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
    resetParam() {
      this.name = ""
      this.sex = ""
    },
    resetForm() {
      this.$refs.form.resetFields();
    },

    // setCurrent(row) {
    //   console.log(row)
    //   this.$refs.singleTable.setCurrentRow(row);
    // },
    handleCurrentChangeT(val) {
      // console.log(val)
      this.currentRow = val;
    },
    // removeUserDormitory(){
    //   this.$axios.post(this.$httpUrl + '/user/clearDorNum', {
    //     id:this.currentRow.id+''
    //   }).then(res => res.data).then(res => {
    //     console.log(res)
    //     if (res.code === 200) {
    //       this.$message({
    //         message: '删除成功',
    //         type: 'success'
    //       });
    //       this.loadPost();
    //     } else {
    //       this.$message.error('发生错误');
    //     }
    //   })
    // },
    removeUserDormitory(){
      this.$axios.get(this.$httpUrl+'/user/clearDorNum?id='+this.currentRow.id).then(res=>res.data).then(res=>{
        console.log(res)
        if (res.code===200){
          //alert("成功")
          this.$message({
            message: '成功',
            type: 'success'
          });
          this.loadPost()
        }else {
          this.$message.error('发生错误');
        }
      })
    },
  },
  watch: {
    dormitoryNum() {
      // console.log('dormitoryNum changed:', newdormitoryNum, olddormitoryNum);
      this.loadPost()
      // 在 count 发生变化时执行自定义逻辑
    },
  },
  beforeMount() {
    // this.loadGet();
    this.loadPost();
  }
}
</script>

<style scoped>

</style>