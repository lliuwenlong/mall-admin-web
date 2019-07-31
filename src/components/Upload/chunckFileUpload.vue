<template>
    <div>
        <el-upload
            action=""
            :http-request="chunFileUplaod"
            :show-file-list="showFileList"
            :accept="accept"
        >
            <slot></slot>
        </el-upload>
    </div>
</template>
<script>
import { policy } from "@/api/oss";
import {chunkFile} from '@/utils/index';
import request from '@/utils/request';
import { Loading } from 'element-ui';
export default {
    name: "singleUpload",
    props: {
        accept: String,
        path: String,
        'showFileList': Boolean,
        type: String
    },
    data () {
        fullscreenLoading: false
    },
    computed: {
        imageUrl() {
            return this.value;
        },
        imageName() {
            if (this.value != null && this.value !== "") {
                return this.value.substr(this.value.lastIndexOf("/") + 1);
            } else {
                return null;
            }
        },
        fileList() {
            return [
                {
                    name: this.imageName,
                    url: this.imageUrl
                }
            ];
        }
    },
    data() {
        return {
            dataObj: {
                policy: "",
                signature: "",
                key: "",
                ossaccessKeyId: "",
                dir: "",
                host: ""
            },
            dialogVisible: false
        };
    },
    methods: {
        chunFileUplaod(param) {
            const loadingInstance = Loading.service({
                text: '上传中请稍等',
                background: 'rgba(0, 0, 0, 0.8)'
            });
            const file = param.file;
            const total = Math.ceil(file.size / (1 * 1024 * 1024));
            const hash = String(Date.now() + file.uid + file.lastModified);
            const arrAxios = chunkFile(param.file, total, hash, 1 * 1024 * 1024);
            const name = file.name;
            Promise.all(arrAxios).then(() => {
                request.post('/common/mergeChunkFile', {
                    total,
                    hash,
                    name,
                    type: this.type
                }).then(res => {
                    this.$emit('onSuccess', res);
                    loadingInstance.close();
                }).catch(res => {
                    this.$message({
                        type: 'warning',
                        message: '上传失败，请重试'
                    })
                });
            })
        },
        emitInput(val) {
            this.$emit("input", val);
        },
        handleRemove(file, fileList) {
            this.emitInput("");
        },
        handlePreview(file) {
            this.dialogVisible = true;
        },
        beforeUpload(file) {
            let _self = this;
            return new Promise((resolve, reject) => {
                policy()
                    .then(response => {
                        _self.dataObj.policy = response.data.policy;
                        _self.dataObj.signature = response.data.signature;
                        _self.dataObj.ossaccessKeyId =
                            response.data.accessKeyId;
                        _self.dataObj.key = response.data.dir + "/${filename}";
                        _self.dataObj.dir = response.data.dir;
                        _self.dataObj.host = response.data.host;
                        resolve(true);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(false);
                    });
            });
        }
    }
};
</script>
<style>
</style>
