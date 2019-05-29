<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>礼品展示</span>
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
        <el-table-column label="礼品卡名字" align="center" prop="name"></el-table-column>
        <el-table-column label="流程" align="center" prop="process"></el-table-column>
        <el-table-column label="简介" align="center" prop="content">
          <template slot-scope="scope">
            <span v-html="scope.row.content"></span>
          </template>
        </el-table-column>
        <el-table-column label="封面图片" align="center" prop="coverPhoto">
          <template slot-scope="scope">
            <img :src="imgPath()+scope.row.coverPhoto" alt>
          </template>
        </el-table-column>

        <el-table-column label="是否修改" width="240" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="xiugai(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="645px">
      <tinymce :width="595" :height="300" v-model="editData.text" name></tinymce>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getGiftCardList, delGiftCard } from "@/api/gitCard";
import { imgPath } from "@/utils/imgPath"
export default {
  name: "productList",
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
          confirmButtonText: "确定"
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
      addGiftCard(this.editData).then(res => {
        this.$message({
          type: "success",
          message: res.errmsg
        });
        this.getList();
      });
    },
    getList() {
      this.listLoading = true;
      getGiftCardList().then(response => {
        this.listLoading = false;
        this.list = response.data;
      });
    },
    handleAddProduct() {
      this.$router.push({ path: "giftCardAdd" });
    },
    xiugai(o) {
      this.$router.push({ path: "giftCardAdd" ,query:{ data:o}});
    },
    del(id) {
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delGiftCard(id).then(() => {
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


