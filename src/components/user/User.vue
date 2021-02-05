<template>
  <div>
    <!--条件查询-->
    <el-input v-model="crname" placeholder="请输入角色名称" style="width: 200px"></el-input>
    <el-date-picker
      v-model="dateValue"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button type="primary" size="small" icon="el-icon-search" @click="queryUserData">搜索</el-button>
    <!--用户table数据展示-->
    <el-table
      :data="userData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户账号">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实名称">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="用户性别"
        :formatter="sexInitData">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话号码">
      </el-table-column>
      <el-table-column
        prop="email"
        label="用户邮箱">
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号">
      </el-table-column>
      <el-table-column
        prop="birthday"
        label="用户生日">
      </el-table-column>
      <el-table-column
        prop="imgUrl"
        label="用户头像">
        <template slot-scope="scope">
          <img width="50px" :src="scope.row.imgUrl"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="eduId"
        label="用户学历"
        :formatter="eduIdInitData">
      </el-table-column>
      <el-table-column
        prop="deptId"
        label="用户部门"
        :formatter="deptIdInitData">
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toUpdateUserForm(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="toUserPersonaForm(scope.row)">赋角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="limits"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>


    <!--修改模板-->
    <el-dialog title="修改用户" :visible.sync="updateUserForm">
      <el-form ref="updateData" :model="updateData" label-width="80px" style="width: 500px;">
        <el-form-item label="真实名称" prop="realName">
          <el-input v-model="updateData.realName"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" prop="sex">
          <el-radio-group v-model="updateData.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="updateData.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="updateData.email"></el-input>
        </el-form-item>
        <el-form-item label="省份证号" prop="idCard">
          <el-input v-model="updateData.idCard"></el-input>
        </el-form-item>
        <el-form-item label="用户生日" prop="birthday">
          <el-date-picker
            v-model="updateData.birthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/api/user/addLoginUpFile?"
            :show-file-list="false"
            :on-success="imgsaveFile"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户学历" prop="eduId">
          <el-select v-model="updateData.eduId" placeholder="请选择用户学历" clearable style="width: 420px">
            <el-option
              v-for="data in eduIdDate"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在部门" prop="deptId">
          <el-select v-model="updateData.deptId" placeholder="请选择所在部门" clearable style="width: 420px">
            <el-option
              v-for="data in deptIdDate"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateUserForm = false">取 消</el-button>
        <el-button type="primary" @click="updateUserData">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      return {
        /*用户所有的数据*/
        userData:[],
        /*条件查询*/
        crname:"",
        dateValue:'',
        /*分页*/
        count:0,
        page:1,
        limits:[6,8,10],
        limit:6,
        /*学历部门数据*/
        eduIdDate: [{id: 1, name: "小学"}, {id: 2, name: "初中"}, {id: 3, name: "高中"}, {id: 4, name: "大学"}],
        deptIdDate: [{id: 1, name: "总裁"}, {id: 2, name: "总经理"}, {id: 3, name: "组长"}, {id: 4, name: "员工"}],
        /*修改内容*/
        updateUserForm:false,
        imageUrl:"",
        updateData:{
          id:"",
          realName:"",
          phone:"",
          email:"",
          idCard:"",
          birthday:"",
          imgUrl:"",
          eduId:"",
          deptId:"",
        },
        /*赋角色*/

      }
    },
    created:function(){
      this.queryUserData();
    },
    methods:{
      /*赋角色*/
      toUserPersonaForm:function(row){

      },
      /*修改弹框*/
      toUpdateUserForm:function(row){
        this.updateUserForm=true;
        this.$ajax.get("http://localhost:8080/api/user/selectUserByid?id="+row.id).then(res=>{
          this.imageUrl=res.data.data.imgUrl;
          this.updateData=res.data.data;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*提交修改*/
      updateUserData:function(){
        this.$ajax.post("http://localhost:8080/api/user/updateUser?"+this.$qs.stringify(this.updateData)).then(res=>{
          alert(res.data.message);
          this.updateUserForm=false;
          this.queryUserData();
        }).catch(re=>{
          console.log(re);
        })
      },
      /*修改的图片上传*/
      imgsaveFile: function (response, file) {
        this.updateData.imgUrl = response.data;
        this.imageUrl = response.data;
      },
      /*限制文件上传的类型和大小*/
      beforeAvatarUpload(file) {
        //限制类型  name  来限制
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      /*查询所有的数据展示*/
      queryUserData:function () {
        console.log(this.dateValue);
        var searchData={page:this.page,limit:this.limit,crname:this.crname};
        if(this.dateValue!=null){
          searchData.beginDate=this.dateValue[0];
          searchData.endDate=this.dateValue[1];
        }
        this.$ajax.get("http://localhost:8080/api/user/selectUserData?"+this.$qs.stringify(searchData)).then(res=>{
          console.log(res.data.data);
          this.count=res.data.data.count;
          this.userData=res.data.data.data;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*分页事件*/
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.limit=val;
        this.queryUserData();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page=val;
        this.queryUserData();
      },
      /*初始化数据*/
      eduIdInitData:function(row,column,value,index){
        for (let i = 0; i <this.eduIdDate.length ; i++) {
          if(this.eduIdDate[i].id==value){
            return this.eduIdDate[i].name;
          }
        }
        return '';
      },
      deptIdInitData:function(row,column,value,index){
        for (let i = 0; i <this.deptIdDate.length ; i++) {
          if(this.deptIdDate[i].id==value){
            return this.deptIdDate[i].name;
          }
        }
        return '';
      },
      sexInitData:function (row,column,value,index) {
        if(value==0){
          return "男";
        }else if(value==1){
          return "女"
        }
      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }

  /*图片样式*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
