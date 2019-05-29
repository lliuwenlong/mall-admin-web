<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>查询列表</span>
            <el-button class="btn-add" @click="add" size="mini">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table :data="list" style="width: 100%" v-loading="listLoading" border loading="listLoading">
                <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="设置项" align="center" prop="name"></el-table-column>
                <el-table-column label="值" align="center" prop="text">
                      <template slot-scope="scope">
                          <span v-html="scope.row.text"></span>
                      </template>
                </el-table-column>

                <el-table-column label="删除" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
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
import { Basic,setBasic } from "@/api/system";
import Tinymce from "@/components/Tinymce";

export default {
    name: "productList",
    components: { tinymce: Tinymce },
    data() {
        return {
            list: null,
            dialogVisible: false,
            editData: {},
            listLoading:true
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
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputPattern: /^1[34578]\d{9}$/,
                    inputErrorMessage: "格式不正确"
                })
                    .then(({ value }) => {
                        this.editData.text=value;
                        this.editFn()
                    })
                    .catch(() => {
                        return
                    });
            } else {
                this.dialogVisible = true;
            }
        },
        editFn() {
            setBasic(this.editData).then(res => {
                this.$message({
                    type: "success",
                    message: res.errmsg
                });
                this.getList();
            });
        },
        getList() {
            this.listLoading = true;
            Basic().then(response => {
                this.listLoading = false;
                this.list = response.data;
            });
        },
        
        add() {
            this.$prompt("输入文件名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(({ value }) => {
                    updateCurriculumType({ name: value }).then(res => {
                        this.$message({
                            type: "success",
                            message: res.errmsg
                        });
                    });
                    this.getList();
                })
                .catch(() => {});
        }
    }
};
</script>
<style></style>


