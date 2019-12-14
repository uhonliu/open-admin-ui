import request from '@/libs/request'

/**
 * 获取应用列表
 * @param page
 * @param limit
 * @param appId
 * @param appName
 * @param appNameEn
 */
export const getApps = ({ page, limit, appId, appName, appNameEn }) => {
  const params = { page: page, limit: limit, appId: appId, appName: appName, appNameEn: appNameEn }
  return request({
    url: 'base/app',
    params,
    method: 'get'
  })
}

/**
 * 添加应用信息
 * @param appName
 * @param appNameEn
 * @param appType
 * @param appIcon
 * @param appOs
 * @param appDesc
 * @param status
 * @param website
 * @param userId
 */
export const addApp = ({ appName, appNameEn, appType, appIcon, appOs, appDesc, status, website, developerId }) => {
  const data = {
    appName: appName,
    appNameEn: appNameEn,
    appType: appType,
    appIcon: appIcon,
    appOs: appOs,
    appDesc: appDesc,
    status: status,
    website: website,
    developerId: developerId
  }
  return request({
    url: 'base/app/add',
    data,
    method: 'post'
  })
}

/**
 * 更新应用信息
 * @param appId
 * @param appName
 * @param appNameEn
 * @param appType
 * @param appIcon
 * @param appOs
 * @param appDesc
 * @param status
 * @param website
 * @param userId
 */
export const updateApp = ({ appId, appName, appNameEn, appType, appIcon, appOs, appDesc, status, website, developerId }) => {
  const data = {
    appId: appId,
    appName: appName,
    appNameEn: appNameEn,
    appType: appType,
    appIcon: appIcon,
    appOs: appOs,
    appDesc: appDesc,
    status: status,
    website: website,
    developerId: developerId
  }
  return request({
    url: 'base/app/update',
    data,
    method: 'post'
  })
}

/**
 * 完善应用开发信息
 * @param appId
 * @param grantTypes
 * @param redirectUrls
 * @param scopes
 * @param accessTokenValidity
 * @param refreshTokenValidity
 * @param autoApproveScopes
 */
export const updateAppClientInfo = ({ appId, grantTypes, redirectUrls, scopes, accessTokenValidity, refreshTokenValidity, autoApproveScopes }) => {
  const data = {
    appId: appId,
    grantTypes: grantTypes.join(','),
    redirectUrls: redirectUrls,
    scopes: scopes.join(','),
    accessTokenValidity: accessTokenValidity,
    refreshTokenValidity: refreshTokenValidity,
    autoApproveScopes: autoApproveScopes.join(',')
  }
  return request({
    url: 'base/app/client/update',
    data,
    method: 'post'
  })
}

/**
 * 删除应用
 * @param appId
 */
export const removeApp = ({ appId }) => {
  const data = {
    appId: appId
  }
  return request({
    url: 'base/app/remove',
    data,
    method: 'post'
  })
}

/**
 * 重置秘钥
 * @param appId
 */
export const restApp = ({ appId }) => {
  const data = {
    appId: appId
  }
  return request({
    url: 'base/app/reset',
    data,
    method: 'post'
  })
}

/**
 * 获取应用信息
 * @param appId
 */
export const getAppInfo = ({ appId }) => {
  return request({
    url: `base/app/${appId}/info`,
    method: 'get'
  })
}

/**
 * 获取应用开发信息
 * @param clientId
 */
export const getAppClientInfo = ({ clientId }) => {
  return request({
    url: `base/app/client/${clientId}/info`,
    method: 'get'
  })
}
