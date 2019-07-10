<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>查询列表</span>
            <div style="margin-top: 20px;width: 600px;">
                <el-input placeholder="请输入报名人姓名" style="width: 200px" v-model="name"></el-input>
                <el-input placeholder="请输入活动名称" style="width: 200px;margin-left: 10px" v-model="title"></el-input>
                <el-button @click="getList">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </div>

           
        </el-card>
        <div class="table-container">
            <el-table
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border
                loading="listLoading"
            >
                <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="活动名称" align="center">
                    <template slot-scope="scope">{{scope.row.title}}</template>
                </el-table-column>
                <el-table-column label="报名人姓名"  align="center">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="报名人电话"  align="center">
                    <template slot-scope="scope">{{scope.row.user_tel}}</template>
                </el-table-column>
                <el-table-column label="报名人时间"  align="center">
                    <template slot-scope="scope">{{scope.row.addtime}}</template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getList, del, addOrUpdate } from "@/api/underLine";
import request from "@/utils/request";
import Tinymce from "@/components/Tinymce";
import { imgPath } from "@/utils/imgPath";
import moment from 'moment';
import { filterObject } from "@/utils/index";
export default {
    name: "productList",
    components: { tinymce: Tinymce },
    data() {
        return {
            imgPath,
            list: null,
            dialogVisible: false,
            editData: {},
            listLoading: true,
            name: '',
            title: ''
        };
    },
    created() {
        this.getList();
    },
    methods: {
        xiugai(o) {
            this.$router.push({ path: "underLineAdd", query: { data: o } });
        },
        handleAddProduct() {
            this.$router.push({ path: "underLineAdd" });
        },
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        edit(o) {
            this.editData = o;
            if (o.status == 1) {
                this.$prompt("请输入手机号码", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputPattern: /^1[34578]\d{9}$/,
                    inputErrorMessage: "格式不正确"
                })
                    .then(({ value }) => {
                        this.editData.text = value;
                        this.editFn();
                    })
                    .catch(() => {
                        return;
                    });
            } else {
                this.dialogVisible = true;
            }
        },
        editFn() {
            addOrUpdate(this.editData).then(res => {
                this.$message({
                    type: "success",
                    message: res.errmsg
                });
                this.getList();
            });
        },
        getList() {
            this.listLoading = true;
            request.post('/underLine/getSignUpList', {
                ...filterObject({
                    name: this.name,
                    title: this.title
                })
            }).then(response => {
                this.listLoading = false;
                this.list = response.data.map(item => {
                    return {...item, addtime: moment(+item.addtime).format('YYYY-MM-DD')};
                });
            });
        },
        delect(id) {
            this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    del(id).then(() => {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.getList();
                    });
                })
                .catch(() => {});
        },
        reset () {
            this.title = '';
            this.name = '';
            this.getList();
        }
    }
};
</script>
<style></style>


