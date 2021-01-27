<template>
  <div align="center">
    <!--步骤条-->
    <el-steps :active="active" align-center>
      <el-step title="步骤1" description="商品表单"></el-step>
      <el-step title="步骤2" description="商品属性"></el-step>
      <el-step title="步骤3" description="提交成功"></el-step>
    </el-steps>

    <!--商品注册表单-->
    <el-form ref="commodityForm" :rules="rules" :model="commodityForm" label-width="80px" style="width: 500px;"
             v-if="active==0">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="commodityForm.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品标题" prop="title">
        <el-input v-model="commodityForm.title" placeholder="请输入商品标题"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌" prop="bandId">
        <el-select v-model="commodityForm.bandId" placeholder="请选择商品品牌" clearable style="width: 420px">
          <el-option
            v-for="data in shopData"
            :key="data.id"
            :label="data.name"
            :value="data.id">
            <span style="float: left">{{ data.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品介绍" prop="productdecs">
        <el-input type="textarea" v-model="commodityForm.productdecs" placeholder="请输入商品介绍"></el-input>
        <p align="right">20/{{20-commodityForm.productdecs.length}}</p>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input-number v-model.number="commodityForm.price" :precision="2" :step="0.1"></el-input-number>
      </el-form-item>
      <el-form-item label="商品库存" prop="stocks">
        <el-input v-model.number="commodityForm.stocks"></el-input>
      </el-form-item>
      <el-form-item label="商品排序" prop="sortNum">
        <el-input v-model.number="commodityForm.sortNum"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/api/commodity/upFile?"
          :show-file-list="false"
          :on-success="imgsaveFile"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetForm('commodityForm')">重置</el-button>
        <el-button type="primary" style="margin-top: 12px;" @click="next('commodityForm')">下一步</el-button>
      </el-form-item>
    </el-form>


    <!--商品的属性-->
    <div v-if="active==1">
      <el-form ref="commProForm" :model="commProForm" label-width="80px" style="width: 500px;">
        <el-form-item label="商品类型">
          <el-select v-model="commProForm.typeId" placeholder="请选择商品类型" clearable style="width: 420px"
                     @change="getShopProData">
            <el-option
              v-for="data in typeData"
              :key="data.id"
              :label="data.name"
              :value="data.id">
              <span style="float: left">{{ data.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <!--是SKU的属性-->
        <el-form-item v-if="skuData.length>0" label="商品SKU">
          <el-form-item v-for="sku in skuData" :key="sku.id" :label="sku.nameCH">
            <!--复选组-->
            <el-checkbox-group v-if="sku.type==2" v-model="sku.skuCkVal" @change="skuCheckData">
              <el-checkbox
                v-for="sdata in sku.values"
                :label="sdata.nameCH"
                :value="sdata.id"
                :key="sdata.id">
              </el-checkbox>
            </el-checkbox-group>

          </el-form-item>
        </el-form-item>

        <!--动态的SKU属性的表格-->
        <el-table :data="tableData" stripe style="width: 100%" v-if="proTableShow">
          <!--sku动态展示-->
          <el-table-column v-for="td in cols" :key="td.id" :label="td.nameCH" :prop="td.name">
          </el-table-column>
          <!--价格和库存-->
          <el-table-column
            label="属性价格">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="属性库存">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.stocks"></el-input>
            </template>
          </el-table-column>
        </el-table>

        <!--不是SKU的属性-->
        <el-form-item v-if="noSkuData.length>0" label="商品规格">
          <el-form-item v-for="nosku in noSkuData" :key="nosku.id" :label="nosku.nameCH">
            <!--输入框-->
            <el-input  v-if="nosku.type==3" v-model="nosku.skuCkVal"></el-input>

            <!--单选组-->
            <el-radio-group v-if="nosku.type==1" v-model="nosku.skuCkVal">
              <el-radio
                v-for="nsdata in nosku.values"
                :label="nsdata.id"
                :key="nsdata.id">
                {{nsdata.nameCH}}
              </el-radio>
            </el-radio-group>

            <!--复选组-->
            <el-checkbox-group v-if="nosku.type==2" v-model="nosku.skuCkVal">
              <el-checkbox
                v-for="nsdata in nosku.values"
                :label="nsdata.nameCH"
                :value="nsdata.id"
                :key="nsdata.id">
              </el-checkbox>
            </el-checkbox-group>

            <!--下拉框-->
            <el-select placeholder="请选择" v-if="nosku.type==0" v-model="nosku.skuCkVal" clearable>
              <el-option
                v-for="nsdata in nosku.values"
                :key="nsdata.id"
                :label="nsdata.nameCH"
                :value="nsdata.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="margin-top: 12px;" @click="active--">上一步</el-button>
          <el-button type="primary" style="margin-top: 12px;"  @click="addCommAndPro">提交信息</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Commodity",
    data() {
      return {
        /*步骤一的属性*/
        active: 0,
        imageUrl: "",
        /*下拉框所有数据*/
        shopData: [],
        /*商品注册表单*/
        commodityForm: {
          name: "",
          title: "",
          bandId: "",
          productdecs: "",
          price: "",
          stocks: "",
          sortNum: "",
          imagepath: ""
        },
        /*表单校验*/
        rules:{
          name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
          title:[{required:true,message:'请输入商品标题',trigger:'blur'}, {min:2,max:15,message:'长度在2到15个字',trigger:'blur'}],
          bandId:[{required:true,message:'请选择商品品牌',trigger:'change'}],
          productdecs:[{required:true,message:'请输入商品介绍',trigger:'blur'},{max:20,message:'长度最多为20个字',trigger:'change'}],
          price:[{required:true,message:'请输入商品价格',trigger:'change'},{ type:'number',message:'价格必须为数字值'}],
          stocks:[{required:true,message:'请输入商品库存',trigger:'change'},{ type:'number',message:'库存必须为数字值'}],
          sortNum:[{required:true,message:'请输入商品排序',trigger:'change'},{ type:'number',message:'排序必须为数字值'}]
        },
        /*------------------步骤二的属性----------------*/
        /*类型下拉框处理*/
        shopTypeData: [],
        typeData: [],
        typeDataName: "",
        /*表单值*/
        commProForm: {
          typeId: ""
        },
        /*是SKU的属性数据和不是SKU的属性数据*/
        skuData: [],
        noSkuData: [],
        /*属性表格数据和展示*/
        proTableShow:false,
        cols:[],
        tableData:[]
      }
    }, created: function () {
      this.queryTypeData();
      this.quesyShopData();
    },
    methods: {
      /*步骤一的重置*/
      resetForm: function (commodityForm) {
        this.$refs[commodityForm].resetFields();
      },
      /*步骤条的下一步*/
      next: function (commodityForm) {
        this.$refs[commodityForm].validate((flog) => {
          if(flog==true){
            if (this.active++ > 2) this.active = 0;
          }
        })
      },
      /*处理图片上传*/
      imgsaveFile: function (response, file) {
        this.commodityForm.imagepath = response.data;
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
      /*步骤一的下拉框处理*/
      quesyShopData: function () {
        var pram = {page: 1, limit: 100000};
        this.$ajax.get("http://localhost:8080/api/shopdata/selectShopData?" + this.$qs.stringify(pram)).then(res => {
          //console.log(res.data.data.data);
          this.shopData = res.data.data.data;
        }).catch(re => {
          console.log(re);
        })
      },
      /*-------------------步骤二------------------*/
      /*新增提交*/
      addCommAndPro:function(){
        this.commodityForm.typeId=this.commProForm.typeId;
        //普通属性
        //console.log(this.commodityForm);
        //sku属性
        //console.log(this.tableData);
        //不是sku属性
        //console.log(this.noSkuData);
        let arrStr=[];
        for (let i = 0; i <this.noSkuData.length ; i++) {
          let arrStrData={};
          arrStrData[this.noSkuData[i].name]=this.noSkuData[i].skuCkVal;
          arrStr.push(arrStrData);
        }
        this.commodityForm.noSKU=JSON.stringify(arrStr);
        this.commodityForm.sku=JSON.stringify(this.tableData);
        //console.log(this.commodityForm);
        this.$ajax.post("http://localhost:8080/api/commodity/saveCommodity?"+this.$qs.stringify(this.commodityForm)).then(res=>{
          //console.log(res.data.message);
          alert(res.data.message);
        }).catch(re=>{
          console.log(re);
        })
      },
      /*根据下拉框内容改变，查询对应的属性数据*/
      getShopProData: function (typeId) {
        this.tableData=[];
        this.proTableShow=false;
        this.skuData = [];
        this.noSkuData = [];
        this.$ajax.get("http://localhost:8080/api/property/selectProByTypeId?typeId=" + typeId).then(res => {
          //console.log(res.data.data);
          let shopPro = res.data.data;
          //处理skuData  和  noSkuData的数据
          for (let i = 0; i <shopPro.skuData.length ; i++) {
            shopPro.skuData[i].skuCkVal=[];
          }
          for (let i = 0; i <shopPro.noSkuData.length ; i++) {
            if(shopPro.noSkuData[i].type!=3){
              shopPro.noSkuData[i].skuCkVal=[];
            }else {
              shopPro.noSkuData[i].skuCkVal="";
            }
          }
          this.skuData=shopPro.skuData;
          this.noSkuData=shopPro.noSkuData;
        }).catch(re => {
          console.log(re);
        })
      },
      /*笛卡尔积函数*/
      calcDescartes:function(array) {
        if (array.length < 2) return array[0] || [];
        return [].reduce.call(array, function (col, set) {
          var res = [];
          col.forEach(function (c) {
            set.forEach(function (s) {
              var t = [].concat(Array.isArray(c) ? c : [c]);
              t.push(s);
              res.push(t);
            })
          });
          return res;
        });
      },
      /*SKU属性复选框的事件*/
      skuCheckData: function () {
        this.cols=[];
        this.tableData=[];
        let arr=[];
        var flog=true;
        for (let i = 0; i <this.skuData.length ; i++) {
          /*拼接动态表头*/
          this.cols.push({id:this.skuData[i].id,nameCH:this.skuData[i].nameCH,name:this.skuData[i].name});
          /*处理调用笛卡尔积的参数*/
          arr.push(this.skuData[i].skuCkVal);
          if(this.skuData[i].skuCkVal.length==0){
            flog=false;
            break;
          }
        }
        if(flog==true){
          /*笛卡尔积返回的数据*/
          let data=this.calcDescartes(arr);
          /*循环处理动态表格的数据*/
          for (let i = 0; i <data.length ; i++) {
            let jsonData={};
            if(typeof data[i]=="object"){
              for (let j = 0; j <data[i].length ; j++) {
                let key=this.cols[j].name;
                jsonData[key]=data[i][j];
              }
            }else {
              let key=this.cols[0].name;
              jsonData[key]=data[i];
            }
            this.tableData.push(jsonData);
          }
          //console.log(this.tableData);
        }
        this.proTableShow=flog;
      },

      /*步骤二的商品类型下拉框处理*/
      queryTypeData: function () {
        this.$ajax.get("http://localhost:8080/api/type/selectType").then(res => {
          //console.log(res.data.data);
          this.shopTypeData = res.data.data;
          this.queryTypeDataTwo();
          for (let i = 0; i < this.typeData.length; i++) {
            this.typeDataName = "";
            this.isParent(this.typeData[i]);
            //处理下拉框的name值
            this.typeData[i].name = this.typeDataName.split("/").reverse().join("/").substr(0, this.typeDataName.length - 1)
          }
        }).catch(re => {
          console.log(re);
        })
      },
      /*判断顶层数据  拼接下拉框的name值*/
      isParent: function (data) {
        if (data.pid != 0) {
          this.typeDataName += "/" + data.name;
          for (let i = 0; i < this.shopTypeData.length; i++) {
            if (data.pid == this.shopTypeData[i].id) {
              this.isParent(this.shopTypeData[i]);
              break;
            }
          }
        } else {
          this.typeDataName += "/" + data.name;
        }
      },
      /*遍历循环每条数据调用判断是否是底层数据*/
      queryTypeDataTwo: function () {
        for (let i = 0; i < this.shopTypeData.length; i++) {
          this.isLastData(this.shopTypeData[i]);
        }
      },
      /*判断是否是底层数据*/
      isLastData: function (data) {
        var flog = true;
        for (let i = 0; i < this.shopTypeData.length; i++) {
          if (data.id == this.shopTypeData[i].pid) {
            flog = false;
            return flog;
          }
        }
        if (flog == true) {
          this.typeData.push(data);
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
