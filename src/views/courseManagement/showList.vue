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
                >
                    <template slot-scope="scope">
                        <div
                            v-if="val.prop === 'content'"
                            class="table-content"
                            :title="scope.row[val.prop]"
                        >{{scope.row[val.prop]}}</div>
                        <div v-else>{{scope.row[val.prop]}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="openCrriculum(scope.row)">查看课程</el-button>
                        <el-button type="text" size="small" @click="deleteList(scope.row)">删除</el-button>
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
        <el-dialog
            title="展示课时"
            :visible.sync="showcCrriculum"
            width="50%"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            @before-close="closeCrriculum"
        >
            <el-table show-header border :data="crriculumList">
                <el-table-column
                    v-for="(val, key) in tableCrriculumList"
                    :key="key"
                    :label="val.label"
                    :prop="val.prop"
                    :width="val.width"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delCurriculumList(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeCrriculum">取 消</el-button>
                <el-button type="primary" @click="okCrriculum">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { TABLE_LIST_COLUMN, TABLE_CRRICULUM_LIST} from "./common/config";
import request from "@/utils/request";
export default {
    created() {
        this.tableListColumn = [...TABLE_LIST_COLUMN];
        this.tableCrriculumList = [...TABLE_CRRICULUM_LIST];
        this.getList();
    },
    data() {
        return {
            list: [],
            showcCrriculum: false,
            crriculumList: [],
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
            request.post("/curriculum/getList").then(res => {
                if (res.errno === 0) {
                    this.list = res.data;
                }
            });
        },
        deleteList({ id }) {
            this.$confirm("您确定要删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                request
                    .post("/curriculum/delete", { id })
                    .then(res => {
                        res.errno === 0 && this.getList();
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
        closeCrriculum() {
            this.showcCrriculum = false;
            this.crriculumList = [];
        },
        openCrriculum({id}) {
            this.showcCrriculum = true;
            request.post('/common/getCurriculumList', {id}).then(res => {
                if (res.errno === 0) {
                    this.crriculumList = res.data;
                }
            });
        },
        okCrriculum() {
            this.closeCrriculum()
        },
        delCurriculumList({ id }) {
            this.$confirm("您确定要删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                request
                    .post("/common/delCurriculumList", { id })
                    .then(res => {
                        if (res.errno === 0) {
                            const data = this.crriculumList.filter(item => id != item.id)
                            this.crriculumList = [...data];
                        }
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

