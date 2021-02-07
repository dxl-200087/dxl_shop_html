<template>
  <div>
    <!--条件查询-->
    <el-input v-model="crateName" placeholder="请输入角色名称" style="width: 200px"></el-input>
    <el-button type="primary" size="small" icon="el-icon-search" @click="queryPersonaData">搜索</el-button>
    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="toSavePersonaForm">新增</el-button>
    <!--角色table数据展示-->
    <el-table
      :data="personaData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="角色ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="isDel"
        label="是否删除"
        :formatter="isdelData">
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toUpdatePersonaForm(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="toURoleMissForm(scope.row)">赋权限</el-button>
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

    <!--新增模板-->
    <el-dialog title="新增角色" :visible.sync="savePersonaForm">
      <el-form ref="personaForm" :model="personaForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="personaForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="savePersonaForm = false">取 消</el-button>
        <el-button type="primary" @click="savePersonaData('personaForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改模板-->
    <el-dialog title="修改角色" :visible.sync="updatePersonaForm">
      <el-form ref="updateData" :model="updateData" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="updateData.name"></el-input>
        </el-form-item>
        <el-form-item label="是否删除" prop="isDel">
          <el-radio-group v-model="updateData.isDel">
            <el-radio :label="0">不删</el-radio>
            <el-radio :label="1">删除</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePersonaForm = false">取 消</el-button>
        <el-button type="primary" @click="updatePersonaData('updateData')">确 定</el-button>
      </div>
    </el-dialog>

    <!--赋权限模板-->
    <el-dialog title="赋权限" :visible.sync="addPersonaMissForm">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-checked-keys="[]"
        :props="defaultProps"
        :expand-on-click-node="false"
        accordion
        ref="tree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPersonaMissForm = false">取 消</el-button>
        <el-button type="primary" @click="addPersonaMissData()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Persona",
    data() {
      return {
        /*表格数据*/
        personaData:[],
        /*条件查询分页*/
        crateName:"",
        count:0,
        page:1,
        limits:[5,8,10],
        limit:5,
        /*新增弹框*/
        savePersonaForm:false,
        personaForm:{
          name:"",
          isDel:0
        },
        /*修改弹框*/
        updatePersonaForm:false,
        updateData:{
          id:"",
          name:"",
          isDel:""
        },
        /*校验*/
        rules:{
          name:[{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          isDel:[{ required: true, message: '请选择是否删除', trigger: 'change' }]
        },
        /*赋权限*/
        addPersonaMissForm:false,//赋权限弹框
        defaultProps:{children:'children',label:'label'},
        treeData:[],//树结构数据
        permissionsDataStr:"",//处理树结构拼接的字符串
        rid:"",//赋角色id
        roleData:"",  //所有的权限数据
      }
    },created:function(){
      this.queryPersonaData();
    },
    methods: {
      /*角色赋权限*/
      addPersonaMissData:function(){
        let roleMenuId = [].concat(this.$refs.tree.getCheckedKeys(), this.$refs.tree.getHalfCheckedKeys())
        //console.log(roleMenuId);
        this.$ajax.post("http://localhost:8080/api/persona/addRoleMenuData?rid="+this.rid+"&roleMenuId="+roleMenuId).then(res=>{
          alert(res.data.message);
          this.addPersonaMissForm=false;
        }).catch(re=>{
          console.log(re);
        })
      },

      /*角色赋权限回显*/
      toURoleMissForm:function(row){
        //alert(row.id);
        this.rid=row.id;
        this.addPersonaMissForm=true;
        this.treeData=[];
        this.$ajax.get("http://localhost:8080/api/persona/selectPersonaOrMiss?rid="+row.id).then(res=>{
          this.roleData=res.data.data.roleData;
          /*调用遍历循环判断顶层数据*/
          this.queryTop();
          /*回显数据*/
          this.checkedData(res.data.data.roleMissData,this.roleData);
        }).catch(re=>{
          console.log(re);
        })
      },
      /*回显该角色有的权限数据*/
      checkedData:function(data,roleData){
        //console.log(data)
        if(data.length>0){
          let ckArr=[];
          for (let i = 0; i <data.length ; i++) {
            for (let j = 0; j <roleData.length ; j++) {
              /*判断type是否是菜单*/
              if(data[i].mid==roleData[j].id&&roleData[j].type==1){
                ckArr.push(data[i].mid);
              }
            }
          }
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(ckArr);
          });
          /*/!*另一种的回显方法*!/
          let arr=[];
          for (let i = 0; i <data.length ; i++) {
            arr.push(data[i].mid);
          }
          let that = this
          setTimeout(function() {
            arr.forEach(value => {
              that.$refs.tree.setChecked(value, true, false);
            });
          }, 500);*/
        }
      },
      /*判断顶层数据*/
      queryTop:function(){
        for (let i = 0; i <this.roleData.length ; i++) {
          if(this.roleData[i].pid==1){
            this.permissionsDataStr="";
            this.queryRoleDateStr(this.roleData[i]);
            this.treeData.push(JSON.parse(this.permissionsDataStr));
          }
        }
      },
      /*拼接树结构数据*/
      queryRoleDateStr:function(data){
        if (data.type == 0) {
          this.permissionsDataStr += '{"id":' + data.id + ',"label":"' + data.name + '","children":[';
          let count = 0;
          for (let i = 0; i < this.roleData.length; i++) {
            if (this.roleData[i].pid == data.id) {
              count++;
              this.queryRoleDateStr(this.roleData[i]);
              this.permissionsDataStr += ",";
            }
          }
          if (count != 0) {
            this.permissionsDataStr = this.permissionsDataStr.substr(0, this.permissionsDataStr.length - 1);
          }
          this.permissionsDataStr += ']}';
        } else {
          this.permissionsDataStr += '{"id":' + data.id + ',"label":"' + data.name + '"}';
        }
      },

      /*修改弹框*/
      toUpdatePersonaForm:function(row){
        this.updatePersonaForm=true;
        this.$ajax.get("http://localhost:8080/api/persona/selectPersonaById?id="+row.id).then(res=>{
          //console.log(res.data.data);
          this.updateData=res.data.data;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*修改提交*/
      updatePersonaData:function(updateData){
        this.$refs[updateData].validate((flog) => {
          if(flog==true){
            this.$ajax.post("http://localhost:8080/api/persona/updatePersona?"+this.$qs.stringify(this.updateData)).then(res=>{
              alert(res.data.message);
              this.updatePersonaForm=false;
              this.queryPersonaData();
            }).catch(re=>{
              console.log(re);
            })
          }
        })
      },
      /*新增弹框*/
      toSavePersonaForm:function(){
        this.personaForm={
          name:"",
          isDel:0
        };
        this.savePersonaForm=true;
      },
      /*新增提交*/
      savePersonaData:function(personaForm){
        //console.log(this.personaForm)
        this.$refs[personaForm].validate((flog) => {
          if(flog==true){
            this.$ajax.post("http://localhost:8080/api/persona/savePersona?"+this.$qs.stringify(this.personaForm)).then(res=>{
              //console.log(res.data.message);
              alert(res.data.message);
              this.savePersonaForm=false;
              this.queryPersonaData();
            }).catch(re=>{
              console.log(re);
            })
          }
        })
      },
      /*查询角色表格数据*/
      queryPersonaData:function(){
        this.$ajax.get("http://localhost:8080/api/persona/selectPersonaData?page="+this.page+"&limit="+this.limit+"&crateName="+this.crateName).then(res=>{
          //console.log(res.data);
          this.personaData=res.data.data.data;
          this.count=res.data.data.count;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*初始化数据*/
      isdelData:function (row,column,value,index) {
        if(value==0){
          return "不删";
        }else {
          return "删除";
        }
      },
      /*分页事件*/
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.limit=val;
        this.queryPersonaData();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page=val;
        this.queryPersonaData();
      }
    }


  }
</script>

<style scoped>

</style>
