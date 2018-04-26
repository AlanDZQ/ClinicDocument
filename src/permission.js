import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, getUserId } from '@/utils/auth' // 验权

const whiteList = ['/admin/login', '/app/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  let arr = to.path.split('/')
  if (arr[1] === 'app') {
    if (store.getters.userName === '') {
      // alert(1)
      store.dispatch('UserGetInfo').then(res => { // 拉取用户信息
        next()
      }).catch(() => {
        store.dispatch('UserFedLogOut').then(() => {
          Message.error('验证失败,请重新登录')
          next({ path: '/app/login' })
        })
      })
    }
    // if (whiteList.indexOf(to.path) !== -1) {
    //   next()
    // } else {
    //   next()
    // }
    next()
  }
  // next()
  // 管理员页面路由
  if (arr[1] === 'admin') {
    if (getToken()) {
      if (to.path === '/admin/login') {
        next({ path: '/admin' })
      } else {
        if (store.getters.roles.length === 0) {
          store.dispatch('AdminGetInfo').then(res => { // 拉取用户信息
            next()
          }).catch(() => {
            store.dispatch('AdminFedLogOut').then(() => {
              Message.error('验证失败,请重新登录')
              next({ path: '/admin/login' })
            })
          })
        } else {
          next()
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('/admin/login')
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
