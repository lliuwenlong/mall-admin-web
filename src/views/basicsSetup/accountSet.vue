<template>
    <div class="app-container">
        <el-form ref="form" label-width="120px" :model="form">
            <el-form-item
                v-for="(val, key) in form"
                :prop="key"
                :key="key"
                :label="`${key.split('-')[0]}`"
                :rules="[
                    { required: true, message: '价格不能为空', trigger: 'blur' },
                    { type: 'number', message: '价格必须为数字值', trigger: 'blur' }
                ]"
            >
                <el-input v-model.number="form[key]" style="width: 200px"></el-input>
                <el-button type="danger" @click="deleteList(key.split('-')[1])" style="margin-left: 10px;">删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">提交</el-button>
                <el-button type="primary" @click="addList">添加一条</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            width="30%"
            title="添加"
            :visible.sync="showDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @before-close="closeDialog"
        >
            <el-form ref="addForm" label-width="120px" :model="addForm" label-position="left">
                <el-form-item
                    label="慧币数量"
                    prop="number"
                    :rules="[
                        {required: true, message: '慧币数量不能为空', trigger: 'blur'}
                    ]"
                >
                    <el-input v-model="addForm.number"></el-input>
                </el-form-item>
                <el-form-item
                    label="价格"
                    prop="price"
                    :rules="[
                        {required: true, message: '价格不能为空', trigger: 'blur'}
                    ]"
                >
                    <el-input v-model="addForm.price"></el-input>
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

export default {
    data() {
        return {
            form: {},
            showDialog: false,
            addForm: {
                number: "",
                price: ""
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            request.post("/account/accountshow").then(res => {
                if (res.errno === 0) {
                    const form = {};
                    for (let key in res.data) {
                        form[
                            `${res.data[key].wisdomCurrency}-${
                                res.data[key].id
                            }`
                        ] = +res.data[key].price;
                    }
                    this.form = { ...form };
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
            this.showDialog = true;
        },
        submitAddForm() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                   request.post('/account/accountAdd', {
                       wisdom_currency: this.addForm.number,
                       price: this.addForm.price
                   }).then(res => {
                        res.errno === 0 && this.getList();
                        this.closeDialog();
                        this.$message({
                            type: res.errno === 0 ? "success" : "warning",
                            message: res.errmsg
                        });
                   }).catch(e => {
                        this.$message({
                            type: "warning",
                            message: "添加失败!"
                        });
                    });;
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
            request.post('/account/accountDel', {id}).then(res => {
                res.errno === 0 && this.getList();
                this.$message({
                    type: res.errno === 0 ? "success" : "warning",
                    message: res.errmsg
                });
            }).catch(e => {
                this.$message({
                    type: "warning",
                    message: '删除失败'
                });
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
