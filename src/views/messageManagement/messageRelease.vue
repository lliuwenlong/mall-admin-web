<template>
    <div class="app-container">
        <el-form
            :model="form"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-dynamic"
        >
            <el-form-item label="标题" prop="title">
                <el-input style="width: 200px" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input
                    style="width: 200px"
                    type="textarea"
                    v-model="form.content"
                    :autosize="{ minRows: 2, maxRows: 4}"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                title: "",
                content: ""
            },
            rules: {
                title: {
                    required: true,
                    message: "标题不可为空",
                    trigger: "blur"
                },
                content: {
                    required: true,
                    message: "内容不可为空",
                    trigger: "blur"
                }
            },
            socket: ""
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$socket.emit('message', {
                        label: this.form.title,
                        message: this.form.content
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    sockets: {
        error (data) {
            this.$message({
                type: 'error',
                message: '消息发布失败'
            });
        },
        success (data) {
            this.$message({
                type: 'success',
                message: '消息发布成功'
            });
            this.$refs.ruleForm.resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
</style>
