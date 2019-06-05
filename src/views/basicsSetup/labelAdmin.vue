<template>
    <div class="app-container">
        <el-table show-header border :data="tableList">
            <el-table-column
                v-for="(val, key) in tableListColumn"
                :key="key"
                :label="val.label"
                :prop="val.prop"
                :width="val.width"
                align="center"
                :sortable="val.sortable"
            >
                <template slot-scope="scope">
                    <div
                        v-if="val.prop === 'message' || val.prop === 'label'"
                        class="table-content"
                        :title="scope.row[val.prop]"
                    >{{scope.row[val.prop]}}</div>
                    <div v-else>{{scope.row[val.prop]}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteList(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="table-page" v-if="list.length > 10">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="list.length"
                :current-page.sync="currentPage"
                :page-size="pageSize"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import request from "@/utils/request";
import {TABLE_LIST_LABEL} from "./common/config";
export default {
    data() {
        return {
            form: {},
            list: [],
            tableListColumn: [...TABLE_LIST_LABEL],
            currentPage: 1,
            pageSize: 10
        };
    },
    created() {
        this.getList();
    },
    computed: {
        tableList() {
            return this.list.slice((this.currentPage - 1) *  this.pageSize, (this.currentPage - 1) *  this.pageSize + 10)
        }
    },
    methods: {
        getList() {
            request.post("/label/labelShow").then(res => {
                if (res.errno === 0) {
                    this.list = res.data;
                }
            });
        },
        deleteList(row) {
            request.post('/label/labelDel', {id: row.id}).then(res => {
                res.errno === 0 && this.getList();
                this.$message({
                    type: res.errno === 0 ? 'success' : 'warning',
                    message: res.errmsg
                })
            }).catch(e => {
                this.$message({
                    type: 'warning',
                    message: '删除失败'
                })
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
