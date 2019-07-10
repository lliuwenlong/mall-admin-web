<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>筛选列表</span>
            <el-button class="btn-add" @click="handleReset" size="mini">重置</el-button>
            <div class="filter">
                <label>支付方式：</label>
                <el-select v-model="paymentMethod" @change="getList">
                    <el-option
                        v-for="(item, key) in paymentMethodList"
                        :key="key"
                        :value="key"
                        :label="item"
                    ></el-option>
                </el-select>
                <label style="margin-left: 20px">交易类型：</label>
                <el-select v-model="transactionType" @change="getList">
                    <el-option
                        v-for="(item, key) in transactionList"
                        :key="key"
                        :value="key"
                        :label="item"
                    ></el-option>
                </el-select>
            </div>
        </el-card>
        <el-table show-header border :data="tableList" v-loading="listLoading">
            <el-table-column
                v-for="(val, key) in title"
                :key="key"
                :label="val.label"
                :prop="val.prop"
                :width="val.width"
                align="center"
            >
                <template slot-scope="scope">
                    {{val.content ? val.content(scope.row) : scope.row[val.prop]}}
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
import { TABLE_LIST_ORDER, PAYMENT_METHOD, TRANSACTION_TYPE } from "./common/config";
import request from "@/utils/request";
import {filterObject} from "@/utils/index";
export default {
    name: "orderList",
    data() {
        return {
            title: [...TABLE_LIST_ORDER],
            list: [],
            currentPage: 1,
            pageSize: 10,
            listLoading: false,
            paymentMethod: "",
            paymentMethodList: { ...PAYMENT_METHOD },
            transactionType: '',
            transactionList: { ...TRANSACTION_TYPE }
        };
    },
    computed: {
        tableList() {
            return this.list.slice(
                (this.currentPage - 1) * this.pageSize,
                (this.currentPage - 1) * this.pageSize + this.pageSize
            );
        }
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.currentPage = 1;
            this.listLoading = true;
            request.post("/user/getOrderList", filterObject({
                type: this.transactionType,
                mentmethodType: this.paymentMethod
            })).then(res => {
                if (res.errno === 0) {
                    this.list = res.data;
                }
                this.listLoading = false;
            });
        },
        handleReset () {
            this.paymentMethod = '';
            this.transactionType = '';
            this.currentPage = 1;
            this.getList();
        }
    }
};
</script>
<style lang="less" scoped>
.table-page {
    margin-top: 20px;
    float: right;
}
.operate-container {
    margin-bottom: 20px;
}
.filter {
    margin-top: 20px;
}
</style>

