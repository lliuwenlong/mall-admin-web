<template>
    <div class="treeTrans">
        <tree-transfer
            :title="title"
            :from_data="fromData"
            :to_data="toData"
            :defaultProps="props"
            :button_text="['选择','移除']"
            @addBtn="add"
            @removeBtn="remove"
            :mode="mode"
            :lazyFn="loadNode"
            :defaultTransfer="true"
            height="540px"
            filter
            lazy
        ></tree-transfer>
    </div>
</template>

<script>
import treeTransfer from "el-tree-transfer";
import { getCity } from "@/api/common";
export default {
    components: { treeTransfer },
    data() {
        return {
            title: ["未选择城市", "已选择城市"],
            mode: "transfer", // transfer addressList
            fromData: [],
            toData: [],
            props: {
                label: "cityname",
                isLeaf: (data, node) => {
                    return data.type == 3;
                }
            }
        };
    },
    async created() {
        await getCity().then(res => {
            this.fromData = res.data;
        });
        console.log(this.fromData)
    },
    methods: {
        // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
        changeMode() {
            if (this.mode == "transfer") {
                this.mode = "addressList";
            } else {
                this.mode = "transfer";
            }
        },
        loadNode(node, resolve, type) {
            if (
                type === "left" ||
                (node.data.type != 3 && !node.data.children)
            ) {
                console.log("加载子级");
                getCity(node.data.id).then(res => {
                    resolve(res.data);
                });
            } else if (node.data.children) {
                console.log("显示子级");
                resolve(node.data.children);
            } else {
                console.log("已经是底层");
                resolve([]);
            }
        },
        // 监听穿梭框组件添加
        add(fromData, toData, obj) {
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
        },
        // 监听穿梭框组件移除
        remove(fromData, toData, obj) {
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
        }
    }
};
</script>

<style>
</style>
