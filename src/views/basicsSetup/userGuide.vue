<template>
    <div class="app-container">
        <el-form ref="form" label-width="120px">
            <el-form-item
                v-for="(val, key) in form"
                :key="key"
                :label="`${val.name}:`"
            >
                <div style="width: 500px;display: inline-block" v-html="val.text"></div>
                <el-button
                    type="danger"
                    @click="updataSet(val)"
                    style="margin-left: 10px;"
                >修改</el-button>
                <el-button
                    type="danger"
                    @click="deleteList(val.id, val.status)"
                    style="margin-left: 10px;"
                >删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addList">添加一条</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            width="50%"
            :title="modId ? '修改' : '添加'"
            :visible.sync="showDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @before-close="closeDialog"
        >
            <el-form ref="addForm" label-width="120px" :model="addForm" label-position="left">
                <el-form-item
                    label="标题"
                    prop="title"
                    :rules="[
                        {required: true, message: '标题不能为空', trigger: 'blur'}
                    ]"
                >
                    <el-input v-model="addForm.title"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <tinymce :width="555" :height="300" id="11-text" v-model="text"></tinymce>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="submitAddForm">添加</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import request from "@/utils/request";
import Tinymce from "@/components/Tinymce";
import { Basic,setBasic } from "@/api/system";

export default {
    components: { tinymce: Tinymce },
    data() {
        return {
            form: [],
            showDialog: false,
            addForm: {
                title: ""
            },
            text: "",
            modId: undefined,
            modStatus: undefined

        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            Basic().then(res => {
                if (res.errno === 0) {
                    const data = res.data.length
                        ? res.data.filter(item => item.status == 3)
                        : [] 
                    this.form = data;
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const param = [];
                    for (let key in this.form) {
                        param.push({
                            id: +key.split("-")[1],
                            price: this.form[key]
                        });
                    }
                    request
                        .post("/account/accountup", { data: param })
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
                                message: "修改失败!"
                            });
                        });
                } else {
                    return false;
                }
            });
        },
        addList() {
            this.addForm = {
                title: ""
            };
            this.modId = undefined,
            this.modStatus = undefined
            this.showDialog = true;
            this.text = "";
            this.$nextTick(() => {
                window.tinymce.get("11-text").setContent("");
            });
        },
        updataSet ({id, status, text, name}) {
            this.modId = id;
            this.modStatus = status;
            this.showDialog = true;
            this.text = text;
            this.addForm = {title: name};
            this.$nextTick(() => {
                window.tinymce.get("11-text").setContent(this.text);
            });
        },
        submitAddForm() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    if (this.text) {
                        request
                            .post("/system/setBasic", {
                                name: this.addForm.title,
                                text: this.text,
                                id: this.modId,
                                status: this.status
                            })
                            .then(res => {
                                res.errno === 0 && this.getList();
                                this.closeDialog();
                                this.$message({
                                    type:
                                        res.errno === 0 ? "success" : "warning",
                                    message: res.errmsg
                                });
                            })
                            .catch(e => {
                                this.$message({
                                    type: "warning",
                                    message: "添加失败!"
                                });
                            });
                    } else {
                        this.$message({
                            type: "warning",
                            message: "请填写内容!"
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        closeDialog() {
            this.showDialog = false;
            this.$refs.addForm.resetFields();
        },
        deleteList(id) {
            request
                .post("system/delBasic", { id })
                .then(res => {
                    res.errno === 0 && this.getList();
                    this.$message({
                        type: res.errno === 0 ? "success" : "warning",
                        message: res.errno === 0? '删除成功' : '删除失败'
                    });
                })
                .catch(e => {
                    this.$message({
                        type: "warning",
                        message: "删除失败"
                    });
                });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
