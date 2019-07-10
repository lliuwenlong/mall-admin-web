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
            <el-form-item
                label="类型"
                prop="type"
                :rules="[
                    { required: true, message: '请选择类型', trigger: 'change' },
                ]"
            >
                <el-select v-model="productAttr.type">
                    <el-option label="专辑" :value="1"></el-option>
                    <el-option label="精品" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="价格"
                prop="price"
                :rules="[
                    { required: true, message: '请输入价格', trigger: 'blur' },
                ]"
            >
                <el-input v-model="productAttr.price"></el-input>
            </el-form-item>
            <el-form-item
                label="vip价格"
                prop="vipPrice"
                :rules="[
                    { required: true, message: '请输入vip价格', trigger: 'blur' },
                ]"
            >
                <el-input v-model="productAttr.vipPrice"></el-input>
            </el-form-item>
            <el-form-item
                label="主讲人"
                prop="speaker"
                :rules="[
                    { required: true, message: '请输入主讲人', trigger: 'blur' },
                ]"
            >
                <el-input v-model.number="productAttr.speaker"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="briefIntroduction">
                <tinymce :width="595" :height="300" v-model="productAttr.briefIntroduction"></tinymce>
            </el-form-item>
            <el-form-item label="详情介绍" prop="content">
                <tinymce :width="595" :height="300" v-model="productAttr.content"></tinymce>
            </el-form-item>
            <el-form-item label="封面" class="cover-wraper">
                <el-upload
                    style="display: inline-block"
                    action="/api/common/uploadFile"
                    :show-file-list="false"
                    :on-success="uploadCoverSuccess"
                    accept=".jpg, .jpeg, .png, .JPG, .JPEG"
                >
                    <el-button
                        size="medium"
                        class="medium-btn"
                        type="primary"
                    >{{productAttr.cover ? '替换封面' : '上传封面'}}</el-button>
                </el-upload>
                <el-link
                    :type="productAttr.img ? 'success' : 'danger'"
                    class="label"
                    :underline="false"
                >{{productAttr.img ? '已上传' : '未上传'}}</el-link>
                <div class="cover" v-if="productAttr.img">
                    <img :src="getUrl(productAttr.img)" alt>
                </div>
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
                        <chunckFileUpload
                            style="display: inline-block"
                            :show-file-list="false"
                            @onSuccess="res => uploadAudioSuccess(res, key)"
                            accept=".mp3, .MP3"
                        >
                            <el-button
                                size="medium"
                                class="medium-btn"
                                type="primary"
                                style="margin-left: 10px"
                            >
                                {{productAttr.classHour[key].audio ? '替换音频' : '上传音频'}}
                            </el-button>
                        </chunckFileUpload>
                        <el-link
                            :type="productAttr.classHour[key].audio ? 'success' : 'danger'"
                            class="label"
                            :underline="false"
                        >{{productAttr.classHour[key].audio ? '已上传' : '未上传'}}</el-link>
                        <chunckFileUpload
                            style="display: inline-block"
                            :show-file-list="false"
                            @onSuccess="res => uploadVideoSuccess(res, key)"
                            accept=".mp4, .MP4, .avi, .AVI"
                        >
                            <el-button size="medium" class="medium-btn" type="primary">
                                {{productAttr.classHour[key].video ? '替换视频' : '上传视频'}}
                                
                            </el-button>
                        </chunckFileUpload>
                        <el-link
                            :type="productAttr.classHour[key].video ? 'success' : 'danger'"
                            class="label"
                            :underline="false"
                        >{{productAttr.classHour[key].video ? '已上传' : '未上传'}}</el-link>
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
                <el-button type="primary" @click="submitForm('ruleForm')">
                    {{$route.query.id ? '保存' : '立即创建'}}
                </el-button>
                <el-button @click="resetForm('ruleForm')" v-if="!$route.query.id">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import request from "@/utils/request";
