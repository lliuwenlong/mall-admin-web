import moment from 'moment';
export const TABLE_LIST_COLUMN = [
    {
        label: '编号',
        prop: 'id'
    },
    {
        label: '名字',
        prop: 'title'
    },
    {
        label: '分类',
        prop: 'typeName'
    },
    {
        label: '价钱',
        prop: 'price'
    },
    {
        label: '添加时间',
        prop: 'addtime'
    }
];

export const TABLE_CRRICULUM_LIST = [
    {
        label: '编号',
        prop: 'id'
    },
    {
        label: '名字',
        prop: 'title'
    },
    {
        label: '添加时间',
        prop: 'addtime'
    }
];
export const LEVEL_TYPE = {
    1: '低级课程',
    2: '中级课程',
    3: '高级课程'
};
export const BUYING_COURSES_LIST = [
    {
        label: '编号',
        prop: 'order_id'
    },
    {
        label: '课程名称',
        prop: 'title'
    },
    {
        label: '购买人姓名',
        prop: 'name'
    },
    {
        label: '购买人昵称',
        prop: 'username'
    },
    {
        label: '联系方式',
        prop: 'tel'
    },
    {
        label: '购买时间',
        prop: 'addtime',
        content (row) {
            return moment(+(row.addtime)).format('YYYY-MM-DD')
        }
    },
    {
        label: '套餐类型',
        prop: 'level',
        content (row) {
            return LEVEL_TYPE[+row.level] ?  LEVEL_TYPE[row.level] : '无套餐课程';
        }
    }
];