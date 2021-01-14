<template>
  <div>
    <h1>商品分类管理</h1>
    <el-tree
      :data="data"
      :props="defaultProps"
      accordion
      node-key="id"
      :default-expanded-keys="[1]"
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="saveType(data)"
            icon="el-icon-plus">
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="updateType(node,data)"
            icon="el-icon-edit">
            修改
          </el-button>
        </span>
      </span>
    </el-tree>

    <!--新增模板-->
    <el-dialog title="新增节点" :visible.sync="saveTypeForm">
      <el-form ref="form" :model="addForm" label-width="80px" style="width: 500px;">
        <el-form-item label="父节点ID">
          <el-input v-model="addForm.pid" disabled></el-input>
        </el-form-item>
        <el-form-item label="节点名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveTypeForm=false">取 消</el-button>
        <el-button type="primary" @click="addTypeFrom">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改模板-->
    <el-dialog title="修改节点" :visible.sync="updateTypeForm">
      <el-form ref="form" :model="updateForm" label-width="80px" style="width: 500px;">
        <el-form-item label="节点ID">
          <el-input v-model="updateForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="父节点ID">
          <el-input v-model="updateForm.pid" disabled></el-input>
        </el-form-item>
        <el-form-item label="节点名称">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否删除">
          <el-radio-group v-model="updateForm.isDel">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateTypeForm=false">取 消</el-button>
        <el-button type="primary" @click="updateSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Type",
    data() {
      return {
        data: [],
        typeDate: [],
        dataStr: '',
        defaultProps: {},
        saveTypeForm:false,
        updateTypeForm:false,
        addForm:{
          name:"",
          pid:""
        },
        updateForm:{
          id:"",
          pid:"",
          name:"",
          isDel:""
        }
      }
    }, created: function () {
      this.quesyData();
    }, methods: {
      /*新增弹框*/
      saveType:function(data){
        //console.log(data);
        this.saveTypeForm=true;
        this.addForm.pid=data.id;
      }, addTypeFrom:function(){
        this.$ajax.post("http://localhost:8080/api/type/saveType?"+this.$qs.stringify(this.addForm)).then(res=>{
          //console.log(res.data);
          alert(res.data.message);
          this.quesyData();
          this.saveTypeForm=false;
        }).catch(re => {
          console.log(re);
        })
      },
      /*修改弹框*/
      updateType:function(node,data){
        //console.log(node);
        //console.log(data);
        this.$ajax.get("http://localhost:8080/api/type/selectTypeByid?id="+data.id).then(res=>{
          this.updateTypeForm=true;
          this.updateForm=res.data.data;
        }).catch(re => {
          console.log(re);
        })
      },
      updateSubmit:function(){
        this.$ajax.post("http://localhost:8080/api/type/updateType?"+this.$qs.stringify(this.updateForm)).then(res=>{
          alert(res.data.message);
          this.updateTypeForm=false;
          this.quesyData();
        }).catch(re=>{
          console.log(re);
        })
      },
      /*查询所有的数据*/
      quesyData:function(){
        this.$ajax.get("http://localhost:8080/api/type/selectType").then(res => {
          //console.log(res.data.data);
          this.typeDate = res.data.data;
          this.chuLiData();
        }).catch(re => {
          console.log(re);
        })
      },
      /*处理树结构数据*/
      chuLiData: function () {
        for (let i = 0; i < this.typeDate.length; i++) {
          if (this.typeDate[i].pid == 0) {
            this.panDuanData(this.typeDate[i]);
            break;
          }
        }
        this.data.push(JSON.parse(this.dataStr));
        //console.log(this.dataStr);
      },
      panDuanData: function (node) {
        var flog = this.isParent(node);
        if (flog == true) {
          this.dataStr += '{"id":' + node.id + ',"label":"' + node.name + '","children":[';
          let count = 0;
          for (let i = 0; i < this.typeDate.length; i++) {
            if (this.typeDate[i].pid == node.id) {
              count++;
              this.panDuanData(this.typeDate[i]);
              this.dataStr += ",";
            }
          }
          if (count != 0) {
            this.dataStr = this.dataStr.substr(0, this.dataStr.length - 1);
          }
          this.dataStr += ']}';
        } else {
          this.dataStr += '{"id":' + node.id + ',"label":"' + node.name + '"}';
        }
        //console.log(this.dataStr);
      },
      isParent: function (node) {
        for (let i = 0; i < this.typeDate.length; i++) {
          if (node.id == this.typeDate[i].pid) {
            return true;
          }
        }
        return false;
      }
    }
  }
</script>

<style scoped>

</style>
