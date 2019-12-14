/**
 * 权限管理
 */
import request from '@/libs/request'

/**
 * 获取用户已分配权限
 * @param userId
 */
export const getAuthorityUser = (userId) => {
  const params = {
    userId: userId
  }
  return request({
    url: 'base/authority/user',
    params,
    method: 'get'
  })
}

/**
 * 获取角色已分配权限
 * @param roleId
 */
export const getAuthorityRole = (roleId) => {
  const params = {
    roleId: roleId
  }
  return request({
    url: 'base/authority/role',
    params,
    method: 'get'
  })
}

/**
 * 获取应用已分配权限
 * @param roleId
 */
export const getAuthorityApp = (appId) => {
  const params = {
    appId: appId
  }
  return request({
    url: 'base/authority/app',
    params,
    method: 'get'
  })
}

/**
 * 获取菜单和操作权限列表
 * @param serviceId
 */
export const getAuthorityMenu = () => {
  return request({
    url: 'base/authority/menu',
    method: 'get'
  })
}

/**
 * 获取API权限列表
 * @param serviceId
 */
export const getAuthorityApi = (serviceId) => {
  return request({
    url: 'base/authority/api',
    method: 'get',
    params: {
      serviceId: serviceId
    }
  })
}

export const getAuthorityAction = (actionId) => {
  const params = {
    actionId: actionId
  }
  return request({
    url: 'base/authority/action',
    params,
    method: 'get'
  })
}

/**
 * 用户授权
 * @param userId
 */
export const grantAuthorityUser = ({ userId, expireTime, authorityIds }) => {
  const data = {
    userId: userId,
    expireTime: expireTime,
    authorityIds: authorityIds.join(',')
  }
  return request({
    url: 'base/authority/user/grant',
    data,
    method: 'post'
  })
}

/**
 * 角色授权
 * @param userId
 */
export const grantAuthorityRole = ({ roleId, expireTime, authorityIds }) => {
  const data = {
    roleId: roleId,
    expireTime: expireTime,
    authorityIds: authorityIds.join(',')
  }
  return request({
    url: 'base/authority/role/grant',
    data,
    method: 'post'
  })
}

/**
 * 应用授权
 * @param userId
 */
export const grantAuthorityApp = ({ appId, expireTime, authorityIds }) => {
  const data = {
    appId: appId,
    expireTime: expireTime,
    authorityIds: authorityIds.join(',')
  }
  return request({
    url: 'base/authority/app/grant',
    data,
    method: 'post'
  })
}

/**
 * 操作功能授权
 * @param actionId
 * @param apiIds
 */
export const grantAuthorityAction = ({ actionId, authorityIds }) => {
  const data = {
    actionId: actionId,
    authorityIds: authorityIds.join(',')
  }
  return request({
    url: 'base/authority/action/grant',
    data,
    method: 'post'
  })
}
