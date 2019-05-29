<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>查询列表</span>
      <el-button class="btn-add" @click="handleAddProduct()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
        loading="listLoading"
      >
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="活动名称" align="center" prop="name"></el-table-column>
        <el-table-column label="地址" align="center" prop="place"></el-table-column>
        <el-table-column label="时间段" align="center" prop="timeSlot">
          <template slot-scope="scope">
            {{scope.row.timeSlot.join(" ~ ")}}
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center" prop="contactsImg">
          <template slot-scope="scope">
          <img :src="imgPath()+scope.row.contactsImg" alt="" style="width:100%"/>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="contactsName"></el-table-column>
        <el-table-column label="电话" align="center" prop="contactsTel"></el-table-column>

        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="xiugai(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="delect(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="645px">
      <tinymce :width="595" :height="300" v-model="editData.text"></tinymce>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getList, del ,addOrUpdate} from "@/api/underLine";
import Tinymce from "@/components/Tinymce";
import { imgPath } from "@/utils/imgPath"
export default {
  name: "productList",
  components: { tinymce: Tinymce },
  data() {
    return {
      imgPath,
      list: null,
      dialogVisible: false,
      editData: {},
      listLoading: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    
    xiugai(o) {
      this.$router.push({ path: "underLineAdd" ,query:{ data:o}});
    },
    handleAddProduct() {
      this.$router.push({ path: "underLineAdd" });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    edit(o) {
      this.editData = o;
      if (o.status == 1) {
        this.$prompt("请输入手机号码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^1[34578]\d{9}$/,
          inputErrorMessage: "格式不正确"
        })
          .then(({ value }) => {
            this.editData.text = value;
            this.editFn();
          })
          .catch(() => {
            return;
          });
      } else {
        this.dialogVisible = true;
      }
    },
    editFn() {
      addOrUpdate(this.editData).then(res => {
        this.$message({
          type: "success",
          message: res.errmsg
        });
        this.getList();
      });
    },
    getList() {
      this.listLoading = true;
      getList().then(response => {
        this.listLoading = false;
        this.list = response.data;
      });
    },
    delect(id) {
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          del(id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style></style>