import { PUBLIC_PATH } from "@/config/config";
import chunckFileUpload from "@/components/Upload/chunckFileUpload";
export default {
    components: { tinymce: Tinymce, chunckFileUpload },
    data() {
        return {
            productAttr: {
                name: "",
                subTitle: "",
                content: "",
                classHour: [],
                price: '',
                img: "",
                speaker: '',
                vipPrice: '',
                briefIntroduction: '',
                type: ''
            },
            typeList: [],
            deleteId: []
        };
    },
    created() {
        this.getTypeList();
        if (this.$route.query.id) {
            const task = request.post("/market/getList", {id: this.$route.query.id});
            const curriculumList = request.post("/common/getCurriculumList", {id: this.$route.query.id, type: 1});
            Promise.all([task, curriculumList]).then(res => {
                let [list, curriculumList] = res;
                if (list.errno === 0) {
                    const {content, price, vipPrice, name, subtitle: subTitle, img, speaker, basic} = list.data[0];
                    this.productAttr = {
                        ...this.productAttr,
                        content,
                        price,
                        vipPrice,
                        name,
                        subTitle,
                        img,
                        speaker,
                        briefIntroduction: basic
                    };
                }
                if (curriculumList.errno === 0) {
                    const data = curriculumList.data;
                    this.productAttr = {
                        ...this.productAttr,
                        classHour: data.map(item => {
                            return {
                                title: item.title,
                                video: item.video,
                                audio: item.audio,
                                c_id: this.$route.query.id,
                                id: item.id
                            }
                        })
                    };
                }
            });
        }
    },
    computed: {
        getUrl() {
            return url => `${PUBLIC_PATH}${url}`;
        }
    },
    watch: {},
    methods: {
        addClass() {
            const productAttr = { ...this.productAttr };
            const classHour = [...productAttr.classHour];
            classHour.push({
                title: "",
                video: "",
                audio: "",
                type: 1
            });
            productAttr.classHour = [...classHour];
            this.productAttr = { ...productAttr };
        },
        submitForm() {
            this.$refs.productAttrFrom.validate(valid => {
                if (valid) {
                    let flag = true;
                    let content = [];
                    if (this.productAttr.briefIntroduction === "") {
                        content.push("简介");
                        flag = false;
                    }
                    if (this.productAttr.content === "") {
                        content.push("详情介绍");
                        flag = false;
                    }
                    if (this.productAttr.img === "") {
                        content.push("封面");
                        flag = false;
                    }
                    if (this.productAttr.classHour.length === 0) {
                        content.push("上传课程");
                        flag = false;
                    }
                    for (
                        let i = 0;
                        i < this.productAttr.classHour.length;
                        i++
                    ) {
                        if (
                            this.productAttr.classHour.video === "" ||
                            this.productAttr.classHour.audio === ""
                        ) {
                            flag = false;
                            content.push("上传课程");
                            break;
                        }
                    }
                    if (flag) {
                        request.post('/market/addOrUpdate', {
                            name: this.productAttr.name,
                            subtitle: this.productAttr.subTitle,
                            content: this.productAttr.content,
                            list: this.productAttr.classHour,
                            price: this.productAttr.price,
                            vipPrice: this.productAttr.vipPrice,
                            img: this.productAttr.img,
                            speaker: this.productAttr.speaker,
                            basic: this.productAttr.briefIntroduction,
                            type: this.productAttr.type,
                            ...(
                                this.$route.query.id
                                    ? {id: this.$route.query.id}
                                    : {}
                            ),
                            ...(
                                this.$route.query.id
                                    ? {deleteId: this.deleteId}
                                    : {}
                            )
                        }).then(res => {
                            if (res.errno === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.errmsg
                                });
                                this.$router.push('showList');
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: res.errmsg
                                });
                            }
                        });
                    } else {
                        this.$alert(
                            `请完成${content.join(",")}内容上传或填写`,
                            "温馨提示",
                            {
                                confirmButtonText: "确定",
                                type: "warning"
                            }
                        );
                        return false;
                    }
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.productAttr = {
                name: "",
                subTitle: "",
                content: "",
                classHour: [],
                typeId: "",
                price: 0,
                cover: ""
            };
            this.type = '';
            this.$refs.productAttrFrom.resetFields();
        },
        deleteClass(key) {
            const productAttr = { ...this.productAttr };
            const classHour = [...productAttr.classHour];
            const data = classHour.splice(key, 1);
            productAttr.classHour = [...classHour];
            this.productAttr = { ...productAttr };
            if (data[0] && data[0].id) {
                this.deleteId = [...this.deleteId, data[0].id]
            }
        },
        uploadAudioSuccess(res, key) {
            if (res.errno === 0) {
                const productAttr = { ...this.productAttr };
                productAttr.classHour[key]["audio"] = res.data;
                this.productAttr = { ...productAttr };
            }
        },
        getTypeList() {
            request.post("/system/getCurriculumType").then(res => {
                this.typeList = [...res.data];
            });
        },
        uploadCoverSuccess(res) {
            if (res.errno === 0) {
                this.productAttr.img = res.data.path;
            }
        },
        uploadVideoSuccess(res, key) {
            if (res.errno === 0) {
                const productAttr = { ...this.productAttr };
                productAttr.classHour[key]["video"] = res.data;
                this.productAttr = { ...productAttr };
            }
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
.cover-wraper {
    overflow: hidden;
    .cover {
        width: 200px;
        height: 200px;
        position: relative;
        top: 20px;
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
}
.label {
    margin: 0 10px;
}
</style>
