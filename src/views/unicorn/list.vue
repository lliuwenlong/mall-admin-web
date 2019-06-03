<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button style="float:right" type="primary" @click="getList()" size="small">查询搜索</el-button>
                <el-button
                    style="float:right;margin-right: 15px"
                    @click="vip='';getList()"
                    size="small"
                >重置</el-button>
                <div style="margin-top: 15px">
                    <el-form :inline="true" size="small" label-width="140px">
                        <el-form-item label="选择分类：">
                            <el-select v-model="vip">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="margin:0 auto;"></div>
            </div>
        </el-card>

        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>项目列表</span>
        </el-card>
        <div class="table-container">
            <el-table
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border
                loading="listLoading"
            >
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="标题" align="center" prop="title"></el-table-column>
                <el-table-column label="简介" align="center" prop="basic"></el-table-column>
                <el-table-column label="时间" align="center" prop="time"></el-table-column>
                <el-table-column label="地点" align="center" prop="place"></el-table-column>
                <el-table-column label="开播时间" align="center" prop="starttime"></el-table-column>
                <el-table-column label="操作" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="xiugai(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getList, del } from "@/api/unicorn";
import Tinymce from "@/components/Tinymce";
import { imgPath } from "@/utils/imgPath";
export default {
    name: "productList",
    components: { tinymce: Tinymce },
    data() {
        return {
            imgPath,
            list: null,
            dialogVisible: false,
            editData: {},
            listLoading: true,
            vip: ""
        };
    },
    created() {
        this.getList();
    },
    methods: {
        xiugai(o) {
            this.$router.push({ path: "underLineAdd", query: { data: o } });
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

        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        del(id) {
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


