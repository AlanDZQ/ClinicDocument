import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/App/HelloWorld'
import Home from '../views/App/home.vue'
import Layout from '../views/Admin/layout/Layout'

Vue.use(Router)
/* Layout */

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  // {
  //   path: '/admin/test',
  //   component: resolve => require(['@/components/Admin/parent.vue'], resolve)
  // },
  {
    path: '/',
    redirect: '/app/login'
  },
  {
    path: '/app/login', component: () => import('@/views/App/Login.vue'), hidden: true
  },
  {
    path: '/app/home',
    name: 'Home',
    component: () => import('@/views/App/home.vue')
  },
  {
    path: '/app/template',
    component: () => import('@/views/App/Template/index'),
    name: 'Template'
  },
  // {
  //   path: '/',
  //   component: resolve => require(['@/views/App/home.vue'], resolve),
  //   children: [
  //     {
  //       path: 'template',
  //       component: resolve => require(['@/views/App/Template/index'], resolve)
  //     }
  //     // {
  //     //   path:'shopping-cart',
  //     //   component: resolve => require(['@/components/App/page/NewShopCart/ShopCart.vue'],resolve)
  //     // }
  //   ]
  // },
  { path: '/admin/login', component: () => import('@/views/Admin/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/home',
    name: 'Home',
    hidden: true,
    children: [{
      path: 'home',
      component: () => import('@/views/Admin/dashboard/index')
    }]
  },

  {
    path: '/admin/user',
    component: Layout,
    redirect: '/admin/user/table',
    name: 'User Management',
    meta: { title: 'User Management', icon: 'user' },
    children: [
      {
        path: 'table',
        name: 'User Management',
        component: () => import('@/views/Admin/userManagement/index'),
        meta: { title: 'User Management', icon: 'user' }
      }
      // {
      //   path: 'tree',
      //   name: 'Tree',
      //   component: () => import('@/views/tree/index'),
      //   meta: { title: 'Tree', icon: 'tree' }
      // }
    ]
  },

  {
    path: '/admin/template',
    component: Layout,
    redirect: '/admin/template/create',
    name: 'Template',
    meta: { title: 'Template', icon: 'example' },
    children: [
      {
        path: 'create',
        name: 'Create Template',
        component: () => import('@/views/Admin/templateManagement/createTemplate'),
        meta: { title: 'Create Template', icon: 'table' }
      },
      {
        path: 'edit',
        name: 'Edit Template',
        component: () => import('@/views/Admin/templateManagement/editTemplate'),
        meta: { title: 'Edit Template', icon: 'form' }
      },
      {
        path: 'editCategory',
        name: 'Edit Category',
        component: () => import('@/views/Admin/templateManagement/editCategory'),
        meta: { title: 'Edit Category', icon: 'tree' }
      }
    ]
  },

  // {
  //   path: '/admin/tinymce',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Create Template',
  //       component: () => import('@/views/components-demo/tinymce'),
  //       meta: { title: 'Create Template', icon: 'form' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
