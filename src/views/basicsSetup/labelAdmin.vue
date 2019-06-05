<template>
    <div class="app-container">
        <div style="text-algin: center;height: 50px">
            <el-link :underline="false" type="success" style="float: right" @click="addLabel">添加标签</el-link>
        </div>
        <div style="width: 900px;margin: 0 auto;">
            <el-table show-header border :data="tableList">
                <el-table-column
                    v-for="(val, key) in tableListColumn"
                    :key="key"
                    :label="val.label"
                    :prop="val.prop"
                    :width="val.width"
                    align="center"
                    :sortable="val.sortable"
                >
                    <template slot-scope="scope">
                        <div
                            v-if="val.prop === 'message' || val.prop === 'label'"
                            class="table-content"
                            :title="scope.row[val.prop]"
                        >{{scope.row[val.prop]}}</div>
                        <div v-else>{{scope.row[val.prop]}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="deleteList(scope.row)">删除</el-button>
                        <el-button type="primary" @click="updateList(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-page" v-if="list.length > 10" style="margin-top: 10px;float: right">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="list.length"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                ></el-pagination>
            </div>
        </div>
        <el-dialog
            title="添加标签"
            :visible.sync="addlabelDialog"
            width="30%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="resetForm"
        >
            <el-form :model="form" ref="form">
                <el-form-item
                    label="标签名"
                    prop="name"
                    :rules="[
                        {required: true, message: '标签名不能为空', trigger: 'blur'},
                    ]"
                >
                    <el-input style="width: 200px;" v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import request from "@/utils/request";
import { TABLE_LIST_LABEL } from "./common/config";
export default {
    data() {
        return {
            form: {},
            list: [],
            tableListColumn: [...TABLE_LIST_LABEL],
            currentPage: 1,
            pageSize: 5,
            addlabelDialog: false,
            form: {
                name: ""
            },
            modForm: {}
        };
    },
    created() {
        this.getList();
    },
    computed: {
        tableList() {
            return this.list.slice(
                (this.currentPage - 1) * this.pageSize,
                (this.currentPage - 1) * this.pageSize + this.pageSize
            );
        }
    },
    methods: {
        getList() {
            request.post("/label/labelShow").then(res => {
                if (res.errno === 0) {
                    this.list = res.data;
                }
            });
        },
        deleteList(row) {
            request
                .post("/label/labelDel", { id: row.id })
                .then(res => {
                    res.errno === 0 && this.getList();
                    this.$message({
                        type: res.errno === 0 ? "success" : "warning",
                        message: res.errmsg
                    });
                })
                .catch(e => {
                    this.$message({
                        type: "warning",
                        message: "删除失败"
                    });
                });
        },
        addLabel() {
            this.addlabelDialog = true;
        },
        resetForm() {
            this.addlabelDialog = false;
            this.modForm = {};
            this.form = {name: ''};
        },
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.modForm.id) {
                        request
                            .post("/label/labelUp", {id: this.modForm.id, ...this.form})
                            .then(res => {
                                res.errno === 0 && this.getList();
                                this.$message({
                                    type: res.errno === 0 ? "success" : "warning",
                                    message: res.errmsg
                                });
                                this.resetForm();
                            })
                            .catch(res => {
                                this.$message({
                                    type: "warning",
                                    message: "修改失败"
                                });
                            });
                    } else {
                        request
                            .post("/label/labelAdd", this.form)
                            .then(res => {
                                res.errno === 0 && this.getList();
                                this.$message({
                                    type: res.errno === 0 ? "success" : "warning",
                                    message: res.errmsg
                                });
                                this.resetForm();
                            })
                            .catch(res => {
                                this.$message({
                                    type: "warning",
                                    message: "提交失败"
                                });
                            });
                    }
                } else {
                    return false;
                }
            });
        },
        updateList(row) {
            this.form= {name: row.name};
            this.modForm = {...row};
            this.addlabelDialog = true;
        }
    }
};
</script>

<style lang="less" scoped>
</style>
