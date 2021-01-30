<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="param" label-width="0px" class="ms-content">
        <el-form-item prop="name">
          <el-input v-model="param.name" placeholder="请输入用户账户">
            <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入用户密码"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('param')">登录</el-button>
        </div>
        <div class="login-btn">
          <el-button type="primary" @click="addUserFormFlog">注册</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>

    <!--注册弹框-->
    <el-dialog title="注册弹框" :visible.sync="toAddUserForm">
      <el-form ref="addUserForm" :model="addUserForm" label-width="80px" style="width: 500px;">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="addUserForm.name" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addUserForm.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input show-password v-model="addUserForm.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" prop="sex">
          <el-radio-group v-model="addUserForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addUserForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="addUserForm.email" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="addUserForm.idCard" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="用户生日" prop="birthday">
          <el-date-picker
            v-model="addUserForm.birthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/api/loginController/addLoginUpFile"
            :show-file-list="false"
            :on-success="imgsaveFile"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户学历" prop="eduId">
          <el-select v-model="addUserForm.eduId" placeholder="请选择用户学历" clearable style="width: 420px">
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
          <el-select v-model="addUserForm.deptId" placeholder="请选择所在部门" clearable style="width: 420px">
            <el-option
              v-for="data in deptIdDate"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUserFormDate">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        /*用户登录账户和密码*/
        param: {
          name:"",
          password:"",
        },
        /*注册弹框*/
        toAddUserForm: false,
        /*注册表单*/
        addUserForm: {
          name: "",
          realName: "",
          password: "",
          sex: "",
          phone: "",
          email: "",
          idCard: "",
          birthday: "",
          imgUrl: "",
          eduId: "",
          deptId: ""
        },
        /*学历部门信息数据*/
        eduIdDate: [{id: 1, name: "小学"}, {id: 2, name: "初中"}, {id: 3, name: "高中"}, {id: 4, name: "大学"}],
        deptIdDate: [{id: 1, name: "总裁"}, {id: 2, name: "总经理"}, {id: 3, name: "组长"}, {id: 4, name: "员工"}],
        /*头像数据*/
        imageUrl: "",

        /*登录校验*/
        rules: {
          name: [{required: true, message: '请输入用户账户', trigger: 'blur'}],
          password: [{required: true, message: '请输入用户密码', trigger: 'blur'}],
        },
      };
    },
    methods: {
      submitForm: function (param) {
        console.log(this.param);
        this.$refs[param].validate((value) => {
          if(value){
            this.$ajax.post("http://localhost:8080/api/loginController/loginUser?"+this.$qs.stringify(this.param)).then(res=>{
              console.log(res.data.data);
              if(res.data.data.code==1){
                alert("用户不存在");
              }else if(res.data.data.code==2){
                alert("登录成功");
                localStorage.setItem('ms_username', this.param.name);
                localStorage.setItem('imgpath', res.data.data.img);
                this.$router.push('/');
              }else if(res.data.data.code==3){
                alert("用户密码错误")
              }
            }).catch(re=>{
              console.log(re);
            })
          }
        });
      },
      /*开启注册用户的弹框*/
      addUserFormFlog: function () {
        this.addUserForm = {
          name: "",
          realName: "",
          password: "",
          sex: "",
          phone: "",
          email: "",
          idCard: "",
          birthday: "",
          imgUrl: "",
          eduId: "",
          deptId: ""
        };
        this.imageUrl="";
        this.toAddUserForm = true;
      },
      /*注册提交*/
      addUserFormDate:function(){
        console.log(this.addUserForm);
        this.$ajax.post("http://localhost:8080/api/loginController/addUser?"+this.$qs.stringify(this.addUserForm)).then(res=>{
          console.log(res.data.data.code);
          if(res.data.data.code==0){
            alert("用户已存在");
          }else if(res.data.data.code==1){
            alert("注册成功");
          }
          this.toAddUserForm=false;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*注册的图片上传*/
      imgsaveFile: function (response, file) {
        this.addUserForm.imgUrl = response.data;
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
    },
  };
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
