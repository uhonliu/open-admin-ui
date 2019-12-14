import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'

export const TOKEN_KEY = 'token'

export const setToken = (token, auto) => {
  if (auto) {
    Cookies.set(TOKEN_KEY, token, { expires: config.cookieExpires || 1 })
  } else {
    Cookies.set(TOKEN_KEY, token)
  }
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token && token !== 'undefined') {
    return token
  } else {
    return false
  }
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @param access
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let meta = { ...item.meta }
    if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route)
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = { ...route }
  let meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      title = meta.title(router)
    } else {
      title = meta.title
    }
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let title = item.meta.title
  if (vm.$config.useI18n) {
    if (title.includes('{{') && title.includes('}}') && vm.$config.useI18n) {
      title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    } else {
      title = vm.$t(item.name)
    }
  } else {
    title = (item.meta && item.meta.title) || item.name
  }
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @param homeName
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) {
    return newList
  } else {
    newList.push({ name, path, meta })
  }
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) {
    return hasOneOf(access, route.meta.access)
  } else {
    return true
  }
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }
  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  let paramObj = {}
  if (url.indexOf('?') !== -1) {
    const keyValueArr = url.split('?')[1].split('&')
    keyValueArr.forEach(item => {
      const keyValue = item.split('=')
      paramObj[keyValue[0]] = keyValue[1]
    })
  }
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} route 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) {
      res = list[list.length - 2]
    } else {
      res = list[index + 1]
    }
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') {
        resolve(arr)
      } else {
        reject(new Error('[Format Error]:你上传的不是Csv文件'))
      }
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) {
        return child
      } else {
        return findNodeDownward(child, tag)
      }
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}

/**
 *  验证url
 * @param url
 * @returns {boolean}
 */
export const isURL = (url) => {
  let strRegex = '((https|http|ftp|rtsp|mms)?://)'
  let re = new RegExp(strRegex)
  return re.test(url)
}

/**
 * 格式化路由菜单
 * @param array
 * @param access
 * @returns {Array}
 */
export const formatRouters = (array, access) => {
  let opt = {
    primaryKey: 'menuId',
    parentKey: 'parentId',
    startPid: '0'
  }
  let menus = listConvertTree(array, opt)
  let routers = filterRouter(menus, access, [])
  const error_404 = {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
  // 放到最后
  routers.push(error_404)
  return routers
}

export const filterRouter = (array, access, routers) => {
  let list = array.map(item => {
    let path = startWith(item.path, '/') ? item.path.substring(1) : item.path
    let url = item.scheme + item.path
    let router = {
      // 使用菜单id不使用menuCode防止修改后,刷新后缓存的页面无法找到
      name: `${item.menuCode}`,
      path: url,
      meta: {
        access: access,
        hideInMenu: false,
        title: item.menuName,
        notCache: true,
        icon: item.icon || 'md-document',
        hideInBread: false
      },
      children: []
    }
    if (item.parentId === 0 || item.parentId === '0') {
      // 根节点
      router.path = '/'
      router.component = (resolve) => {
        require(['_c/main'], resolve)
      }
      if (!hasChild(item)) {
        // 非根节点
        if (item.target === '_blank') {
          // 新窗口打开,使用meta.href
          router.meta.href = url
        } else {
          if (item.scheme === '/') {
            // 内部组件
            router.component = (resolve) => {
              require([`@/view/module/${path}.vue`], resolve)
            }
          } else {
            // 传递iframe路径参数
            router.path = `/iframe?src=${encodeURIComponent(url)}`
            // frame组件
            router.component = (resolve) => {
              require([`_c/iframe-view`], resolve)
            }
          }
        }
      }
    } else {
      // 多级菜单
      if (hasChild(item)) {
        router.component = (resolve) => {
          require(['_c/parent-view'], resolve)
        }
      } else {
        // 非根节点
        if (item.target === '_blank') {
          // 新窗口打开,使用meta.href
          router.meta.href = url
        } else {
          if (item.scheme === '/') {
            // 内部组件
            router.component = (resolve) => {
              require([`@/view/module/${path}.vue`], resolve)
            }
          } else {
            // 传递iframe路径参数
            router.path = `/iframe?src=${encodeURIComponent(url)}`
            // frame组件
            router.component = (resolve) => {
              require([`_c/iframe-view`], resolve)
            }
          }
        }
      }
    }
    if (hasChild(item)) {
      router.children.push(...filterRouter(item.children, access, []))
    }
    return router
  })
  routers.push(...list)
  return routers
}

/**
 * 将普通列表无限递归转换为树
 * @param  {[type]} array       [普通的列表，必须包括 opt.primaryKey 指定的键和 opt.parentKey 指定的键]
 * @param {[type]} opt [配置参数，支持 primaryKey(主键 默认id) parentKey(父级id对应键 默认pid) nameKey(节点标题对应的key 默认name) valueKey(节点值对应的key 默认id) checkedKey(节点是否选中的字段 默认checked，传入数组则判断主键是否在此数组中) startPid(第一层扫描的PID 默认0) currentDept(当前层 默认0) maxDept(最大递归层 默认100) childKey(递归完成后子节点对应键 默认list) deptPrefix(根据层级重复的前缀 默认'')]
 * @return {[type]}            [description]
 */
export const listConvertTree = (array, opt) => {
  let obj = {
    primaryKey: opt.primaryKey || 'id',
    parentKey: opt.parentKey || 'pid',
    startPid: opt.startPid || 0,
    currentDept: opt.currentDept || 0,
    maxDept: opt.maxDept || 100,
    childKey: opt.childKey || 'children'
  }
  return listToTree(array, obj.startPid, obj.currentDept, obj)
}

export const listConvertGroup = (array, groupKey) => {
  let map = {}
  let dest = []
  for (var i = 0; i < array.length; i++) {
    var ai = array[i]
    if (!map[ai[groupKey]]) {
      const obj = {}
      obj[groupKey] = ai[groupKey]
      obj['children'] = [ai]
      dest.push(obj)
      map[ai[groupKey]] = ai
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j]
        if (dj[groupKey] === ai[groupKey]) {
          dj['children'].push(ai)
          break
        }
      }
    }
  }
  return dest
}

