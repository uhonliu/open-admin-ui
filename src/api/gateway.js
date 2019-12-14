import request from '@/libs/request'

export const refreshGateway = () => {
  const data = {}
  return request({
    url: 'actuator/open/refresh',
    data,
    method: 'post'
  })
}

export const getAccessLogs = ({ page, limit, path, ip, serviceId }) => {
  const params = { page: page, limit: limit, path: path, ip: ip, serviceId: serviceId }
  return request({
    url: 'base/gateway/access/logs',
    params,
    method: 'get'
  })
}

/**
 * 获取服务列表
 */
export const getServiceList = () => {
  return request({
    url: 'base/gateway/service/list',
    method: 'get'
  })
}
