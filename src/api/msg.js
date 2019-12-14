import request from '@/libs/request'

/**
 * 获取应用列表
 * @param page
 * @param limit
 * @param url
 * @param type
 * @param result
 */
export const getNotifyHttpLogs = ({ page, limit, url, type, result }) => {
  const params = { page: page, limit: limit, url: url, type: type, result: result }
  return request({
    url: 'msg/webhook/logs',
    params,
    method: 'get'
  })
}
