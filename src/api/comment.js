import request from '@/libs/request'

// 分页获取评论
export const getCommentList = (params) => {
  const data = params
  return request({
    url: 'comment/comment/admin/list',
    data,
    method: 'post'
  })
}

// 批量审核评论
export const adoptComment = (params) => {
  const data = params
  return request({
    url: 'comment/comment/batch/audited',
    data,
    method: 'post'
  })
}

// 批量屏蔽评论
export const shieldComment = (params) => {
  const data = params
  return request({
    url: 'comment/comment/batch/shield',
    data,
    method: 'post'
  })
}

// 批量屏蔽回复
export const shieldReply = (params) => {
  const data = params
  return request({
    url: 'comment/reply/batch/shield',
    data,
    method: 'post'
  })
}

// 置顶评论
export const setCommentTop = (params) => {
  const data = params
  return request({
    url: 'comment/comment/setTop',
    data,
    method: 'post'
  })
}

// 回复评论
export const commentReply = (params) => {
  const data = params
  return request({
    url: 'comment/comment/batch/reply',
    data,
    method: 'post'
  })
}

// 获取评论下的回复(后台)
export const getReplyInfo = (data) => {
  let params = data
  return request({
    url: 'comment/reply/admin/replies',
    params,
    method: 'get'
  })
}
