<template>
    <div class="app-container">
        <el-form ref="form" label-width="120px" :model="form">
            <el-form-item
                v-for="(val, key) in form"
                :prop="key"
                :key="key"
                :label="`${key.split('-')[0]}个月vip价格`"
                :rules="[
                    { required: true, message: '价格不能为空', trigger: 'blur' },
                    { type: 'number', message: '价格必须为数字值', trigger: 'blur' }
                ]"
            >
                <el-input v-model.number="form[key]" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import request from "@/utils/request";

export default {
    data() {
        return {
            form: {}
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            request.post("/vipAdmin/getVipPrice").then(res => {
                if (res.errno === 0) {
                    const form = {};
                    for (let key in res.data) {
                        form[`${res.data[key].num}-${res.data[key].id}`] = +res.data[key].price;
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
                            id: +key.split('-')[1],
                            price: this.form[key]
                        });
                    }
                    request.post('/vipAdmin/setVipPrice', {data: param}).then(res => {
                        res.errno === 0 && this.getList();
                        this.$message({
                            type: res.errno === 0 ? "success" : "warning",
                            message: res.errmsg
                        });
                    }).catch(e => {
                        this.$message({
                            type: "warning",
                            message: "修改失败!"
                        });
                    });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
