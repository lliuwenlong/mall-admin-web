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
                <el-table-column label="名称" align="center" prop="name"></el-table-column>
                <el-table-column label="排序" width="120" align="center">
                    <template slot-scope="scope">
                        <el-input-number
                            @change="editFn(scope.row.id,scope.row.name,scope.row.sort)"
                            type="number"
                            v-model="scope.row.sort"
                            style="width:90px;"
                            size="mini"
                        />
                    </template>
                </el-table-column>
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
        editFn(id, name, sort = null) {
            updateCurriculumType({ id, name, sort }).then(res => {
                this.$message({
                    type: "success",
                    message: res.errmsg
                });
                this.getList();
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
        },
        del(id) {
            this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    delcurriculumType(id).then(() => {
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
            getCurriculumType().then(response => {
                this.listLoading = false;
                this.list = response.data;
            });
        }
    }
};
</script>
<style></style>


