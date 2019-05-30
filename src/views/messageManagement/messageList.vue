<template>
    <div class="app-container">
        <div class="table-list">
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
import { TABLE_LIST_COLUMN } from "./common/config";
import request from "@/utils/request";
export default {
    created() {
        this.tableListColumn = [...TABLE_LIST_COLUMN];
        this.getList();
    },
    data() {
        return {
            list: [],
            currentPage: 1,
            pageSize: 10
        };
    },
    computed: {
        tableList() {
            return this.list.slice((this.currentPage - 1) *  this.pageSize, (this.currentPage - 1) *  this.pageSize + 10)
        }
    },
    methods: {
        getList() {
            request.post("/webSocket/getMessageList").then(res => {
                this.list = [...res.data];
            });
        }
    }
};
</script>

<style lang="less" scoped>
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
