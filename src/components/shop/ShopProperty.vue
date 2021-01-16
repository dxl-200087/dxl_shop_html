<template>
  <div>
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
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        label="修改时间">
      </el-table-column>
      <el-table-column
        prop="author"
        label="修改人">
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toUpdatePropertyForm(scope.row)">修改</el-button>
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
    <el-dialog title="新增商品" :visible.sync="savePropertyForm">
      <el-form ref="PropertyForm" :model="PropertyForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="PropertyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="中文属性" prop="nameCH">
          <el-input v-model="PropertyForm.nameCH"></el-input>
        </el-form-item>
        <el-form-item label="对应分类" prop="typeId">
          <el-select v-model="shopTypeId" placeholder="请选择" clearable>
            <el-option
              v-for="data in shopType1"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
          <el-select v-model="PropertyForm.typeId" placeholder="请选择" clearable>
            <el-option
              v-for="data2 in shopType2"
              :key="data2.id"
              :label="data2.name"
              :value="data2.id">
              <span style="float: left">{{ data2.name }}</span>
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
    <el-dialog title="新增商品" :visible.sync="updatePropertyForm">
      <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="中文属性" prop="nameCH">
          <el-input v-model="updateForm.nameCH"></el-input>
        </el-form-item>
        <el-form-item label="对应分类" prop="typeId">
          <el-select v-model="shopTypeId" placeholder="请选择" clearable>
            <el-option
              v-for="data in shopType1"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
          <el-select v-model="updateForm.typeId" placeholder="请选择" clearable>
            <el-option
              v-for="data2 in shopType2"
              :key="data2.id"
              :label="data2.name"
              :value="data2.id">
              <span style="float: left">{{ data2.name }}</span>
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


  </div>
</template>

<script>
  export default {
    name: "ShopProperty",
    data() {
      return {
        PropertyTable:[],
        page:1,
        limit:3,
        limits:[3,5,8,10],
        count:0,
        savePropertyForm:false,
        updatePropertyForm:false,
        pid:1,
        shopType1:[],
        shopType2:[],
        shopTypeId:"",
        PropertyForm:{
          name:"",
          nameCH:"",
          typeId:"",
          type:"",
          isSKU:""
        },
        updateForm:{
          id:"",
          name:"",
          nameCH:"",
          typeId:"",
          type:"",
          isSKU:"",
          isDel:""
        },
        rules:{
          name:[{ required: true, message: '请输入属性名称', trigger: 'change' }],
          nameCH:[{ required: true, message: '请输入中文属性', trigger: 'change' }],
          typeId:[{ required: true, message: '请选择对应分类', trigger: 'change' }],
          type:[{ required: true, message: '请选择文本类型', trigger: 'change' }],
          isSKU:[{ required: true, message: '请选择是否SKU', trigger: 'change' }],
          isDel:[{ required: true, message: '请选择是否删除', trigger: 'change' }],
        }
      }
    },created:function () {
        this.queryPropertyTable();
    },methods:{
      /*修改弹框的处理*/
      toUpdatePropertyForm:function(row){
        this.updatePropertyForm=true;
        this.querySelectOne();
        this.$ajax.get("http://localhost:8080/api/property/selectPropertyByid?id="+row.id).then(res=>{
          //console.log(res.data.data)
          this.updateForm=res.data.data;
          this.queryTypeByidData(this.updateForm.typeId);
        }).catch(re=>{
          console.log(re);
        })
      },

      /*根据typeId查询回显对应分类的单条数据*/
      queryTypeByidData:function(id){
        //console.log(this.updateForm)
        this.$ajax.get("http://localhost:8080/api/type/selectTypeByid?id="+id).then(res=>{
          //console.log(res.data.data)
          this.shopTypeId=res.data.data.pid;
          //console.log(this.shopTypeId)
        }).catch(re=>{
          console.log(re);
        })
      },

      /*修改提交*/
      updatePropertyData:function(updateForm){
        console.log(this.updateForm)
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

      /*查询第一个下拉框数据*/
      querySelectOne:function(){
        this.$ajax.get("http://localhost:8080/api/type/selectTypeBypid?pid="+this.pid).then(res=>{
          //console.log(res.data.data);
          this.shopType1=res.data.data;
        }).catch(re=>{
          console.log(re);
        })
      },

      /*处理新增弹框的下拉框*/
      toSavePropertyForm:function(){
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
        this.$ajax.get("http://localhost:8080/api/property/selectProperty?page="+this.page+"&limit="+this.limit).then(res=>{
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
    },watch:{
      /*处理新增弹框的第二个下拉框*/
      shopTypeId:function () {
        //console.log(this.shopTypeId)
        this.PropertyForm.typeId="";

        this.pid=this.shopTypeId;
        this.$ajax.get("http://localhost:8080/api/type/selectTypeBypid?pid="+this.pid).then(res=>{
          //console.log(res.data.data);
          this.shopType2=res.data.data;
        }).catch(re=>{
          console.log(re);
        })
      }
    }
  }
</script>

<style scoped>

</style>
