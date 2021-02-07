<template>
  <div>
    <h1>权限数据管理</h1>
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
            @click="saveRole(data)"
            icon="el-icon-plus">
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="updateRole(node,data)"
            icon="el-icon-edit">
            修改
          </el-button>
        </span>
      </span>
    </el-tree>

    <!--新增模板-->
    <el-dialog title="新增节点" :visible.sync="saveRoleForm">
      <el-form ref="form" :model="addForm" label-width="80px" style="width: 500px;">
        <el-form-item label="节点名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="节点路径">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-radio-group v-model="addForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveRoleForm=false">取 消</el-button>
        <el-button type="primary" @click="addRoleFrom">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改模板-->
    <el-dialog title="新增节点" :visible.sync="updateRoleForm">
      <el-form ref="form" :model="updateForm" label-width="80px" style="width: 500px;">
        <el-form-item label="节点名称">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="节点路径">
          <el-input v-model="updateForm.url"></el-input>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-radio-group v-model="updateForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-radio-group v-model="updateForm.isDel">
            <el-radio :label="0">不删</el-radio>
            <el-radio :label="1">删除</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateRoleForm=false">取 消</el-button>
        <el-button type="primary" @click="updateRoleData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Role",
    data() {
      return {
        /*树结构数据*/
        data: [],
        /*查询出来的权限数据*/
        roleDate: [],
        roleDataStr: '',
        defaultProps: {},
        /*新增数据模板*/
        saveRoleForm: false,
        addForm: {
          pid: "",
          name: "",
          url: "",
          type: "",
          isDel: 0
        },
        /*修改的数据*/
        updateRoleForm: false,
        updateForm: {
          id: "",
          pid: "",
          name: "",
          url: "",
          type: "",
          isDel: ""
        }
      }
    }, created: function () {
      this.queryRoleData();
    }, methods: {
      /*新增权限数据*/
      saveRole: function (data) {
        this.addForm = {
          pid: "",
          name: "",
          url: "",
          type: "",
          isDel: 0
        };
        //alert(data.id);
        this.saveRoleForm = true;
        this.addForm.pid = data.id;
      },
      addRoleFrom: function () {
        this.$ajax.post("http://localhost:8080/api/role/saveRoleData?" + this.$qs.stringify(this.addForm)).then(res => {
          //console.log(res.data.data);
          alert(res.data.message);
          this.saveRoleForm = false;
          location.reload();
        }).catch(re => {
          console.log(re);
        })
      },
      /*修改权限数据弹框回显*/
      updateRole: function (node, data) {
        //alert(data.id);
        this.updateRoleForm = true;
        /*查询回显数据*/
        this.$ajax.get("http://localhost:8080/api/role/selectRoleById?id=" + data.id).then(res => {
          this.updateForm = res.data.data;
        }).catch(re => {
          console.log(re);
        })
      },
      //修改提交
      updateRoleData: function () {
        //console.log(this.updateForm);
        this.$ajax.post("http://localhost:8080/api/role/updateRole?"+this.$qs.stringify(this.updateForm)).then(res => {
          alert(res.data.message);
          this.updateRoleForm = false;
          location.reload();
        }).catch(re => {
          console.log(re);
        })
      },
      //查询所有的权限数据
      queryRoleData: function () {
        //alert("aaa");
        this.$ajax.get("http://localhost:8080/api/role/selectRoleDate?").then(res => {
          //console.log(res.data.data);
          this.roleDate = res.data.data;
          this.queryTop();
        }).catch(re => {
          console.log(re);
        })
      },
      //查询顶层的权限数据
      queryTop: function () {
        for (let i = 0; i < this.roleDate.length; i++) {
          if (this.roleDate[i].pid == 0) {
            this.queryRoleDateStr(this.roleDate[i]);
            break;
          }
        }
        this.data.push(JSON.parse(this.roleDataStr));
      },
      //拼接树结构数据
      queryRoleDateStr: function (data) {
        if (data.type == 0) {
          this.roleDataStr += '{"id":' + data.id + ',"label":"' + data.name + '","children":[';
          let count = 0;
          for (let i = 0; i < this.roleDate.length; i++) {
            if (this.roleDate[i].pid == data.id) {
              count++;
              this.queryRoleDateStr(this.roleDate[i]);
              this.roleDataStr += ",";
            }
          }
          if (count != 0) {
            this.roleDataStr = this.roleDataStr.substr(0, this.roleDataStr.length - 1);
          }
          this.roleDataStr += ']}';
        } else {
          this.roleDataStr += '{"id":' + data.id + ',"label":"' + data.name + '"}';
        }
      }
    }
  }
</script>

<style scoped>

</style>
