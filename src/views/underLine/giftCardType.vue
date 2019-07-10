<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button class="btn-add" @click="add" size="mini">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table :data="list" style="width: 100%" v-loading="listLoading" border>
                <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="名称" align="center" prop="type_name"></el-table-column>
                <el-table-column label="删除" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {
    getCurriculumType,
    updateCurriculumType,
    delcurriculumType
} from "@/api/system";
import request from '@/utils/request'
export default {
    name: "productList",
    data() {
        return {
            list: null
        };
    },
    created() {
        this.getList();
    },
    methods: {
        edit(o) {
            this.$prompt("修改文件名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(({ value }) => {
                    this.editFn(o.id, value);
                })
                .catch(() => {});
        },
        editFn(id, name) {
            request.post('/underLine/undertypeadd', { id, type_name: name }).then(res => {
                this.$message({
                    type: "success",
                    message: res.errmsg
                });
                this.getList();
            });
        },
        add() {
            this.$prompt("输入名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(({ value }) => {
                     request.post('/underLine/undertypeadd', {
                        type_name: value 
                     }).then(res => {
                        if (res.errno == 0) {
                            this.$message({
                                type: "success",
                                message: res.errmsg
                            });
                        }
                    });
                    this.getList();
                })
                .catch(() => {});
        },
        del(id) {
            this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    request.post('/underLine/undertypeDel', {
                        id
                    }).then(() => {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.getList();
                    });
                })
                .catch(() => {});
        },
        getList() {
            this.listLoading = true;
            request.post('/underLine/undertype').then(response => {
                this.listLoading = false;
                this.list = response.data;
            });
        }
    }
};
</script>
<style></style>
