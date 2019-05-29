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
    },{
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
      children:[{
        path: 'giftCardList',
        name: 'giftCardList',
        component: () => import('@/views/giftCard/index'),
        meta: { title: '礼品卡列表', icon: 'lipins' }
      },{
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
      children:[{
        path: 'underLineAdd',
        name: 'underLineAdd',
        component: () => import('@/views/underLine/add'),
        meta: { title: '线下活动添加', icon: 'xianxia' }
      },{
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
      children:[{
        path: 'giftCardshow',
        name: 'giftCardshow',
        
        component: () => import('@/views/user/show.vue'), 
        meta: { title: '用户列表展示', icon: 'userlist' }
      }]
    }
,
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

