import { login, logout, getUserInfo, getCurrentUserMenu } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    nickName: '',
    avatarImgPath: '',
    token: getToken(),
    access: [],
    hasGetInfo: false,
    userDesc: '',
    mobile: '',
    email: '',
    menus: []// 用户菜单
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setNickName (state, nickName) {
      state.nickName = nickName
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, { token, auto }) {
      state.token = token
      setToken(token, auto)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setUserMenus (state, menus) {
      state.menus = menus
    },
    setMobile (state, mobile) {
      state.mobile = mobile
    },
    setEmail (state, email) {
      state.email = email
    },
    setUserDesc (state, userDesc) {
      state.userDesc = userDesc
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password, auto }) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          if (res) {
            if (res.code === 0) {
              let token = res.data.access_token
              commit('setToken', { token, auto })
              resolve(res)
            }
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogout ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          commit('setToken', '')
          commit('setAccess', [])
          commit('setHasGetInfo', false)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          if (res.code === 0) {
            commit('setAvatar', res.data.avatar)
            commit('setUserName', res.data.username)
            commit('setNickName', res.data.nickName)
            commit('setUserId', res.data.userId)
            commit('setEmail', res.data.email)
            commit('setMobile', res.data.mobile)
            commit('setUserDesc', res.data.userDesc)
            const access = []
            if (res.data.authorities) {
              res.data.authorities.map(item => {
                if (item.authority) {
                  access.push(item.authority)
                }
              })
            }
            // 转换权限
            commit('setAccess', access)
            commit('setHasGetInfo', true)
            getCurrentUserMenu().then(res => {
              if (res.code === 0) {
                commit('setUserMenus', res.data)
                resolve(state)
              }
            }).catch(err => {
              reject(err)
            })
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
