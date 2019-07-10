import moment from 'moment';
export const PAYMENT_METHOD = {
    0: '智慧币',
    1: '支付宝',
    2: '微信'
};
 
export const TRANSACTION_TYPE = {
    1: '线下活动',
    2: '充值智慧币',
    3: '礼品卡',
    4: 'vip',
    5: '课程'
};
export const TABLE_LIST_LABEL = [
    {
        label: '编号',
        prop: 'id'
    },
    {
        label: '标签名',
        prop: 'name'
    }
];

export const TABLE_LIST_ORDER = [
    {
        label: '编号',
        prop: 'id'
    },
    {
        label: '用户姓名',
        prop: 'username'
    },
    {
        label: '内容',
        prop: 'name'
    },
    {
        label: '交易类型',
        prop: 'type',
        content(row) {
            return TRANSACTION_TYPE[row.type];
        }
    },
    {
        label: '支付方式',
        prop: 'mentmethod',
        content(row) {
            return PAYMENT_METHOD[row.mentmethod];
        }
    },
    {
        label: '交易金额',
        prop: 'price'
    },
    {
        label: '交易时间',
        prop: 'addTime',
        content(row) {
            return moment(+row.addTime).format('YYYY-MM-DD');
        }
    },
];

export const TABLE_LIST_COLUMN = [
    {
        label: '编号',
        prop: 'id'
    },
    {
        label: '标题',
        prop: 'name'
    },
    {
        label: '是否可领取',
        prop: 'isReceive',
        content (row) {
            return row.isReceive ? '可领取' : '不可领取';
        }
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
]