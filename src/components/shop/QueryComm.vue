<template>
  <div>
    <el-input v-model="commName" placeholder="请输入名称" style="width: 200px"></el-input>
    <el-select v-model="commBandId" placeholder="请选择商品品牌">
      <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-button type="primary" size="small" icon="el-icon-search" @click="queryCommodtiy">搜索</el-button>
    <router-link to="/Commodity">
      <el-button type="primary">新增</el-button>
    </router-link>

    <!--商品数据展示-->
    <el-table
      :data="queryCommTable"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="商品序号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="bandId"
        label="品牌名称"
        :formatter="bandIdData">
      </el-table-column>
      <el-table-column
        prop="typeId"
        label="商品属性">
      </el-table-column>
      <el-table-column
        prop="imagepath"
        label="商品图片">
        <template slot-scope="scope">
          <img width="50px" :src="scope.row.imagepath"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="productdecs"
        label="商品介绍">
      </el-table-column>
      <el-table-column
        prop="price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="stocks"
        label="商品库存">
      </el-table-column>
      <el-table-column
        prop="isDel"
        label="是否删除"
        :formatter="isDelData">
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toUpdateCommForm(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="toUpdateIsDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="page"
      :page-sizes="limits"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>

    <!--商品修改表单-->
    <el-dialog title="修改属性" :visible.sync="updateCommFormFolg">
      <el-form ref="updateCommForm" :model="updateCommForm" label-width="80px" style="width: 500px;">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="updateCommForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品标题" prop="title">
          <el-input v-model="updateCommForm.title" placeholder="请输入商品标题"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="bandId">
          <el-select v-model="updateCommForm.bandId" placeholder="请选择商品品牌" clearable style="width: 420px">
            <el-option
              v-for="data in brandData"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品介绍" prop="productdecs">
          <el-input type="textarea" v-model="updateCommForm.productdecs" placeholder="请输入商品介绍"></el-input>
          <p align="right">20/{{20-updateCommForm.productdecs.length}}</p>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model.number="updateCommForm.price" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="商品库存" prop="stocks">
          <el-input v-model.number="updateCommForm.stocks"></el-input>
        </el-form-item>
        <el-form-item label="商品排序" prop="sortNum">
          <el-input v-model.number="updateCommForm.sortNum"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/api/shopdata/saveFile"
            :show-file-list="false"
            :on-success="imgsaveFile"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateCommlData()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--修改isDel-->
    <el-dialog title="修改属性" :visible.sync="toUpdateIsDelFlog">
      <el-radio-group v-model="isDel">
        <el-radio :label="0">不删</el-radio>
        <el-radio :label="1">删除</el-radio>
      </el-radio-group><br/>
      <el-button type="primary" @click="updateIsDel">确定</el-button>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "QueryComm",
    data() {
      return {
        /*展示的数据*/
        queryCommTable: [],
        /*分页*/
        count: 0,
        page: 1,
        limit: 5,
        limits: [5, 8, 10, 15],
        /*条件查询*/
        commName: "",
        commBandId: "",
        /*品牌的数据*/
        brandData: [],
        /*修改弹框*/
        updateCommFormFolg: false,
        /*修改的数据*/
        updateCommForm: {
          name: "",
          title: "",
          bandId: "",
          productdecs: "",
          price: "",
          stocks: "",
          sortNum: "",
          imagepath: "",
          isDel:""
        },
        /*修改的图片路径*/
        imageUrl: "",
        /*修改isDel的属性*/
        toUpdateIsDelFlog:false,
        isDel:"",
        delId:""

      }
    }, created: function () {
      /*调用查询要展示数据的方法*/
      this.queryCommodtiy();
      /*查询品牌的数据*/
      this.queryBrandData();
    }, methods: {
      /*查询商品的展示数据*/
      queryCommodtiy: function () {
        let pram = {page: this.page, limit: this.limit, commName: this.commName, commBandId: this.commBandId};
        this.$ajax.get("http://localhost:8080/api/commodity/selectCommodity?" + this.$qs.stringify(pram)).then(res => {
          //console.log(res.data.data.data);
          this.queryCommTable = res.data.data.data;
          //console.log(this.queryCommTable)
          this.count = res.data.data.count;
        }).catch(re => {
          console.log(re);
        })
      },
      /*查询修改商品的数据*/
      toUpdateCommForm: function (row) {
        this.updateCommFormFolg = true;
        this.$ajax.get("http://localhost:8080/api/commodity/selectCommodityByid?id=" + row.id).then(res => {
          //console.log(res.data.data);
          this.updateCommForm=res.data.data;
          this.imageUrl=this.updateCommForm.imagepath;
        }).catch(re => {
          console.log(re);
        })
      },
      /*提交修改*/
      updateCommlData: function () {
        this.$ajax.post("http://localhost:8080/api/commodity/updateCommodity?"+this.$qs.stringify(this.updateCommForm)).then(res=>{
          alert(res.data.message);
          this.updateCommFormFolg = false;
          this.queryCommodtiy();
        }).catch(re=>{
          console.log(re);
        });
      },
      /*修改的图片上传*/
      imgsaveFile: function (response, file) {
        this.updateCommForm.imagepath = response.data;
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
      /*修改删除isDel属性*/
      toUpdateIsDel:function(row){
        this.delId=row.id;
        this.toUpdateIsDelFlog=true;
      },
      /*提交修改删除isDel属性的数据  */
      updateIsDel:function(){
        this.$ajax.post("http://localhost:8080/api/commodity/deleteCommodity?id="+this.delId+"&isDel="+this.isDel).then(res=>{
          alert(res.data.message);
          this.toUpdateIsDelFlog = false;
          this.queryCommodtiy();
        }).catch(re=>{
          console.log(re);
        })
      },
      /*查询品牌的数据*/
      queryBrandData: function () {
        var pram = {page: 1, limit: 100000};
        this.$ajax.get("http://localhost:8080/api/shopdata/selectShopData?" + this.$qs.stringify(pram)).then(res => {
          //console.log(res.data.data.data);
          this.brandData = res.data.data.data;
        }).catch(re => {
          console.log(re);
        })
      },
      /*展示表分页事件*/
      sizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.limit = val;
        this.queryCommodtiy();
      },
      currentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page = val;
        this.queryCommodtiy();
      },
      /*商品数据处理*/
      bandIdData: function (row, column, value, index) {
        for (let i = 0; i < this.brandData.length; i++) {
          if (value == this.brandData[i].id) {
            return this.brandData[i].name;
          }
        }
      },
      isDelData:function (row, column, value, index) {
        if(value==0){
          return "不删";
        }else {
          return "删除";
        }
      }


    }
  }
</script>

<style scoped>
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
