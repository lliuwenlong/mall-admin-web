<template>
    <el-card class="form-container" shadow="never" style="width:855px;">
        <el-form
            :model="productAttr"
            ref="productAttrFrom"
            label-width="150px"
            label-position="left"
        >
            <el-form-item
                label="课程名称"
                prop="name"
                :rules="[
                    { required: true, message: '请输入课程名称', trigger: 'blur' },
                ]"
            >
                <el-input v-model="productAttr.name"></el-input>
            </el-form-item>
            <el-form-item
                label="课程副标题"
                prop="name"
                :rules="[
                    { required: true, message: '请输入课程副标题', trigger: 'blur' },
                ]"
            >
                <el-input v-model="productAttr.subTitle"></el-input>
            </el-form-item>
            <el-form-item label="详情介绍" prop="content">
                <tinymce :width="595" :height="300" v-model="productAttr.content"></tinymce>
            </el-form-item>
            <el-form-item label="上传课程">
                <el-button size="medium" @click="addClass">添加课程</el-button>
                <div style="margin-top: 20px">
                    <el-form-item
                        v-for="(val, key) in productAttr.classHour"
                        :key="key"
                        class="class-list"
                        :prop="`classHour.${key}.title`"
                        :rules="[{
                            required: true, message: '课时名称不能为空', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="请输入课时名称" v-model="val.title"></el-input>
                        <el-upload
                            style="display: inline-block"
                            action="/api/common/uploadFile"
                            :show-file-list="false"
                            :on-success="uploadAudioSuccess(key)"
                        >
                            <el-button
                                size="medium"
                                class="medium-btn"
                                type="primary"
                                style="margin-left: 10px"
                            >上传音频</el-button>
                        </el-upload>
                        <el-button size="medium" class="medium-btn" type="primary">上传视屏</el-button>
                        <el-button
                            size="medium"
                            class="medium-btn"
                            type="danger"
                            @click="deleteClass(key)"
                        >删除</el-button>
                    </el-form-item>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import Tinymce from "@/components/Tinymce";
export default {
    components: { tinymce: Tinymce },
    data() {
        return {
            productAttr: {
                name: "",
                subTitle: "",
                content: "",
                classHour: []
            }
        };
    },
    created() {},
    watch: {},
    methods: {
        addClass() {
            const productAttr = { ...this.productAttr };
            const classHour = [...productAttr.classHour];
            classHour.push({
                title: '',
                video: '',
                audio: ''
            });
            productAttr.classHour = [...classHour];
            this.productAttr = { ...productAttr };
        },
        submitForm() {},
        resetForm() {},
        deleteClass(key) {
            const productAttr = { ...this.productAttr };
            const classHour = [...productAttr.classHour];
            classHour.splice(key, 1);
            productAttr.classHour = [...classHour];
            this.productAttr = { ...productAttr };
        },
        uploadAudioSuccess(file, key) {
            console.log(key);
        }
    }
};
</script>

<style scoped lang="less">
.input-mini {
    width: 150px;
}
.class-list {
    margin-bottom: 20px;
}
</style>
