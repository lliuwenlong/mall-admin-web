<template>
    <div class="app-container">
        <el-upload
            v-if="imgList.length < 8"
            class="upload-demo"
            action="/api/common/uploadFile"
            :on-preview="handlePreview"
            :file-list="fileList"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeAvatarUpload"
            accept="jpg,.jpeg,.png,.JPG,.JPEG"
        >
            <el-button size="small" type="primary" ref="uploadBtn">上传图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
        <div class="img-list">
            <ul>
                <li
                    v-for="(val, key) in imgList"
                    :key="key"
                    @mouseenter="isShowHoveId = val.id"
                    @mouseleave="isShowHoveId = null"
                >
                    <img :src="`http://192.168.1.10:8900/${val.url}`">
                    <div class="hover" v-show="isShowHoveId === val.id">
                        <i class="el-icon-delete" @click="removeImg(val)" v-if="imgList.length > 5"></i>
                        <el-button type="text" @click="replaceImg(val)">替换图片</el-button>
                    </div>
                </li>
            </ul>
        </div>
        <el-dialog
            title="替换图片"
            :visible.sync="isShowDialog"
            width="30%"
            :before-close="beforeClose"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
        >
            <el-upload
                class="upload-demo"
                action="/api/common/uploadFile"
                :show-file-list="false"
                :on-success="replaceSuccess"
                :before-upload="beforeAvatarUpload"
                accept="jpg,.jpeg,.png,.JPG,.JPEG"
            >
                <el-button size="small" type="primary" ref="uploadBtn">上传图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png/JPG/JPEG文件，且不超过2M</div>
            </el-upload>
        </el-dialog>
    </div>
</template>
<script>
import request from "@/utils/request";
import {gcd} from "@/utils/index";
export default {
    created() {
        this.getImgList();
    },
    data() {
        return {
            fileList: [],
            imgList: [],
            isShowHoveId: false,
            isShowDialog: false,
            imgId: null
        };
    },
    methods: {
        handleRemove() {},
        handlePreview() {},
        uploadSuccess(res) {
            if (res.errno !== 0) {
                this.$message({
                    type: "warning",
                    message: "上传失败"
                });
                return;
            };
            const [width, height] = res.data.imgSize;
            if (!this.chunkFileSize(width, height)) {
                return;
            }
            request
                .post("/system/addBanner", {
                    urlArr: [{ url: res.data.path }]
                })
                .then(res => {
                    res.errno === 0 && this.getImgList();
                    this.$message({
                        type: res.errno === 0 ? "success" : "warning",
                        message: res.errmsg
                    });
                })
                .catch(res => {
                    this.$message({
                        type: "warning",
                        message: "上传失败"
                    });
                });
        },
        beforeAvatarUpload(file) {
            const maxSize = 2 * 1024 * 1024;
            if (maxSize < file.size) {
                this.$message({
                    type: "warning",
                    message: "文件过大"
                });
                return false;
            }
        },
        getImgList() {
            request.post("/system/bannerList").then(res => {
                this.imgList = res.data;
            });
        },
        replaceImg(val) {
            this.isShowDialog = true;
            this.imgId = val.id;
        },
        replaceSuccess(res) {
            if (res.errno !== 0) {
                this.$message({
                    type: "warning",
                    message: "上传失败"
                });
                return;
            };
            const [width, height] = res.data.imgSize;
            if (!this.chunkFileSize(width, height)) {
                return;
            }
            request
                .post("/system/updateBanner", {
                    urlArr: [{ url: res.data.path, id: this.imgId }]
                })
                .then(res => {
                    res.errno === 0 && this.getImgList();
                    this.$message({
                        type: res.errno === 0 ? "success" : "warning",
                        message: res.errno === 0 ? '替换成功' : res.errmsg
                    });
                    res.errno === 0 && this.beforeClose();
                })
                .catch(res => {
                    this.$message({
                        type: "warning",
                        message: "替换失败"
                    });
                });
        },
        beforeClose() {
            this.isShowDialog = false;
            this.imgId = null;
        },
        removeImg(val) {
            this.$confirm("您确定要删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                request
                    .post("/system/delBanner", { id: val.id })
                    .then(res => {
                        res.errno === 0 && this.getImgList();
                        this.$message({
                            type: res.errno === 0 ? "success" : "warning",
                            message: res.errmsg
                        });
                    })
                    .catch(res => {
                        this.$message({
                            type: "warning",
                            message: "删除失败!"
                        });
                    });
            });
        },
        chunkFileSize(width, height) {
            const proportion = width / height;
            const chunkSize = 34 / 13;
            if (width < 680 || height < 260) {
                this.$message({
                    type: 'warning',
                    message: '图片最小尺寸为：680 * 260'
                });
                return false;
            }
            if (chunkSize !== proportion) {
                this.$message({
                    type: 'warning',
                    message: '图片宽高比例为34 : 13'
                });
                return false;
            }
            return true;
        }
    }
};
</script>
<style lang="less" scoped>
.img-list {
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        margin-top: 5px;
        li {
            width: 340px;
            height: 130px;
            border-radius: 10px;
            position: relative;
            margin-top: 25px;
            display: inline-block;
            margin-right: 20px;
            img {
                display: block;
                width: 340px;
                height: 130px;
                overflow: hidden;
            }
            .hover {
                position: absolute;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.6);
                width: 340px;
                height: 130px;
                line-height: 130px;
                text-align: center;
                .el-icon-delete {
                    color: #fff;
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
