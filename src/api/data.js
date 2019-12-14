import request from '@/libs/request'

/**
 * 保存错误日志
 * @param info
 */
export const saveErrorLogger = info => {
  return request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}
