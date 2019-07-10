<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button style="float:right" type="primary" @click="getList" size="small">查询搜索</el-button>
                <el-button
                    style="float:right;margin-right: 15px"
                    @click="getList(true)"
                    size="small"
                >重置</el-button>
                <div style="margin-top: 15px">
                    <el-form :inline="true" size="small" label-width="140px">
                        <el-form-item label="购买人姓名">
                            <el-input v-model="name" placeholder="姓名或昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式">
                            <el-input v-model="tel"></el-input>
                        </el-form-item>
                        <el-form-item label="课程名称：">
                            <el-input v-model="title"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="margin:0 auto;"></div>
            </div>
        </el-card>

        <div class="table-list">
            <el-table show-header border :data="tableList">
                <el-table-column
                    v-for="(val, key) in tableListColumn"
                    :key="key"
                    :label="val.label"
                    :prop="val.prop"
                    :width="val.width"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div>
                            {{val.content ? val.content(scope.row) : scope.row[val.prop]}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="是否发送课程" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row['send_out']" @change="e => changeSendOut(e, scope.row)">
                            <el-option :value="0" label="未发送"></el-option>
                            <el-option :value="1" label="发送"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-page">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="list.length"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                :hide-on-single-page="list.length <= 10"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { BUYING_COURSES_LIST } from "./common/config";
import request from "@/utils/request";
import {filterObject} from "@/utils/index";
export default {
    created() {
        this.tableListColumn = [...BUYING_COURSES_LIST];
        this.getList();
    },
    data() {
        return {
            list: [],
            showcCrriculum: false,
            crriculumList: [],
            currentPage: 1,
            pageSize: 10,
            name: '',
            tel: '',
            title: ''
        };
    },
    computed: {
        tableList() {
            return this.list.slice(
                (this.currentPage - 1) * this.pageSize,
                (this.currentPage - 1) * this.pageSize + 10
            );
        }
    },
    methods: {
        getList(isReset = false) {
            if (isReset) {
                this.name = '';
                this.tel = '';
                this.title= '';
            }
            this.currentPage = 1;
            request.post("/curriculum/getSeize", {
                ...filterObject({
                    name: this.name,
                    tel: this.tel,
                    title: this.title
                })
            }).then(res => {
                if (res.errno === 0) {
                    this.list = res.data;
                }
            });
        },
        changeSendOut(val, row) {
            console.log(row);
            request.post("/curriculum/changeSendOut", {
                status: val,
                id: row.order_id
            }).then(res => {
                if (res.errno === 0) {
                   this.$message({
                        type: "success",
                        message: '修改成功'
                    });
                } else {
                    this.$message({
                        type: "warning",
                        message: '修改失败'
                    });
                }
            }).catch(e => {
                this.$message({
                    type: "warning",
                    message: '修改失败'
                });
            });
        }
    }
};
</script>

<style style lang="less" scoped>
.app-container {
    .table-list {
        margin: 0 auto;
        .table-content {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .table-page {
        margin-top: 20px;
        float: right;
    }
}
</style>

