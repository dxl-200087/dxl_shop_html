<template>
  <div>
    <el-input v-model="cratename" placeholder="请输入名称" style="width: 200px"></el-input>
    <el-button type="primary" size="small" icon="el-icon-search" @click="queryPropertyTable">搜索</el-button>
    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="toSavePropertyForm">新增</el-button>
    <!--数据展示-->
    <el-table
      :data="PropertyTable"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="属性序号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="属性名称">
      </el-table-column>
      <el-table-column
        prop="nameCH"
        label="属性中文">
      </el-table-column>
      <el-table-column
        prop="typeId"
        label="属性分类">
      </el-table-column>
      <el-table-column
        prop="type"
        label="文本类型"
        :formatter="typeData">
      </el-table-column>
      <el-table-column
        prop="isSKU"
        label="是否为SKU"
        :formatter="isSKUData">
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
          <el-button type="primary" size="mini" @click="toUpdatePropertyForm(scope.row)">修改</el-button>
          <el-button v-if="scope.row.type!=3" type="primary" size="mini" @click="toProValTable(scope.row)">赋值</el-button>
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
    <el-dialog title="新增属性" :visible.sync="savePropertyForm">
      <el-form ref="PropertyForm" :model="PropertyForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="PropertyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="中文属性" prop="nameCH">
          <el-input v-model="PropertyForm.nameCH"></el-input>
        </el-form-item>
        <el-form-item label="对应分类" prop="typeId">
          <el-select v-model="PropertyForm.typeId" placeholder="请选择" clearable>
            <el-option
              v-for="data in shopType"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文本类型" prop="type">
          <el-radio-group v-model="PropertyForm.type">
            <el-radio :label="0">下拉框</el-radio>
            <el-radio :label="1">单选框</el-radio>
            <el-radio :label="2">复选框</el-radio>
            <el-radio :label="3">输入框</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否SKU" prop="isSKU">
          <el-radio-group v-model="PropertyForm.isSKU">
            <el-radio :label="0">是SKU</el-radio>
            <el-radio :label="1">否SKU</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="savePropertyForm = false">取 消</el-button>
        <el-button type="primary" @click="savePropertyData('PropertyForm')">确 定</el-button>
      </div>
    </el-dialog>


    <!--修改模板-->
    <el-dialog title="修改属性" :visible.sync="updatePropertyForm">
      <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="中文属性" prop="nameCH">
          <el-input v-model="updateForm.nameCH"></el-input>
        </el-form-item>
        <el-form-item label="对应分类" prop="typeId">
          <el-select v-model="updateForm.typeId" placeholder="请选择" clearable>
            <el-option
              v-for="data in shopType"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文本类型" prop="type">
          <el-radio-group v-model="updateForm.type">
            <el-radio :label="0">下拉框</el-radio>
            <el-radio :label="1">单选框</el-radio>
            <el-radio :label="2">复选框</el-radio>
            <el-radio :label="3">输入框</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否SKU" prop="isSKU">
          <el-radio-group v-model="updateForm.isSKU">
            <el-radio :label="0">是SKU</el-radio>
            <el-radio :label="1">否SKU</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否删除" prop="isDel">
          <el-radio-group v-model="updateForm.isDel">
            <el-radio :label="0">不删</el-radio>
            <el-radio :label="1">删除</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePropertyForm = false">取 消</el-button>
        <el-button type="primary" @click="updatePropertyData('updateForm')">确 定</el-button>
      </div>
    </el-dialog>


    <!--------------------属性值表展示弹框------------------>
    <el-dialog title="属性值表" :visible.sync="proValTable">
      <el-input v-model="craname" placeholder="请输入名称" style="width: 200px"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="queryProValData">搜索</el-button>
      <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="toSaveProValForm">新增</el-button>
      <el-table
        :data="ProValueTable"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="属性值">
        </el-table-column>
        <el-table-column
          prop="nameCH"
          label="中文名称">
        </el-table-column>
        <el-table-column
          prop="proid"
          label="对应属性">
        </el-table-column>
        <el-table-column
          prop="isDel"
          label="是否删除"
          :formatter="isdelValData">
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="toUpdateProValForm(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="valSizeChange"
        @current-change="valCurrentChange"
        :current-page="valpage"
        :page-sizes="vallimits"
        :page-size="vallimit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="valcount">
      </el-pagination>
    </el-dialog>

    <!--属性表新增模板-->
    <el-dialog title="新增属性" :visible.sync="saveProValForm">
      <el-form ref="proValForm" :model="proValForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="属性值" prop="name">
          <el-input v-model="proValForm.name"></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="nameCH">
          <el-input v-model="proValForm.nameCH"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveProValForm = false">取 消</el-button>
        <el-button type="primary" @click="saveProValData('proValForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--属性表修改模板-->
    <el-dialog title="新增属性" :visible.sync="updateProValForm">
      <el-form ref="upproValForm" :model="upproValForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="属性值" prop="name">
          <el-input v-model="upproValForm.name"></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="nameCH">
          <el-input v-model="upproValForm.nameCH"></el-input>
        </el-form-item>
        <el-form-item label="是否删除" prop="isDel">
          <el-radio-group v-model="upproValForm.isDel">
            <el-radio :label="0">不删</el-radio>
            <el-radio :label="1">删除</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateProValForm = false">取 消</el-button>
        <el-button type="primary" @click="updateProValData('upproValForm')">确 定</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
  export default {
    name: "ShopProperty",
    data() {
      return {
        /*属性表分页展示参数*/
        cratename:"",
        PropertyTable:[],
        page:1,
        limit:5,
        limits:[5,8,10],
        count:0,
        /*新增和修改的弹框*/
        savePropertyForm:false,
        updatePropertyForm:false,
        /*分类表所有数据*/
        shopTypeData:[],
        /*处理下拉框*/
        shopType:[],
        shopTypeName:"",
        /*新增数据*/
        PropertyForm:{
          name:"",
          nameCH:"",
          typeId:"",
          type:"",
          isSKU:""
        },
        /*修改数据*/
        updateForm:{
          id:"",
          name:"",
          nameCH:"",
          typeId:"",
          type:"",
          isSKU:"",
          isDel:""
        },
        /*校验*/
        rules:{
          name:[{ required: true, message: '请输入属性名称', trigger: 'blur' }],
          nameCH:[{ required: true, message: '请输入中文属性', trigger: 'blur' }],
          typeId:[{ required: true, message: '请选择对应分类', trigger: 'change' }],
          type:[{ required: true, message: '请选择文本类型', trigger: 'change' }],
          isSKU:[{ required: true, message: '请选择是否SKU', trigger: 'change' }],
          isDel:[{ required: true, message: '请选择是否删除', trigger: 'change' }],
        },
        /*------------属性值表------------*/
        proValTable:false,
        ProValueTable:[],
        proidData:"",
        /*分页条件查询*/
        valpage:1,
        vallimit:5,
        vallimits:[5,8,10],
        valcount:0,
        craname:"",
        /*新增*/
        saveProValForm:false,
        updateProValForm:false,
        /*新增*/
        proValForm:{
          name:"",
          nameCH:"",
          proid:0,
        },
        /*修改*/
        upproValForm:{
          id:"",
          name:"",
          nameCH:"",
          isDel:"",
          proid:"",
        }

      }
    },created:function () {
        this.queryPropertyTable();
    },methods:{

      //属性值表部分
      /*开启属性值表修改弹框*/
      toUpdateProValForm:function(row){
        this.updateProValForm=true;
        this.$ajax.get("http://localhost:8080/api/val/selectProValByid?id="+row.id).then(res=>{
          //console.log(res.data.data);
          this.upproValForm=res.data.data;
        }).catch(re=>{
          console.log(re)
        })
      },
      /*修改提交*/
      updateProValData:function(upproValForm){
        this.$refs[upproValForm].validate((flog) => {
          if(flog==true){
            this.$ajax.post("http://localhost:8080/api/val/updateProVal?"+this.$qs.stringify(this.upproValForm)).then(res=>{
              alert(res.data.message);
              this.updateProValForm=false;
              this.queryProValData();
            }).catch(re=>{
              console.log(re);
            })
          }
        })
      },
      /*开启属性值表的新增弹框*/
      toSaveProValForm:function(){
        this.saveProValForm=true;
        this.proValForm={
          name:"",
          nameCH:"",
          proid:0,
        }
      },
      /*提交属性值表的新增*/
      saveProValData:function(proValForm){
        //console.log(this.proValForm)
        this.proValForm.proid=this.proidData;
        this.$refs[proValForm].validate((flog) => {
          if(flog==true){
            this.$ajax.post("http://localhost:8080/api/val/saveProVal?"+this.$qs.stringify(this.proValForm)).then(res=>{
              //console.log(res.data);
              alert(res.data.message);
              this.saveProValForm=false;
              this.queryProValData();
            }).catch(re=>{
              console.log(re);
            })
          }
        })
      },
      /*属性值表展示弹框*/
      toProValTable:function(row){
        this.proValTable=true;
        this.proidData=row.id;
        this.craname="";
        this.queryProValData();
      },
      /*查询属性对应的属性值*/
      queryProValData:function(){
        this.$ajax.get("http://localhost:8080/api/val/selectByIdLimit?page="+this.valpage+"&limit="+this.vallimit+"&proid="+this.proidData+"&craname="+this.craname).then(res=>{
          //console.log(res.data.data);
          this.ProValueTable=res.data.data.data;
          this.valcount=res.data.data.count;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*属性值表分页*/
      valSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.vallimit=val;
        this.queryProValData();
      },
      valCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.valpage=val;
        this.queryProValData();
      },
      /*初始化数据*/
      isdelValData:function(row,column,value,index){
        if(value==0){
          return "不删";
        }else {
          return "删除";
        }
      },



      //-------------------属性表方法-----------------
      /*修改弹框的处理*/
      toUpdatePropertyForm:function(row){
        this.shopType=[];
        this.updatePropertyForm=true;
        this.$ajax.get("http://localhost:8080/api/property/selectPropertyByid?id="+row.id).then(res=>{
          //console.log(res.data.data)
          this.querySelectOne();
          this.updateForm=res.data.data;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*修改提交*/
      updatePropertyData:function(updateForm){
        //console.log(this.updateForm)
        this.$refs[updateForm].validate((flog) => {
          if(flog==true){
            this.$ajax.post("http://localhost:8080/api/property/updateProperty?"+this.$qs.stringify(this.updateForm)).then(res=>{
              //console.log(res.data.data);
              alert(res.data.message);
              this.updatePropertyForm=false;
              this.queryPropertyTable();
            }).catch(re=>{
              console.log(re);
            })
          }
        })
      },
      /*查询所有分类的数据 处理拼接下拉框*/
      querySelectOne:function(){
        this.$ajax.get("http://localhost:8080/api/type/selectType").then(res=>{
          //console.log(res.data.data);
          this.shopTypeData=res.data.data;
          this.querySelectTwo();
          for (let i = 0; i <this.shopType.length ; i++) {
            this.shopTypeName="";
            this.isParent(this.shopType[i]);
            //console.log(this.shopTypeName);
            this.shopType[i].name=this.shopTypeName.split("/").reverse().join("/").substr(0,this.shopTypeName.length-1)
          }
        }).catch(re=>{
          console.log(re);
        })
      },
      /*递归判断是否达到最顶层数据*/
      isParent:function(data){
        if(data.pid!=0){
          this.shopTypeName+="/"+data.name;
          for (let i = 0; i <this.shopTypeData.length ; i++) {
            if(data.pid==this.shopTypeData[i].id){
              this.isParent(this.shopTypeData[i]);
              break;
            }
          }
        }else {
          this.shopTypeName+="/"+data.name;
        }
      },
      /*循环调用判断是否是底层数据的方法*/
      querySelectTwo:function(){
        for (let i = 0; i <this.shopTypeData.length ; i++) {
          this.isLastData(this.shopTypeData[i]);
        }
      },
      /*判断是否是底层数据*/
      isLastData:function(data){
        var flog=true;
        for (let i = 0; i <this.shopTypeData.length ; i++) {
          if(data.id==this.shopTypeData[i].pid){
            flog=false;
            return flog;
          }
        }
        if(flog==true){
          this.shopType.push(data);
        }
      },
      /*开启新增弹框*/
      toSavePropertyForm:function(){
        this.PropertyForm={
            name:"",
            nameCH:"",
            typeId:"",
            type:"",
            isSKU:""
        }
        this.shopType=[];
        this.savePropertyForm=true;
        this.querySelectOne();
      },
      /*提交新增*/
      savePropertyData:function(PropertyForm){
        this.$refs[PropertyForm].validate((flog) => {
          if(flog==true){
            this.$ajax.post("http://localhost:8080/api/property/saveProperty?"+this.$qs.stringify(this.PropertyForm)).then(res=>{
              //console.log(res.data.data)
              alert(res.data.message);
              this.savePropertyForm=false;
              this.queryPropertyTable();
            }).catch(re=>{
              console.log(re);
            })
          }
        })
      },
      /*查询展示属性数据*/
      queryPropertyTable:function(){
        this.$ajax.get("http://localhost:8080/api/property/selectProperty?page="+this.page+"&limit="+this.limit+"&cratename="+this.cratename).then(res=>{
          //console.log(res.data.data.data);
          this.PropertyTable=res.data.data.data;
          this.count=res.data.data.count;
        }).catch(re=>{
          console.log(re)
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
      isSKUData:function (row,column,value,index) {
        if(value==0){
          return "是";
        }else {
          return "否";
        }
      },
      typeData:function (row,column,value,index) {
        if(value==0){
          return "下拉框";
        }else if(value==1){
          return "单选框";
        }else if(value==2){
          return "复选框";
        }else if(value==3){
          return "输入框";
        }
      },
      /*分页*/
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.limit=val;
        this.queryPropertyTable();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page=val;
        this.queryPropertyTable();
      }
    }
  }
</script>

<style scoped>

</style>
