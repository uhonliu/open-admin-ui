import request from '@/libs/request'

/**
 * 获取接口列表
 * @param page
 * @param limit
 * @param path
 * @param apiName
 * @param apiCode
 * @param serviceId
 */
export const getApis = ({ page, limit, path, apiName, apiCode, serviceId }) => {
  const params = { page: page, limit: limit, path: path, apiName: apiName, apiCode: apiCode, serviceId: serviceId }
  return request({
    url: 'base/api',
    params,
    method: 'get'
  })
}

/**
 * 获取所有接口
 */
export const getAllApi = (serviceId) => {
  const params = { serviceId: serviceId }
  return request({
    url: 'base/api/all',
    params: params,
    method: 'get'
  })
}

/**
 * 添加接口
 * @param apiCode
 * @param apiName
 * @param apiCategory
 * @param serviceId
 * @param path
 * @param status
 * @param priority
 * @param apiDesc
 * @param isAuth
 * @param isOpen
 */
export const addApi = ({ apiCode, apiName, apiCategory, serviceId, path, status, priority, apiDesc, isAuth, isOpen }) => {
  const data = {
    apiCode: apiCode,
    apiName: apiName,
    apiCategory: apiCategory,
    serviceId: serviceId,
    path: path,
    status: status,
    priority: priority,
    apiDesc: apiDesc,
    isAuth: isAuth,
    isOpen: isOpen
  }
  return request({
    url: 'base/api/add',
    data,
    method: 'post'
  })
}

/**
 * 更新接口
 * @param apiId
 * @param apiCode
 * @param apiName
 * @param apiCategory
 * @param serviceId
 * @param path
 * @param status
 * @param priority
 * @param apiDesc
 * @param isAuth
 * @param isOpen
 */
export const updateApi = ({ apiId, apiCode, apiName, apiCategory, serviceId, path, status, priority, apiDesc, isAuth, isOpen }) => {
  const data = {
    apiId: apiId,
    apiCode: apiCode,
    apiName: apiName,
    apiCategory: apiCategory,
    serviceId: serviceId,
    path: path,
    status: status,
    priority: priority,
    apiDesc: apiDesc,
    isAuth: isAuth,
    isOpen: isOpen
  }
  return request({
    url: 'base/api/update',
    data,
    method: 'post'
  })
}

/**
 * 删除接口
 * @param apiId
 */
export const removeApi = (apiId) => {
  const data = {
    apiId: apiId
  }
  return request({
    url: 'base/api/remove',
    data,
    method: 'post'
  })
}

/**
 * 批量删除
 * @param ids
 */
export const batchRemoveApi = (ids) => {
  const data = {
    ids: ids.join(',')
  }
  return request({
    url: 'base/api/batch/remove',
    data,
    method: 'post'
  })
}

/**
 * 批量修改公开状态
 * @param ids
 * @param open
 */
export const batchUpdateOpenApi = ({ ids, open }) => {
  const data = {
    ids: ids.join(','),
    open: open
  }
  return request({
    url: 'base/api/batch/update/open',
    data,
    method: 'post'
  })
}

/**
 * 批量修改状态
 * @param ids
 * @param status
 */
export const batchUpdateStatusApi = ({ ids, status }) => {
  const data = {
    ids: ids.join(','),
    status: status
  }
  return request({
    url: 'base/api/batch/update/status',
    data,
    method: 'post'
  })
}

/**
 * 批量修改身份认证
 * @param ids
 * @param auth
 */
export const batchUpdateAuthApi = ({ ids, auth }) => {
  const data = {
    ids: ids.join(','),
    auth: auth
  }
  return request({
    url: 'base/api/batch/update/auth',
    data,
    method: 'post'
  })
}
