<template>
    <el-card class="form-container" shadow="never" style="width:855px;">
        <el-form :model="productAttr" :rules="rules" ref="productAttrFrom" label-width="150px">
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="productAttr.name"></el-input>
            </el-form-item>
            <el-form-item label="票数" prop="num">
                <el-input v-model="productAttr.num"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="cityId">
                <el-select v-model="productAttr.type_id">
                    <el-option
                        v-for="(item, key) in typeList"
                        :key="key"
                        :label="item.type_name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="cityId">
                <el-select v-model="productAttr.cityId">
                    <el-option
                        v-for="(item, key) in cityList"
                        :key="key"
                        :label="item.cityname"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="详细地址" prop="place">
                <el-input v-model="productAttr.place"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <tinymce :width="595" :height="300" v-model="productAttr.content"></tinymce>
            </el-form-item>
            <el-form-item label="价格" width="120" align="center">
                <el-input v-model="productAttr.startPrice"></el-input>
            </el-form-item>
            <el-form-item label="时间段" width="120">
                <el-date-picker
                    v-model="productAttr.timeSlot"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="联系人头像：" prop="contactsImg">
                <el-upload
                    class="avatar-uploader"
                    action="/api/common/uploadFile"
                    :show-file-list="false"
                    :on-success="res=>{ productAttr.contactsImg=res.data.path }"
                >
                    <img v-if="productAttr.contactsImg" :src="imgPath()+productAttr.contactsImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="联系人姓名" prop="contactsName">
                <el-input v-model="productAttr.contactsName"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话" prop="contactsTel">
                <el-input v-model="productAttr.contactsTel"></el-input>
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
import request from '@/utils/request';
import moment from 'moment';
const defaultProductAttr = {
    name: "",
    purchaseInstructions: "",
    process: "",
    coverPhoto: "",
    isMod: false,
    content: "",
    timeSlot: [],
    cityId: '',
    type_id: '',
    num: ''
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
            imgPath,
            productAttr: {...Object.assign({}, defaultProductAttr)},
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
            inputListFormat: null,
            cityList: [],
            typeList: []
        };
    },
    created() {
        this.resetProductAttr();
        this.getCity();
        request.post('/underLine/undertype').then(response => {
            this.typeList = response.data;
        });
    },
    mounted () {
        if (this.$route.query.data && this.$route.query.data.name) {
            this.productAttr = {
                ...this.$route.query.data,
                cityId: this.$route.query.data.attr_id ? this.$route.query.data.attr_id : '',
                timeSlot: [
                    moment(+this.$route.query.data.timeSlot[0]).format('YYYY-MM-DD hh:mm:ss'),
                    moment(+this.$route.query.data.timeSlot[1]).format('YYYY-MM-DD hh:mm:ss')
                ]
            }
        }
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
                            addOrUpdate({
                                ...this.productAttr,
                                type_id: this.productAttr.type_id,
                                attr_id: this.productAttr.cityId,
                                timeSlot: [moment(this.productAttr.timeSlot[0]).valueOf(), moment(this.productAttr.timeSlot[1]).valueOf()]
                            }).then(response => {
                                this.$message({
                                    message: "修改成功",
                                    type: "success",
                                    duration: 1000
                                });
                                this.$router.push({ path: "giftCardList" });
                            });
                        } else {
                            addOrUpdate({
                                ...this.productAttr,
                                attr_id: this.productAttr.cityId,
                                type_id: this.productAttr.type_id,
                                timeSlot: [moment(this.productAttr.timeSlot[0]).valueOf(), moment(this.productAttr.timeSlot[1]).valueOf()]
                            }).then(response => {
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
            this.productAttr = Object.assign({}, defaultProductAttr);
            this.productAttr.productAttributeCategoryId = Number(
                this.$route.query.cid
            );
            this.productAttr.type = Number(this.$route.query.type);
        },
        getCity () {
            request.post("/common/getCity", {pid: 0}).then(res => {
                if (res.errno == 0) {
                    this.cityList = res.data.children;
                }
            });
        }
    }
};
</script>

<style scoped>
</style>
