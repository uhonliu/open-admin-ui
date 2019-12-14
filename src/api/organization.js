import request from '@/libs/request'

/**
 * 获取所有企业信息
 */
export const companyInfo = () => {
  return request({
    url: '/org/company/findAll',
    method: 'get'
  })
}

/**
 * 编辑企业信息
 * @param address 通信地址
 * @param areaId 所在区域ID
 * @param companyId 企业ID
 * @param companyName 企业全称
 * @param companyNameEn  企业英文名
 * @param contact 联系人
 * @param email 电子邮件
 * @param establishedTime 成立时间
 * @param fax 传真
 * @param industryId 所属行业ID
 * @param logo 企业Logo
 * @param natureId  企业性质ID
 * @param phone 电话
 * @param postCode 邮政编码
 * @param profile 公司介绍
 * @param registeredCapital 注册资金
 * @param staffNum 员工人数
 * @param website 公司网址
 */
export const editCompany = ({ address, areaId, companyId, companyName, companyNameEn, contact, email, establishedTime, fax, industryId, logo, natureId, phone, postCode, profile, registeredCapital, staffNum, website }) => {
  const params = { address: address, areaId: areaId, companyId: companyId, companyName: companyName, companyNameEn: companyNameEn, contact: contact, email: email, establishedTime: establishedTime, fax: fax, industryId: industryId, logo: logo, natureId: natureId, phone: phone, postCode: postCode, profile: profile, registeredCapital: registeredCapital, staffNum: staffNum, website: website }
  // export const editCompany = ({ data1 }) => {
  //     const data = { data: JSON.stringify(data1) }
  return request({
    url: '/org/company/update',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 添加企业信息
 * @param address 通信地址
 * @param areaId 所在区域ID
 * @param companyName 企业全称
 * @param companyNameEn  企业英文名
 * @param contact 联系人
 * @param email 电子邮件
 * @param establishedTime 成立时间
 * @param fax 传真
 * @param industryId 所属行业ID
 * @param logo 企业Logo
 * @param natureId  企业性质ID
 * @param phone 电话
 * @param postCode 邮政编码
 * @param profile 公司介绍
 * @param registeredCapital 注册资金
 * @param staffNum 员工人数
 * @param website 公司网址
 */
export const addCompany = ({ address, areaId, companyName, companyNameEn, contact, email, establishedTime, fax, industryId, logo, natureId, phone, postCode, profile, registeredCapital, staffNum, website }) => {
  const params = { address: address, areaId: areaId, companyName: companyName, companyNameEn: companyNameEn, contact: contact, email: email, establishedTime: establishedTime, fax: fax, industryId: industryId, logo: logo, natureId: natureId, phone: phone, postCode: postCode, profile: profile, registeredCapital: registeredCapital, staffNum: staffNum, website: website }
  return request({
    url: '/org/company/add',
    params,
    method: 'post'
  })
}

/**
 * 获取所有部门信息
 */
export const departmentList = (params) => {
  return request({
    url: '/org/department/list',
    params,
    method: 'get'
  })
}

/**
 * 获取所有部门select数据
 * @params companyId 所属企业ID
 * @params departmentId 需要移除部门ID
 */
export const searchDepartmentList = (params) => {
  return request({
    url: '/org/department/select/list',
    params,
    method: 'get'
  })
}

/**
 * 禁用/启用部门信息
 * @param departmentId
 * @param status 状态:0-禁用 1-启用
 */
export const changeDepartmentStatus = ({ departmentId, status }) => {
  const params = { departmentId: departmentId, status: status }
  return request({
    url: '/org/department/status',
    params,
    method: 'post'
  })
}

/**
 * 编辑部门信息
 * @param companyId 所属企业ID
 * @param departmentCode 部门代码
 * @params departmentId 部门ID
 * @params departmentName 部门名称
 * @params level 部门级别
 * @params parentId 上级部门ID
 * @params seq 显示顺序
 * @params status 状态:0-禁用 1-启用
 */
export const updateDepartment = ({ departmentId, status, companyId, departmentCode, departmentName, level, parentId, seq }) => {
  const data = { departmentId: departmentId, status: status, companyId: companyId, departmentCode: departmentCode, departmentName: departmentName, level: level, parentId: parentId, seq: seq }
  return request({
    url: '/org/department/update',
    data,
    method: 'post'
  })
}

/**
 * 添加部门信息
 * @param companyId 所属企业ID
 * @param departmentCode 部门代码
 * @params departmentName 部门名称
 * @params level 部门级别
 * @params parentId 上级部门ID
 * @params seq 显示顺序
 * @params status 状态:0-禁用 1-启用
 */
export const addDepartment = ({ status, companyId, departmentCode, departmentName, level, parentId, seq }) => {
  const params = { status: status, companyId: companyId, departmentCode: departmentCode, departmentName: departmentName, level: level, parentId: parentId, seq: seq }
  return request({
    url: '/org/department/add',
    params,
    method: 'post'
  })
}

/**
 * 查询部门数据
 * @param companyId 所属企业ID
 * @param departmentCode 部门代码
 * @params departmentId 部门ID
 * @params departmentName 部门名称
 * @params level 部门级别
 * @params pageIndex 页码
 * @params pageSize 每页大小
 * @params parentId 上级部门ID
 * @params seq 显示顺序
 * @params status 状态:0-禁用 1-启用
 */
export const searchDepartment = (params) => {
  return request({
    url: '/org/department/page',
    params,
    method: 'get'
  })
}

/**
 * 获取所有下级部门
 * @param departmentId 部门ID
 */
export const getSubdepartment = ({ departmentId }) => {
  const params = { departmentId: departmentId }
  return request({
    url: '/org/department/childrens',
    params,
    method: 'get'
  })
}

/**
 * 部门级别列表
 */
export const getLevels = () => {
  return request({
    url: '/org/department/levels',
    method: 'post'
  })
}

/**
 * 根据部门ID获取所有职位
 * @param departmentId 部门ID
 */
export const getPosition = ({ departmentId }) => {
  const params = { departmentIds: departmentId }
  return request({
    url: '/org/position/findByDepartmentIds/all',
    params,
    method: 'get'
  })
}

/**
 * 获取所有职位
 */
export const getAllPosition = () => {
  return request({
    url: '/org/position/list',
    method: 'get'
  })
}

/**
 * 禁用/启用岗位信息
 * @param departmentId
 * @param status 状态:0-禁用 1-启用
 */
export const changePositionStatus = ({ positionId, status }) => {
  const params = { positionId: positionId, status: status }
  return request({
    url: '/org/position/status',
    params,
    method: 'post'
  })
}

/**
 * 分页获取职位数据
 * @params companyId 公司ID
 * @params departmentId 所属部门ID
 * @params pageIndex 页码
 * @params pageSize 每页大小
 * @params positionCode 职位代码
 * @params positionId 职位ID
 * @params positionName 职位名称
 * @params status 状态:0-禁用 1-启用
 */
export const searchPosition = (data) => {
  const params = data
  return request({
    url: '/org/position/page',
    params,
    method: 'get'
  })
}

/**
 * 添加职位
 * @param departmentId 所属部门ID
 * @param positionCode 职位代码
 * @params positionName 职位名称
 * @params requiredQualifications 所需资格条件
 * @params responsibilityWeight 责任权重
 * @params seq 显示顺序
 * @params status 状态:0-禁用 1-启用
 * @params workContent 工作内容
 * @params workStandard 工作标准
 */
export const addPosition = ({ status, departmentId, positionCode, positionName, requiredQualifications, responsibilityWeight, seq, workContent, workStandard }) => {
  const params = { status: status, departmentId: departmentId, positionCode: positionCode, positionName: positionName, requiredQualifications: requiredQualifications, responsibilityWeight: responsibilityWeight, seq: seq, workContent: workContent, workStandard: workStandard }
  return request({
    url: '/org/position/add',
    params,
    method: 'post'
  })
}

/**
 * 编辑职位
 * @param departmentId 所属部门ID
 * @param positionCode 职位代码
 * @params positionName 职位名称
 * @params requiredQualifications 所需资格条件
 * @params responsibilityWeight 责任权重
 * @params seq 显示顺序
 * @params status 状态:0-禁用 1-启用
 * @params workContent 工作内容
 * @params workStandard 工作标准
 * @params positionId 职位ID
 */
export const updatePosition = ({ positionId, status, departmentId, positionCode, positionName, requiredQualifications, responsibilityWeight, seq, workContent, workStandard }) => {
  const params = { positionId: positionId, status: status, departmentId: departmentId, positionCode: positionCode, positionName: positionName, requiredQualifications: requiredQualifications, responsibilityWeight: responsibilityWeight, seq: seq, workContent: workContent, workStandard: workStandard }
  return request({
    url: '/org/position/update',
    params,
    method: 'post'
  })
}

/**
 * 获取所有人员
 */
export const getAllStaff = () => {
  return request({
    url: '/org/user/list',
    method: 'get'
  })
}

/**
 * 编辑员工资料
 * @params department 成员所属部门id列表
 * @params jobnumber 员工工号
 * @params mobile  手机号码
 * @params name 员工名字
 * @params positionId 职位ID
 * @params userId 人员ID
 * @params active 是否已经激活:1已激活，0未激活
 * @params avatar 头像url
 * @params email 员工的电子邮箱
 * @params hiredDate 入职时间
 * @params orgEmail 员工的企业邮箱
 * @params parentId 上级ID
 * @params position 职位信息
 * @params remark 备注
 * @params tel 分机号（仅限企业内部开发调用）
 * @params unionid 员工在当前开发者企业账号范围内的唯一标识
 * @params workPlace 办公地点
 */
export const updateStaff = (data) => {
  return request({
    url: '/org/user/update',
    data,
    method: 'post'
  })
}

/**
 * 分页获取人员信息(钉钉)
 */
export const searchStaff = (data) => {
  const params = data
  return request({
    url: '/org/user/page',
    params,
    method: 'get'
  })
}

/**
 * 添加系统用户
 * @params ddUserid 员工在当前企业内的钉钉唯一标识
 * @params nickName 昵称
 * @params password 密码
 * @params status 状态:0-禁用 1-正常 2-锁定
 * @params userName 用户名
 * @params userType 用户类型:super-超级管理员 normal-普通管理员
 * @params avatar 头像
 * @params email 邮箱
 * @params mobile 号码
 * @params userDesc 用户描述
 */
export const addUser = (data) => {
  return request({
    url: '/org/user/add',
    data,
    method: 'post'
  })
}

/**
 * 添加钉钉配置信息
 * @params agentdId 应用的agentdId
 * @params appKey 应用的AppKey
 * @params appSecret  应用的AppSecret
 * @params companyId 企业ID
 * @params corpId 企业corpid
 * @params encodingAesKey 数据加密密钥
 * @params token 加解密需要用到的token
 */
export const addDingTalk = ({ agentdId, appKey, appSecret, companyId, corpId, encodingAesKey, token }) => {
  const data = { agentdId: agentdId, appKey: appKey, appSecret: appSecret, companyId: companyId, corpId: corpId, encodingAesKey: encodingAesKey, token: token }
  return request({
    url: '/org/dingtalk/add',
    data,
    method: 'post'
  })
}

/**
 * 分页获取钉钉配置信息
 * @params agentdId 应用的agentdId
 * @params appKey 应用的AppKey
 * @params appSecret  应用的AppSecret
 * @params companyId 企业ID
 * @params corpId 企业corpid
 * @params encodingAesKey 数据加密密钥
 * @params token 加解密需要用到的token
 * @params pageIndex 页码
 * @params pageSize 每页大小
 */
export const searchDingTalk = ({ agentdId, appKey, appSecret, companyId, corpId, encodingAesKey, token, pageIndex, pageSize }) => {
  const data = { agentdId: agentdId, appKey: appKey, appSecret: appSecret, companyId: companyId, corpId: corpId, encodingAesKey: encodingAesKey, token: token, pageIndex: pageIndex, pageSize: pageSize }
  return request({
    url: '/org/dingtalk/page',
    data,
    method: 'get'
  })
}

/**
 * 删除钉钉配置信息
 * @params companyId 企业ID
 */
export const removeDingTalk = ({ companyId }) => {
  const data = { companyId: companyId }
  return request({
    url: '/org/dingtalk/remove',
    data,
    method: 'post'
  })
}

/**
 * 编辑钉钉配置信息
 * @params agentdId 应用的agentdId
 * @params appKey 应用的AppKey
 * @params appSecret  应用的AppSecret
 * @params companyId 企业ID
 * @params corpId 企业corpid
 * @params encodingAesKey 数据加密密钥
 * @params token 加解密需要用到的token
 */
export const updateDingTalk = ({ agentdId, appKey, appSecret, companyId, corpId, encodingAesKey, token }) => {
  const data = { agentdId: agentdId, appKey: appKey, appSecret: appSecret, companyId: companyId, corpId: corpId, encodingAesKey: encodingAesKey, token: token }
  return request({
    url: '/org/dingtalk/update',
    data,
    method: 'post'
  })
}

/**
 * 获取公司部门菜单信息
 */
export const getMenu = () => {
  return request({
    url: '/org/company/get/menu',
    method: 'get'
  })
}
