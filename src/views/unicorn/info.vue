<template>
    <el-card class="form-container" shadow="never" style="width:855px;">
        <el-form :model="productAttr" ref="productAttrFrom" label-width="150px">
            <el-form-item label="项目名称" prop="title">
                <el-input v-model="productAttr.title"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="subtitle">
                <el-input v-model="productAttr.subtitle"></el-input>
            </el-form-item>
            <el-form-item label="项目咨询人">
                <el-form class="class-list" inline :model="productAttr">
                    <el-form-item
                        prop="name"
                        label="姓名"
                        :rules="[{
                            required: true, message: '请输入姓名', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="请输入姓名" v-model="productAttr.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="tel"
                        label="职务"
                        :rules="[{
                            required: true, message: '请输入职务', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="请输入职务" v-model="productAttr.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="头像" required>
                        <chunckFileUpload
                            style="display: inline-block"
                            :show-file-list="false"
                            @onSuccess="res => {
                                productAttr.headImg=res.data;
                                productAttr={...productAttr};
                            }"
                            accept=".png, .jpg, .jpeg"
                        >
                            <el-button
                                size="medium"
                                class="medium-btn"
                                type="primary"
                                style="margin-left: 10px"
                            >点击上传</el-button>
                        </chunckFileUpload>
                        <el-link
                            :type="productAttr.headImg ? 'success' : 'danger'"
                            class="label"
                            :underline="false"
                        >{{productAttr.headImg ? '已上传' : '未上传'}}</el-link>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="项目类别" prop="type">
                <el-input v-model="productAttr.type"></el-input>
            </el-form-item>
            <el-form-item label="项目时间" prop="time">
                <el-date-picker
                    v-model="productAttr.time"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="地点" prop="place">
                <el-cascader
                    :options="options.place.data"
                    :props="options.place.props"
                    v-model="productAttr.place"
                    clearable
                ></el-cascader>
                <!-- <el-input v-model="productAttr.place"></el-input> -->
            </el-form-item>
            <el-form-item label="基本信息" prop="basic">
                <tinymce :width="595" :height="200" v-model="productAttr.basic"></tinymce>
            </el-form-item>
            <el-form-item label="详细信息" prop="details">
                <el-button size="medium" @click="addForm('details')">添加信息</el-button>
                <el-form
                    v-for="(val, key) in productAttr.details"
                    :key="key"
                    class="class-list"
                    style="margin-top: 20px"
                    inline
                    :model="val"
                >
                    <el-form-item
                        prop="name"
                        label="标题"
                        :rules="[{
                            required: true, message: '输入标题', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="标题" v-model="val.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="details"
                        label="详情"
                        :rules="[{
                            required: true, message: '输入信息', trigger: 'blur'
                        }]"
                    >
                        <tinymce :width="571" :height="200" v-model="val.details"></tinymce>
                    </el-form-item>
                    <el-button
                        size="medium"
                        class="del"
                        type="danger"
                        @click="delForm('details',key)"
                    >删除</el-button>
                </el-form>
            </el-form-item>
            <el-form-item label="选择标签" prop="unicorn_tags">
                <el-select v-model="productAttr.unicorn_tags" multiple filterable placeholder="请选择">
                    <el-option
                        v-for="item in options.tag"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="可抢占城市" prop="unicorn_city">
                <tree-transfer @change="cityChange"></tree-transfer>
            </el-form-item>
            <el-form-item label="融资信息" prop="unicorn_info">
                <el-button size="medium" @click="addForm('unicorn_info')">添加信息</el-button>
                <el-form
                    v-for="(val, key) in productAttr.unicorn_info"
                    :key="key"
                    class="class-list"
                    style="margin-top: 20px"
                    inline
                    :model="val"
                >
                    <el-form-item
                        prop="name"
                        label="融资情况（*轮）"
                        :rules="[{
                            required: true, message: '输入融资情况', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="融资情况（*轮）" v-model="val.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="price"
                        label="金额（万）"
                        :rules="[{
                            required: true, message: '输入金额', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="金额（万）" v-model="val.price"></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="valuation"
                        label="估值（万）"
                        :rules="[{
                            required: true, message: '输入估值', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="估值（万）" v-model="val.valuation"></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="company"
                        label="投资公司"
                        :rules="[{
                            required: true, message: '输入投资公司', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="投资公司" v-model="val.company"></el-input>
                    </el-form-item>
                    <el-button
                        size="medium"
                        class="del"
                        type="danger"
                        @click="delForm('unicorn_info',key)"
                    >删除</el-button>
                </el-form>
            </el-form-item>
            <el-form-item label="项目成员" prop="unicorn_member">
                <el-button size="medium" @click="addForm('unicorn_member')">添加成员</el-button>
                <el-form
                    style="margin-top: 20px"
                    v-for="(val, key) in productAttr.unicorn_member"
                    :key="key"
                    class="class-list"
                    inline
                    :model="val"
                >
                    <el-form-item
                        prop="name"
                        label="姓名"
                        :rules="[{
                            required: true, message: '请输入姓名', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="请输入姓名" v-model="val.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="post"
                        label="职务"
                        :rules="[{
                            required: true, message: '请输入职务', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="请输入职务" v-model="val.post"></el-input>
                    </el-form-item>
                    <el-form-item label="头像" required>
                        <chunckFileUpload
                            style="display: inline-block"
                            :show-file-list="false"
                            @onSuccess="res => {
                                productAttr.unicorn_member[key].img=res.data;
                                productAttr={...productAttr};
                            }"
                            accept=".png, .jpg, .jpeg"
                        >
                            <el-button
                                size="medium"
                                class="medium-btn"
                                type="primary"
                                style="margin-left: 10px"
                            >点击上传</el-button>
                        </chunckFileUpload>
                        <el-link
                            :type="productAttr.unicorn_member[key].img ? 'success' : 'danger'"
                            class="label"
                            :underline="false"
                        >{{productAttr.unicorn_member[key].img ? '已上传' : '未上传'}}</el-link>
                    </el-form-item>
                    <el-button
                        size="medium"
                        class="del"
                        type="danger"
                        @click="delForm('unicorn_member',key)"
                    >删除</el-button>
                </el-form>
            </el-form-item>
            <el-form-item label="相关视频" prop="unicorn_videos">
                <el-button size="medium" @click="addForm('unicorn_videos')">添加视频</el-button>
                <el-form
                    style="margin-top: 20px"
                    v-for="(val, key) in productAttr.unicorn_videos"
                    :key="key"
                    class="class-list"
                    inline
                    :model="val"
                >
                    <el-form-item
                        prop="title"
                        label="标题"
                        :rules="[{
                            required: true, message: '请输入标题', trigger: 'blur'
                        }]"
                    >
                        <el-input class="input-mini" placeholder="请输入标题" v-model="val.title"></el-input>
                    </el-form-item>
                    <el-form-item label="视频" required>
                        <chunckFileUpload
                            style="display: inline-block"
                            :show-file-list="false"
                            @onSuccess="res => {
                                productAttr.unicorn_videos[key].path=res.data;
                                productAttr={...productAttr};
                            }"
                            accept=".mp4, .avi"
                        >
                            <el-button
                                size="medium"
                                class="medium-btn"
                                type="primary"
                                style="margin-left: 10px"
                            >点击上传</el-button>
                        </chunckFileUpload>
                        <el-link
                            :type="productAttr.unicorn_videos[key].path ? 'success' : 'danger'"
                            class="label"
                            :underline="false"
                        >{{productAttr.unicorn_videos[key].path ? '已上传' : '未上传'}}</el-link>
                    </el-form-item>
                    <el-button
                        size="medium"
                        class="del"
                        type="danger"
                        @click="delForm('unicorn_videos',key)"
                    >删除</el-button>
                </el-form>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
                <el-button v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { getTag,addOrUpdate } from "@/api/unicorn";
