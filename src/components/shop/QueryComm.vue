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
        label="商品属性"
        :formatter="typeIdData">
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
          <el-button type="primary" size="mini" @click="toUpdatePro(scope.row)">属性维护</el-button>
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
    <el-dialog title="修改弹框" :visible.sync="updateCommFormFolg">
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
    <el-dialog title="删除弹框" :visible.sync="toUpdateIsDelFlog">
      <el-radio-group v-model="isDel">
        <el-radio :label="0">不删</el-radio>
        <el-radio :label="1">删除</el-radio>
      </el-radio-group>
      <br/>
      <el-button type="primary" @click="updateIsDel">确定</el-button>
    </el-dialog>


    <!----------------属性维护的动态表单----------------->
    <el-dialog title="属性维护" :visible.sync="toUpdateProFlog">
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
            <el-input v-if="nosku.type==3" v-model="nosku.skuCkVal"></el-input>
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
          <el-button type="primary" @click="updateProValAttrData">确定</el-button>
        </el-form-item>
      </el-form>
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
          isDel: ""
        },
        /*修改的图片路径*/
        imageUrl: "",
        /*修改isDel的属性*/
        toUpdateIsDelFlog: false,
        isDel: "",
        delId: "",

        /*属性维护*/
        toUpdateProFlog: false,
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
        proTableShow: false,
        cols: [],
        /*表格数据*/
        tableData: [],
        /*修改的属性的proid*/
        attrProid:""
      }
    }, created: function () {
      /*调用查询要展示数据的方法*/
      this.queryCommodtiy();
      /*查询品牌的数据*/
      this.queryBrandData();
      /*处理下拉框*/
      this.queryTypeData();
    }, methods: {
      /*提交修改属性数据*/
      updateProValAttrData:function(){
        //alert(this.attrProid);
        let arrStr=[];
        for (let i = 0; i <this.noSkuData.length ; i++) {
          let arrStrData={};
          arrStrData[this.noSkuData[i].name]=this.noSkuData[i].skuCkVal;
          arrStr.push(arrStrData);
        }

        let data={"sku":JSON.stringify(this.tableData),"nosku":JSON.stringify(arrStr),proid:this.attrProid}
        this.$ajax.post("http://localhost:8080/api/property/updateProValAttrData?"+this.$qs.stringify(data)).then(res=>{
          console.log(res.data);
          alert(res.data.message);
          this.toUpdateProFlog=false;
        }).catch(re=>{
          console.log(re);
        })
      },
      /*回显弹框*/
      toUpdatePro: function (row) {
        /*修改的属性的proid*/
        this.attrProid=row.id;

        /*开启属性维护的弹框*/
        this.toUpdateProFlog = true;
        /*赋值下拉框*/
        this.commProForm.typeId = row.typeId;
        /*回显*/
        this.getShopProData2(row.typeId, row.id);
        /*处理sku属性的表格数据*/
        this.selectSkuTable(row.id);
      },
      selectSkuTable:function(id){
        this.$ajax.get("http://localhost:8080/api/property/selectSkuTable?proid="+id).then(res=>{
          //console.log(res.data.data.table);
          //console.log(this.skuData)
          if(res.data.data.table.length==0){
            this.proTableShow=false;
          }else {
            this.proTableShow=true;
            this.tableData=res.data.data.table;
          }
        }).catch(re=>{
          console.log(re)
        })
      },
      /*处理字符串数据*/
      getProVslData: function (key, data) {
        var skuValData = [];
        for (let i = 0; i < data.length; i++) {
          //得到一个数据 将字符串转为json
          let objData = JSON.parse(data[i].skuData);
          /*得到库存*/

          if (objData[key] != null) {
            /*判断stocks是否有值*/
            if (data[i].stocks != null) {
              /*判断skuValData数组中是否有这条值*/
              if (skuValData.indexOf(objData[key]) == -1) {
                skuValData.push(objData[key]);
              }
            } else {
              return objData[key];
            }
          }
        }
        return skuValData;
      },
      /*根据下拉框内容改变，查询对应的属性数据*/
      getShopProData2: function (typeId, id) {
        this.cols=[];
        this.tableData = [];
        this.proTableShow = false;
        /*清空sku和不是sku的数据*/
        this.skuData = [];
        this.noSkuData = [];
        this.$ajax.get("http://localhost:8080/api/commodity/selectProValDataByPid?proid=" + id).then(res => {
          let pvData = res.data.data;
          //console.log(pvData);
          this.$ajax.get("http://localhost:8080/api/property/selectProByTypeId?typeId=" + typeId).then(res => {
            //console.log(res.data.data);
            let shopPro = res.data.data;
            //处理skuData  和  noSkuData的数据   回显
            for (let i = 0; i < shopPro.skuData.length; i++) {
              if (shopPro.skuData[i].type == 2) {
                if (this.getProVslData(shopPro.skuData[i].name, pvData) == "") {
                  shopPro.skuData[i].skuCkVal = [];
                } else {
                  shopPro.skuData[i].skuCkVal = this.getProVslData(shopPro.skuData[i].name, pvData);
                }
              } else {
                shopPro.skuData[i].skuCkVal = this.getProVslData(shopPro.skuData[i].name, pvData);
              }
            }
            for (let i = 0; i < shopPro.noSkuData.length; i++) {
              if (shopPro.noSkuData[i].type == 2) {
                if (this.getProVslData(shopPro.noSkuData[i].name, pvData) == "") {
                  shopPro.noSkuData[i].skuCkVal = [];
                } else {
                  shopPro.noSkuData[i].skuCkVal = this.getProVslData(shopPro.noSkuData[i].name, pvData);
                }
              } else {
                shopPro.noSkuData[i].skuCkVal = this.getProVslData(shopPro.noSkuData[i].name, pvData);
              }
            }
            this.skuData = shopPro.skuData;
            this.noSkuData = shopPro.noSkuData;
            for (let i = 0; i <this.skuData.length ; i++) {
              this.cols.push({id: this.skuData[i].id, nameCH: this.skuData[i].nameCH, name: this.skuData[i].name});
            }
          }).catch(re => {
            console.log(re);
          })
        }).catch(re => {
          console.log(re);
        })
      },
      getShopProData: function (typeId) {
        this.tableData = [];
        this.proTableShow = false;
        this.skuData = [];
        this.noSkuData = [];
        this.$ajax.get("http://localhost:8080/api/property/selectProByTypeId?typeId=" + typeId).then(res => {
          //console.log(res.data.data);
          let shopPro = res.data.data;
          //处理skuData  和  noSkuData的数据
          for (let i = 0; i < shopPro.skuData.length; i++) {
            shopPro.skuData[i].skuCkVal = [];
          }
          for (let i = 0; i < shopPro.noSkuData.length; i++) {
            if(shopPro.noSkuData[i].type!=3){
              shopPro.noSkuData[i].skuCkVal=[];
            }else {
              shopPro.noSkuData[i].skuCkVal="";
            }
          }
          this.skuData = shopPro.skuData;
          this.noSkuData = shopPro.noSkuData;
        }).catch(re => {
          console.log(re);
        })
      },

      /*笛卡尔积函数*/
      calcDescartes: function (array) {
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
        this.cols = [];
        this.tableData = [];
        let arr = [];
        var flog = true;
        for (let i = 0; i < this.skuData.length; i++) {
          /*拼接动态表头*/
          this.cols.push({id: this.skuData[i].id, nameCH: this.skuData[i].nameCH, name: this.skuData[i].name});
          /*处理调用笛卡尔积的参数*/
          arr.push(this.skuData[i].skuCkVal);
          if (this.skuData[i].skuCkVal.length == 0) {
            flog = false;
            break;
          }
        }
        if (flog == true) {
          /*笛卡尔积返回的数据*/
          let data = this.calcDescartes(arr);
          /*循环处理动态表格的数据*/
          for (let i = 0; i < data.length; i++) {
            let jsonData = {};
            if (typeof data[i] == "object") {
              for (let j = 0; j < data[i].length; j++) {
                let key = this.cols[j].name;
                jsonData[key] = data[i][j];
              }
            } else {
              let key = this.cols[0].name;
              jsonData[key] = data[i];
            }
            this.tableData.push(jsonData);
          }
        }
        this.proTableShow = flog;
      },
      /*--------------处理分类的下拉框--------------*/
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
      },
      /*-----------查询商品的展示数据------------*/
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
          this.updateCommForm = res.data.data;
          this.imageUrl = this.updateCommForm.imagepath;
        }).catch(re => {
          console.log(re);
        })
      },
      /*提交修改*/
      updateCommlData: function () {
        this.$ajax.post("http://localhost:8080/api/commodity/updateCommodity?" + this.$qs.stringify(this.updateCommForm)).then(res => {
          alert(res.data.message);
          this.updateCommFormFolg = false;
          this.queryCommodtiy();
        }).catch(re => {
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
      toUpdateIsDel: function (row) {
        this.delId = row.id;
        this.toUpdateIsDelFlog = true;
      },
      /*提交修改删除isDel属性的数据  */
      updateIsDel: function () {
        this.$ajax.post("http://localhost:8080/api/commodity/deleteCommodity?id=" + this.delId + "&isDel=" + this.isDel).then(res => {
          alert(res.data.message);
          this.toUpdateIsDelFlog = false;
          this.queryCommodtiy();
        }).catch(re => {
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
      isDelData: function (row, column, value, index) {
        if (value == 0) {
          return "不删";
        } else {
          return "删除";
        }
      },
      typeIdData: function (row, column, value, index) {
        for (let i = 0; i < this.shopTypeData.length; i++) {
          if (value == this.shopTypeData[i].id) {
            return this.shopTypeData[i].name;
          }
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
