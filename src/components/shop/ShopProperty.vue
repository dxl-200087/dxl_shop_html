<template>
  <div>

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
        label="表单类型">
      </el-table-column>
      <el-table-column
        prop="isSKU"
        label="是否为SKU">
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
          <el-button type="primary" size="mini">修改</el-button>
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
        count:0
      }
    },created:function () {
        this.queryPropertyTable();
    },methods:{
      queryPropertyTable:function(){
        this.$ajax.get("http://localhost:8080/api/property/selectProperty?page="+this.page+"&limit="+this.limit).then(res=>{
          //console.log(res.data.data.data);
          this.PropertyTable=res.data.data.data;
          this.count=res.data.data.count;
        }).catch(re=>{
          console.log(re)
        })
      },
      isdelData:function (row,column,value,index) {
        if(value==0){
          return "否";
        }else {
          return "是";
        }
      },handleSizeChange(val) {
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
