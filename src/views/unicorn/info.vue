<template>
    <el-card class="form-container" shadow="never" style="width:855px;">
        <el-form :model="productAttr" :rules="rules" ref="productAttrFrom" label-width="150px">
            <el-form-item label="项目名称" prop="title">
                <el-input v-model="productAttr.title"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="subtitle">
                <el-input v-model="productAttr.subtitle"></el-input>
            </el-form-item>
            <el-form-item label="项目类别" prop="type">
                <el-input v-model="productAttr.type"></el-input>
            </el-form-item>
            <el-form-item label="项目时间" prop="time">
                <el-input v-model="productAttr.time"></el-input>
            </el-form-item>
            <el-form-item label="开播时间" prop="starttime">
                <el-input v-model="productAttr.starttime"></el-input>
            </el-form-item>
            <el-form-item label="地点" prop="place">
                <el-input v-model="productAttr.place"></el-input>
            </el-form-item>
            <el-form-item label="基本信息" prop="basic">
                <tinymce :width="595" :height="300" :rows="4" v-model="productAttr.basic"></tinymce>
            </el-form-item>
            <el-form-item label="详细信息" prop="basic">
                <tinymce :width="595" :height="300" v-model="productAttr.details"></tinymce>
            </el-form-item>
            <el-form-item label="选择标签" prop="unicorn_tags"></el-form-item>
            <el-form-item label="可抢占城市" prop="contactsTel">
                <tree-transfer></tree-transfer>
            </el-form-item>
            <el-form-item label="项目信息" prop="unicorn_info"></el-form-item>
            <el-form-item label="成员" prop="unicorn_member">
                
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
                <el-button v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { addOrUpdate } from "@/api/underLine";
import Tinymce from "@/components/Tinymce";
import { imgPath } from "@/utils/imgPath";
import treeTransfer from "@/components/TreeTransfer";
const defaultProductAttr = {
    name: "",
    purchaseInstructions: "",
    process: "",
    coverPhoto: "",
    isMod: false,
    content: "",
    timeSlot: []
};
export default {
    components: { tinymce: Tinymce, treeTransfer },
    name: "ProductAttrDetail",
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imgPath,
            productAttr: Object.assign({}, defaultProductAttr),
            dialogImageUrl: "",
            dialogVisible: false,
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入线下活动名称",
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
        };
    },
    created() {
        this.resetProductAttr();
        if (this.$route.query.data && this.$route.query.data.name)
            this.productAttr = this.$route.query.data;
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
                            addOrUpdate(this.productAttr).then(response => {
                                this.$message({
                                    message: "修改成功",
                                    type: "success",
                                    duration: 1000
                                });
                                this.$router.push({ path: "giftCardList" });
                            });
                        } else {
                            addOrUpdate(this.productAttr).then(response => {
                                this.$message({
                                    message: "提交成功",
                                    type: "success",
                                    duration: 1000
                                });
                                this.resetForm("productAttrFrom");
                                this.$router.push({ path: "giftCardshow" });
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
            // this.productAttr = Object.assign({}, defaultProductAttr);
            // this.productAttr.productAttributeCategoryId = Number(
            //     this.$route.query.cid
            // );
            // this.productAttr.type = Number(this.$route.query.type);
        }
    }
};
</script>

<style scoped>
</style>