export const updateTreeNode = (nodes, primaryKey, value, data) => {
  const update = (list) => {
    return list.some(item => {
      if (item[primaryKey] && item[primaryKey] === value) {
        Object.assign(item, data)
        return true
      } else if (item.children && item.children.length > 0) {
        return update(item.children)
      } else {
        return false
      }
    })
  }
  return update(nodes)
}

/**
 *  实际的递归函数，将会变化的参数抽取出来
 * @param array
 * @param startPid
 * @param currentDept
 * @param opt
 * @returns {Array}
 */
export const listToTree = (array, startPid, currentDept, opt) => {
  if (opt.maxDept < currentDept) {
    return []
  }
  let child = []
  if (array && array.length > 0) {
    child = array.map(item => {
      // 筛查符合条件的数据（主键 = startPid）
      if (typeof item[opt.parentKey] !== 'undefined' && item[opt.parentKey] === startPid) {
        // 满足条件则递归
        let nextChild = listToTree(array, item[opt.primaryKey], currentDept + 1, opt)
        // 节点信息保存
        if (nextChild.length > 0) {
          item['hasChild'] = true
          item[opt.childKey] = nextChild
        } else {
          item['hasChild'] = false
        }
        return item
      }
    }).filter(item => {
      return item !== undefined
    })
  }
  return child
}

export const startWith = (str, prefix) => {
  let reg = new RegExp('^' + prefix)
  return reg.test(str)
}

export const endWith = (str, suffix) => {
  let reg = new RegExp(suffix + '$')
  return reg.test(str)
}

/**
 * 判断终端以及浏览器
 * userAgent string User-Agent信息
 */
export const readUserAgent = (ua) => {
  let data = {
    terminal: '',
    browser: '',
    terminalType: {}
  }
  data.terminalType = {
    trident: ua.indexOf('Trident') > -1, // IE内核
    presto: ua.indexOf('Presto') > -1, // opera内核
    webKit: ua.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!ua.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1, // android终端
    iPhone: ua.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: ua.indexOf('iPad') > -1, // 是否iPad
    webApp: ua.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
    weixin: ua.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    qq: ua.match(/\sQQ/i) === ' qq' // 是否QQ
  }
  if (data.terminalType.ios || data.terminalType.iPhone || data.terminalType.iPad) {
    data.terminal = '苹果'
  } else if (data.terminalType.android) {
    data.terminal = '安卓'
  } else {
    data.terminal = 'PC'
  }
  if (/msie/i.test(ua) && !/opera/.test(ua)) {
    data.browser = 'IE'
  } else if (/firefox/i.test(ua)) {
    data.browser = 'Firefox'
  } else if (/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua)) {
    data.browser = 'Chrome'
  } else if (/opera/i.test(ua)) {
    data.browser = 'Opera'
  } else if (/iPad/i.test(ua)) {
    data.browser = 'iPad'
  } else if (/webkit/i.test(ua) && !(/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua))) {
    data.browser = 'Safari'
  } else {
    data.browser = '未知'
  }
  return data
}