import { getCity } from "@/api/common";
import Tinymce from "@/components/Tinymce";
import { imgPath } from "@/utils/imgPath";
import treeTransfer from "@/components/TreeTransfer";
import chunckFileUpload from "@/components/Upload/chunckFileUpload";
const defaultProductAttr = {
    unicorn_member: [],
    unicorn_info: [],
    unicorn_tags: [],
    unicorn_videos: [],
    details: []
};
export default {
    components: { tinymce: Tinymce, treeTransfer, chunckFileUpload },
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
            productAttr: { ...defaultProductAttr },
            dialogImageUrl: "",
            dialogVisible: false,
            productAttrCateList: null,
            options: {
                tag: [],
                place: {
                    data: [],
                    props: {
                        lazy: true,
                        checkStrictly: true,
                        lazyLoad(node, resolve) {
                            if (node.level === 0)
                                getCity(1).then(res => {
                                    resolve(res.data);
                                });
                            else
                                getCity(node.data.id).then(res => {
                                    resolve(
                                        res.data.map(v => {
                                            if (v.type == 3) {
                                                v.leaf = true;
                                            }
                                            return v;
                                        })
                                    );
                                });
                        },
                        label: "cityname",
                        value: "cityname"
                    }
                }
            }
        };
    },
    async created() {
        await this.resetProductAttr();
        await getTag().then(res => {
            this.options.tag = res.data;
        });
        if (this.$route.query.data && this.$route.query.data.name)
            this.productAttr = this.$route.query.data;
    },
    methods: {
        addForm(key) {
            this.productAttr[key].push({});
        },
        delForm(key, index) {
            this.productAttr[key].splice(index, 1);
        },
        cityChange(to) {
            let ids = [];
            to.map(v => {
                v.children.map(vv => {
                    vv.children.map(vvv => {
                        ids.push(vvv.id);
                    });
                });
            });
            this.productAttr.unicorn_city = ids;
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
            this.productAttr = { ...defaultProductAttr };
        }
    }
};
</script>

<style scoped lang="less">
.input-mini {
    width: 150px;
}
.class-list {
    .el-form-item {
        margin-bottom: 20px;
    }
    border-radius: 10px;
    border: 1px solid #eee;
    padding: 20px 10px 0;
    .del {
        margin-bottom: 20px;
    }
}
.label {
    margin: 0 10px;
}
</style>
