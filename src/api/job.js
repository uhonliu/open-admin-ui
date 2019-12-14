import request from '@/libs/request'

/**
 * 任务执行日志
 * @param page
 * @param limit
 * @param jobName
 */
export const getJobLogs = ({ page, limit, jobName }) => {
  const params = { page: page, limit: limit, jobName: jobName }
  return request({
    url: 'task/job/logs',
    params,
    method: 'get'
  })
}

/**
 * 获取任务列表
 * @param page
 * @param limit
 */
export const getJobs = ({ page, limit }) => {
  const params = { page: page, limit: limit }
  return request({
    url: 'task/job',
    params,
    method: 'get'
  })
}

/**
 * 添加任务
 * @param data
 */
export const addHttpJob = (data) => {
  return request({
    url: 'task/job/add/http',
    data,
    method: 'post'
  })
}

/**
 * 更新任务
 * @param data
 */
export const updateHttpJob = (data) => {
  return request({
    url: 'task/job/update/http',
    data,
    method: 'post'
  })
}

/**
 * 删除任务
 * @param jobName
 */
export const removeJob = (jobName) => {
  const data = {
    jobName: jobName
  }
  return request({
    url: 'task/job/delete',
    data,
    method: 'post'
  })
}

/**
 * 暂停任务
 * @param jobName
 */
export const pauseJob = (jobName) => {
  const data = {
    jobName: jobName
  }
  return request({
    url: 'task/job/pause',
    data,
    method: 'post'
  })
}

/**
 * 恢复任务
 * @param jobName
 */
export const resumeJob = (jobName) => {
  const data = {
    jobName: jobName
  }
  return request({
    url: 'task/job/resume',
    data,
    method: 'post'
  })
}
