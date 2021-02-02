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
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toUpdatePersonaForm(scope.row)">修改</el-button>
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
    <el-dialog title="新增角色" :visible.sync="updatePersonaForm">
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
        }
      }
    },created:function(){
      this.queryPersonaData();
    },
    methods: {
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
