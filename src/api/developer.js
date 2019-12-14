import request from '@/libs/request'

/**
 * 获取开发者列表
 * @param params
 */
export const getDevelopers = (params) => {
  return request({
    url: 'base/developer',
    params,
    method: 'get'
  })
}

/**
 * 获取所有开发者列表
 */
export const getAllDevelopers = () => {
  return request({
    url: 'base/developer/all',
    method: 'get'
  })
}

/**
 * 添加开发者信息
 * @param userName
 * @param password
 * @param nickName
 * @param status
 * @param userType
 * @param email
 * @param mobile
 * @param userDesc
 * @param avatar
 */
export const addDeveloper = ({ userName, password, nickName, status, userType, email, mobile, userDesc, avatar }) => {
  const data = {
    userName: userName,
    nickName: nickName,
    password: password,
    status: status,
    userType: userType,
    email: email,
    mobile: mobile,
    userDesc: userDesc,
    avatar: avatar
  }
  return request({
    url: 'base/developer/add',
    data,
    method: 'post'
  })
}

/**
 * 更新开发者信息
 * @param developerId
 * @param nickName
 * @param status
 * @param email
 * @param mobile
 * @param avatar
 */
export const updateDeveloper = ({ userId, nickName, status, userType, email, mobile, userDesc, avatar }) => {
  const data = {
    userId: userId,
    nickName: nickName,
    status: status,
    userType: userType,
    email: email,
    mobile: mobile,
    userDesc: userDesc,
    avatar: avatar
  }
  return request({
    url: 'base/developer/update',
    data,
    method: 'post'
  })
}

/**
 * 修改密码
 * @param developerId
 */
export const updatePassword = ({ userId, password }) => {
  const data = {
    userId: userId,
    password: password
  }
  return request({
    url: 'base/developer/update/password',
    data,
    method: 'post'
  })
}
