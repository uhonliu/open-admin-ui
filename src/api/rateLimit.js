import request from '@/libs/request'

/**
 * 获取分页接口列表
 * @param page
 * @param limit
 */
export const getRateLimits = ({ page, limit }) => {
  const params = { page: page, limit: limit }
  return request({
    url: 'base/gateway/limit/rate',
    params,
    method: 'get'
  })
}

export const addRateLimit = ({ policyName, policyType, limitQuota, intervalUnit }) => {
  const data = {
    policyName: policyName,
    policyType: policyType,
    limitQuota: limitQuota,
    intervalUnit: intervalUnit
  }
  return request({
    url: 'base/gateway/limit/rate/add',
    data,
    method: 'post'
  })
}

/**
 * 更新IP限制
 * @param policyName
 * @param policyType
 * @param ipAddress
 */
export const updateRateLimit = ({ policyId, policyName, policyType, limitQuota, intervalUnit }) => {
  const data = {
    policyId: policyId,
    policyName: policyName,
    policyType: policyType,
    limitQuota: limitQuota,
    intervalUnit: intervalUnit
  }
  return request({
    url: 'base/gateway/limit/rate/update',
    data,
    method: 'post'
  })
}

/**
 * 删除IP限制
 * @param policyId
 */
export const removeRateLimit = (policyId) => {
  const data = {
    policyId: policyId
  }
  return request({
    url: 'base/gateway/limit/rate/remove',
    data,
    method: 'post'
  })
}

/**
 * 查询策略已绑定API列表
 * @param policyId
 */
export const getRateLimitApis = (policyId) => {
  const params = {
    policyId: policyId
  }
  return request({
    url: 'base/gateway/limit/rate/api/list',
    params,
    method: 'get'
  })
}

/**
 * 绑定API
 * @param policyId
 * @param apiIds
 */
export const addRateLimitApis = ({ policyId, apiIds }) => {
  const data = {
    policyId: policyId,
    apiIds: apiIds.join(',')
  }
  return request({
    url: 'base/gateway/limit/rate/api/add',
    data,
    method: 'post'
  })
}
