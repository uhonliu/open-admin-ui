import request from '@/libs/request'

/**
 * 获取表
 * @param page
 * @param limit
 */
const tables = (data) => {
  return request({
    url: 'code/generate/tables',
    data,
    method: 'post'
  })
}

/**
 * 生成并下载
 */
const execute = (data) => {
  if (data.includeTables) {
    data.includeTables = data.includeTables.join(',')
  }
  if (data.tablePrefix) {
    data.tablePrefix = data.tablePrefix.join(',')
  }
  return request({
    url: 'code/generate/execute',
    data,
    method: 'post'
  })
}

const downloadPath = `${request.apiUrl}/code/generate/download`

export default{
  tables,
  execute,
  downloadPath
}
