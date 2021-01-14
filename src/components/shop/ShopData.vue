<template>
  <div>
    <h1>商品展示页面</h1>
    <!--条件查询-->
    <el-input v-model="cratename" placeholder="请输入名称" style="width: 200px"></el-input>
    <el-button type="primary" size="small" icon="el-icon-search" @click="queryShopTable">搜索</el-button>
    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="saveShopDataForm=true">新增</el-button>

    <!--数据展示-->
    <el-table
      :data="shopTable"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="bandE"
        label="首字母">
      </el-table-column>
      <el-table-column
        prop="imgpath"
        label="图片">
        <template slot-scope="scope">
          <img width="50px" :src="'http://'+scope.row.imgpath"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="bandDesc"
        label="品牌介绍">
      </el-table-column>
      <el-table-column
        prop="ord"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="isdel"
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
          <el-button type="primary" size="mini" @click="toUpdateShopData(scope.row)">修改</el-button>
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
    <el-dialog title="新增商品" :visible.sync="saveShopDataForm">
      <el-form ref="saveForm" :model="saveForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="saveForm.name"></el-input>
        </el-form-item>
        <el-form-item label="首字母" prop="bandE">
          <el-input v-model="saveForm.bandE"></el-input>
        </el-form-item>
        <el-form-item label="品牌排序" prop="ord">
          <el-input v-model.number="saveForm.ord"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/api/shopdata/saveFile"
            :on-success="imgSaveFile"
            name="file"
            list-type="picture">
            <el-button size="small" type="primary" icon="el-icon-picture">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品介绍" prop="bandDesc">
          <el-input type="textarea" v-model="saveForm.bandDesc"></el-input>
          <p>{{50-saveForm.bandDesc.length}}/50</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveShopDataForm = false">取 消</el-button>
        <el-button type="primary" @click="saveShopData('saveForm')">确 定</el-button>
      </div>
    </el-dialog>


    <!--修改模板-->
    <el-dialog title="新增商品" :visible.sync="updateShopDataForm">
      <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="80px" style="width: 500px;">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="首字母" prop="bandE">
          <el-input v-model="updateForm.bandE"></el-input>
        </el-form-item>
        <el-form-item label="品牌排序" prop="ord">
          <el-input v-model="updateForm.ord"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/api/shopdata/saveFile"
            :on-success="imgUpdateFile"
            name="file"
            list-type="picture">
            <el-button size="small" type="primary" icon="el-icon-picture">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品介绍" prop="bandDesc">
          <el-input type="textarea" v-model="updateForm.bandDesc"></el-input>
        </el-form-item>
        <el-form-item label="是否删除">
          <el-radio-group v-model="updateForm.isdel">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateShopDataForm = false">取 消</el-button>
        <el-button type="primary" @click="updateShopData('updateForm')">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "ShopData",
    data() {
      return {
        shopTable: [],
        page:1,
        limit:3,
        limits:[3,5,8,10],
        count:0,
        cratename:"",
        saveShopDataForm:false,
        updateShopDataForm:false,
        saveForm:{
          name:"",
          bandE:"",
          imgpath:"",
          bandDesc:"",
          ord:""
        },
        updateForm:{
          id:"",
          name:"",
          bandE:"",
          imgpath:"",
          bandDesc:"",
          ord:"",
          isdel:""
        },
        rules:{
          bandDesc:[{ required: true, message: '请输入商品介绍', trigger: 'change' },
            { min:0,max: 50, message: '长度在0到50个字符', trigger: 'change' }],
          name:[{ required: true, message: '请输入商品名称', trigger: 'change' }],
          bandE:[{ required: true, message: '请输入商品搜字母', trigger: 'change' },
            {pattern:/^[A-Z]$/,message: '大写字母且只有一位',trigger: 'change' }],
          ord:[{ required: true, message: '请输入商品排序', trigger: 'change' },
            { min:1,type: 'number',message: '最小为1且只能为数字',trigger: 'change' }]
        }
      }
    },created:function () {
      this.queryShopTable()
    },methods:{
      /*回显*/
      toUpdateShopData:function(row){
        this.updateShopDataForm=true;
        this.$ajax.get("http://localhost:8080/api/shopdata/selectShopByid?id="+row.id).then(res=>{
          this.updateForm=res.data.data;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*修改*/
      updateShopData:function(updateForm){
        this.$refs[updateForm].validate((flog) => {
          if(flog==true){
            this.$ajax.post("http://localhost:8080/api/shopdata/updateShopData?"+this.$qs.stringify(this.updateForm)).then(res=>{
              alert(res.data.message);
              this.updateShopDataForm=false;
              this.queryShopTable();
            }).catch(re=>{
              console.log(re);
            })
          }else {
            return false;
          }
        })
      },
      /*修改图片上传*/
      imgUpdateFile:function(response, file, fileList){
        //console.log(response.data);
        this.updateForm.imgpath=response.data;
        //console.log(file);
      },
      /*新增*/
      saveShopData:function(saveForm){
        this.$refs[saveForm].validate((flog) => {
          if (flog==true) {
            this.$ajax.post("http://localhost:8080/api/shopdata/saveShopData?"+this.$qs.stringify(this.saveForm)).then(res=>{
              //console.log(res.data)
              alert(res.data.message);
              this.saveShopDataForm=false;
              this.queryShopTable();
            }).catch(re=>{
              console.log(re);
            })
          }else {
            return false;
          }
        })
      },
      /*新增图片上传*/
      imgSaveFile:function(response, file, fileList){
        //console.log(response.data);
        this.saveForm.imgpath=response.data;
      },
      /*查询数据*/
      queryShopTable:function(){
        this.$ajax.get("http://localhost:8080/api/shopdata/selectShopData?page="+this.page+"&limit="+this.limit+"&cratename="+this.cratename).then(res=>{
          //console.log(res.data)
          this.shopTable=res.data.data.data;
          this.count=res.data.data.count;
        }).catch(re=>{
          console.log(re);
        })
      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.limit=val;
        this.queryShopTable();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page=val;
        this.queryShopTable();
      },
      isdelData:function (row,column,value,index) {
        if(value=0){
          return "否";
        }else {
          return "是";
        }
      }
    }
  }
</script>

<style scoped>

</style>
