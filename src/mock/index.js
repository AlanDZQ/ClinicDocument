/**
 * Created by Zwh on 2017/10/14.
 */
import Mock from 'mockjs'
import { test } from './test.js'
import {login} from './login.js'
import {manageTemplate} from './admin/template'
import userAPI from './admin/user'
import {category} from './admin/category'

import {template} from './app/template'
let data = []
// 管理员
data = data.concat(test)
data = data.concat(login)
data = data.concat(manageTemplate)
data = data.concat(category)
// 用户管理相关
Mock.mock(/\/user\/list/, 'get', userAPI.getList)
Mock.mock(/\/user\/create/, 'post', userAPI.createUser)
Mock.mock(/\/user\/update/, 'post', userAPI.updateUser)
Mock.mock(/\/user\/delete/, 'delete', userAPI.deleteUser)

// 用户端
data = data.concat(template)

// data = []

data.forEach((res) => {
  Mock.mock(res.path, res.type, res.data)
})
