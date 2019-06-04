<template>
    <el-card class="form-container" shadow="never" style="width:855px;">
        <el-form :model="productAttr" :rules="rules" ref="productAttrFrom" label-width="150px">
            <el-form-item label="礼品卡名字：" prop="name">
                <el-input v-model="productAttr.name"></el-input>
            </el-form-item>
            <el-form-item label="购买须知：" prop="purchase_instructions">
                <tinymce :width="595" :height="300" v-model="productAttr.purchase_instructions"></tinymce>
            </el-form-item>
            <el-form-item label="流程：" prop="process">
                <el-input v-model="productAttr.process"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="content">
                <tinymce :width="595" :height="300" v-model="productAttr.content"></tinymce>
            </el-form-item>
            <el-form-item label="封面：" prop="coverPhoto">
                <el-upload
                    class="avatar-uploader"
                    action="/api/common/uploadFile"
                    :show-file-list="false"
                    :on-success="res=>{ productAttr.coverPhoto=res.data.path }"
                >
                    <img
                        v-if="productAttr.coverPhoto"
                        :src="imgPath+productAttr.coverPhoto"
                        class="avatar"
                    >
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
                <el-button v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { addGiftCard } from "@/api/gitCard";
import Tinymce from "@/components/Tinymce";
import {PUBLIC_PATH} from '@/config/config'
const defaultProductAttr = {
    name: "",
    purchaseInstructions: "",
    process: "",
    coverPhoto: "",
    isMod: false,
    content: ""
};
export default {
    components: { tinymce: Tinymce },
    name: "ProductAttrDetail",
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imgPath: PUBLIC_PATH,
            productAttr: Object.assign({}, defaultProductAttr),
            dialogImageUrl: "",
            dialogVisible: false,
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入礼品卡名称",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 140,
                        message: "长度在 2 到 140 个字符",
                        trigger: "blur"
                    }
                ]
            },
            productAttrCateList: null,
            inputListFormat: null
        };
    },
    created() {
        // if (this.isEdit) {
        //   getProductAttr(this.$route.query.id).then(response => {
        //     this.productAttr = response.data;
        //     this.inputListFormat = this.productAttr.inputList.replace(/,/g, "\n");
        //   });
        // } else {
        this.resetProductAttr();
        if (this.$route.query.data && this.$route.query.data.name)
            this.productAttr = this.$route.query.data;
        // }
        // this.getCateList();
    },
    watch: {
        inputListFormat: function(newValue, oldValue) {
            newValue = newValue.replace(/\n/g, ",");
            this.productAttr.inputList = newValue;
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        onSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm("是否提交数据", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        if (this.isEdit) {
                            addGiftCard(this.productAttr).then(response => {
                                this.$message({
                                    message: "修改成功",
                                    type: "success",
                                    duration: 1000
                                });
                                this.$router.push({ path: "giftCardList" });
                            });
                        } else {
                            addGiftCard(this.productAttr).then(response => {
                                this.$message({
                                    message: "提交成功",
                                    type: "success",
                                    duration: 1000
                                });
                                this.resetForm("productAttrFrom");
                                this.$router.push({ path: "giftCardList" });
                            });
                        }
                    });
                } else {
                    this.$message({
                        message: "验证失败",
                        type: "error",
                        duration: 1000
                    });
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.resetProductAttr();
        },
        resetProductAttr() {
            this.productAttr = Object.assign({}, defaultProductAttr);
            this.productAttr.productAttributeCategoryId = Number(
                this.$route.query.cid
            );
            this.productAttr.type = Number(this.$route.query.type);
        }
    }
};
</script>

<style scoped>
</style>
