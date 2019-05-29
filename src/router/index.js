import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
    { path: '/login', component: () => import('@/views/login/index'), hidden: true },
    { path: '/404', component: () => import('@/views/404'), hidden: true },
    {
        path: '',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'home',
            component: () => import('@/views/home/index'),
            meta: { title: '首页', icon: 'sy' }
        }]
    },
    {
        path: '/system',
        component: Layout,
        redirect: '/system/CurriculumType',
        name: 'system',
        meta: { title: '系统设置', icon: 'xt2' },
        children: [{
            path: 'CurriculumType',
            name: 'CurriculumType',
            component: () => import('@/views/system/curriculumType/index'),
            meta: { title: '分类管理', icon: 'xt2' }
        }, {
            path: 'setBasic',
            name: 'setBasic',
            component: () => import('@/views/system/setBasic/index'),
            meta: { title: '基础设置', icon: 'xt2' }
        }],
    },
    {
        path: '/giftCard',
        component: Layout,
        redirect: '/giftCard/giftCardList',
        name: 'giftCard',
        // component: () => import('@/views/system/giftCard/index'),
        meta: { title: '礼品卡管理', icon: 'lipins' },
        children: [{
            path: 'giftCardList',
            name: 'giftCardList',
            component: () => import('@/views/giftCard/index'),
            meta: { title: '礼品卡列表', icon: 'lipins' }
        }, {
            path: 'giftCardAdd',
            name: 'giftCardAdd',
            component: () => import('@/views/giftCard/add'),
            meta: { title: '礼品卡添加', icon: 'lipins' }
        }]
    }
    ///////////////////////////////////////////////////////
    ,
    {
        path: '/underLine',
        component: Layout,
        redirect: '/underLine/giftCardList',
        name: 'underLine',
        // component: () => import('@/views/system/giftCard/index'),
        meta: { title: '线下活动管理', icon: 'xianxia' },
        children: [{
            path: 'underLineAdd',
            name: 'underLineAdd',
            component: () => import('@/views/underLine/add'),
            meta: { title: '线下活动添加', icon: 'xianxia' }
        }, {
            path: 'giftCardshow',
            name: 'giftCardshow',
            component: () => import('@/views/underLine/show'),
            meta: { title: '线下管理展示', icon: 'xianxia' }
        }]
    }
    ////////////////////////////////////////////////////
    ,
    {
        path: '/user',
        component: Layout,
        redirect: '/user/getUserList',
        name: 'user',
        // component: () => import('@/views/system/giftCard/index'),
        meta: { title: '用户列表管理', icon: 'userlist' },
        children: [{
            path: 'giftCardshow',
            name: 'giftCardshow',

            component: () => import('@/views/user/show.vue'),
            meta: { title: '用户列表展示', icon: 'userlist' }
        }]
    },
    { path: '*', redirect: '/404', hidden: true },
    {
        path: '/oms',
        component: Layout,
        redirect: '/oms/order',
        name: 'oms',
        meta: { title: '基础设置', icon: 'order' },
        children: [
            {
                path: 'vipSet',
                name: 'vipSet',
                component: () => import('@/views/basicsSetup/vipSet'),
                meta: { title: 'vip设置', icon: 'product-list' }
            },
            {
                path: 'banner',
                name: 'banner',
                component: () => import('@/views/basicsSetup/banner'),
                meta: { title: 'banner管理', icon: 'product-list' }
            },
            {
                path: 'order',
                name: 'order',
                component: () => import('@/views/oms/order/index'),
                meta: { title: '订单列表', icon: 'product-list' }
            },
            {
                path: 'orderDetail',
                name: 'orderDetail',
                component: () => import('@/views/oms/order/orderDetail'),
                meta: { title: '订单详情' },
                hidden: true
            },
            {
                path: 'deliverOrderList',
                name: 'deliverOrderList',
                component: () => import('@/views/oms/order/deliverOrderList'),
                meta: { title: '发货列表' },
                hidden: true
            },
            {
                path: 'orderSetting',
                name: 'orderSetting',
                component: () => import('@/views/oms/order/setting'),
                meta: { title: '订单设置', icon: 'order-setting' }
            },
            {
                path: 'returnApply',
                name: 'returnApply',
                component: () => import('@/views/oms/apply/index'),
                meta: { title: '退货申请处理', icon: 'order-return' }
            },
            {
                path: 'returnReason',
                name: 'returnReason',
                component: () => import('@/views/oms/apply/reason'),
                meta: { title: '退货原因设置', icon: 'order-return-reason' }
            },
            {
                path: 'returnApplyDetail',
                name: 'returnApplyDetail',
                component: () => import('@/views/oms/apply/applyDetail'),
                meta: { title: '退货原因详情' },
                hidden: true
            }
        ]
    },
    {
        path: '/courseManagement',
        component: Layout,
        redirect: '/sms/coupon',
        name: 'sms',
        meta: { title: '课程管理', icon: 'sms' },
        children: [
            {
                path: 'showList',
                name: 'showList',
                component: () => import('@/views/courseManagement/showList'),
                meta: { title: '课程列表', icon: 'sms-flash' }
            },
            {
                path: 'flashSession',
                name: 'flashSession',
                component: () => import('@/views/sms/flash/sessionList'),
                meta: { title: '秒杀时间段列表' },
                hidden: true
            },
            {
                path: 'selectSession',
                name: 'selectSession',
                component: () => import('@/views/sms/flash/selectSessionList'),
                meta: { title: '秒杀时间段选择' },
                hidden: true
            },
            {
                path: 'flashProductRelation',
                name: 'flashProductRelation',
                component: () => import('@/views/sms/flash/productRelationList'),
                meta: { title: '秒杀商品列表' },
                hidden: true
            },
            {
                path: 'coupon',
                name: 'coupon',
                component: () => import('@/views/sms/coupon/index'),
                meta: { title: '优惠券列表', icon: 'sms-coupon' }
            },
            {
                path: 'addCoupon',
                name: 'addCoupon',
                component: () => import('@/views/sms/coupon/add'),
                meta: { title: '添加优惠券' },
                hidden: true
            },
            {
                path: 'updateCoupon',
                name: 'updateCoupon',
                component: () => import('@/views/sms/coupon/update'),
                meta: { title: '修改优惠券' },
                hidden: true
            },
            {
                path: 'couponHistory',
                name: 'couponHistory',
                component: () => import('@/views/sms/coupon/history'),
                meta: { title: '优惠券领取详情' },
                hidden: true
            },
            {
                path: 'brand',
                name: 'homeBrand',
                component: () => import('@/views/sms/brand/index'),
                meta: { title: '品牌推荐', icon: 'product-brand' }
            },
            {
                path: 'new',
                name: 'homeNew',
                component: () => import('@/views/sms/new/index'),
                meta: { title: '新品推荐', icon: 'sms-new' }
            },
            {
                path: 'hot',
                name: 'homeHot',
                component: () => import('@/views/sms/hot/index'),
                meta: { title: '人气推荐', icon: 'sms-hot' }
            },
            {
                path: 'subject',
                name: 'homeSubject',
                component: () => import('@/views/sms/subject/index'),
                meta: { title: '专题推荐', icon: 'sms-subject' }
            },
            {
                path: 'advertise',
                name: 'homeAdvertise',
                component: () => import('@/views/sms/advertise/index'),
                meta: { title: '广告列表', icon: 'sms-ad' }
            },
            {
                path: 'addAdvertise',
                name: 'addHomeAdvertise',
                component: () => import('@/views/sms/advertise/add'),
                meta: { title: '添加广告' },
                hidden: true
            }
        ]
    },
    {
        path: '/messageManagement',
        component: Layout,
        name: 'messageManagement',
        redirect: '/sms/coupon',
        meta: { title: '消息管理', icon: 'sms' },
        children: [
            {
                path: 'messageRelease',
                name: 'messageRelease',
                component: () => import('@/views/messageManagement/messageRelease'),
                meta: { title: '消息发布', icon: 'sms-flash' }
            },
            {
                path: 'messageList',
                name: 'messageList',
                component: () => import('@/views/messageManagement/messageList'),
                meta: { title: '消息列表', icon: 'sms-flash' }
            }
        ]
    },
    { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

