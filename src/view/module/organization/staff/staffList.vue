<template>
  <div>
    <leftTree menuType="staff" @changeData="changeData" @searchStaff="changeStaffInfo"></leftTree>
    <div>
      <Form :label-width="0" inline :model="staffInfo">
        <FormItem prop="name">
          <Input v-model="staffInfo.name" placeholder="输入员工姓名" style="width:150px;"></Input>
        </FormItem>
        <FormItem prop="mobile">
          <Input v-model="staffInfo.mobile" placeholder="输入手机号码"  style="width:150px;"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchStaff()">查询</Button>
          <Button @click="resetForm()">重置</Button>
        </FormItem>
      </Form>
      <Table
        stripe
        border
        :data="data"
        :columns="columns"
        :loading="tableLoading"
        style="margin-top:10px;"
      >
        <template slot="operation" slot-scope="row">
          <div class="operation">
            <span @click="editor(row)">编辑</span>
            <span @click="setAdmin(row.row)" v-if="row.row.userId==0">设置管理员</span>
          </div>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            show-sizer
            show-elevator
            :total="staffInfo.total"
            :current="staffInfo.pageIndex"
            :page-size="staffInfo.pageSize"
            :page-size-opts="[15,30,50,100]"
            @on-change="handlePage"
            @on-page-size-change="handlePageSize"
          ></Page>
        </div>
      </div>
      <Modal v-model="popup" footer-hide :title="title" width="750" class="popupForm">
        <Form :model="formItem" :label-width="80" :rules="ruleValidate" class="form" ref="formItem">
          <div class="clearfix">
            <div class="left">
              <FormItem label="员工名字" prop="name">
                <Input v-model="formItem.name"></Input>
              </FormItem>
              <FormItem label="手机号码" prop="mobile">
                <Input v-model="formItem.mobile"></Input>
              </FormItem>
              <FormItem label="分机号" prop="tel">
                <Input v-model="formItem.tel"></Input>
              </FormItem>
              <FormItem label="电子邮箱" prop="email">
                <Input v-model="formItem.email"></Input>
              </FormItem>
              <FormItem label="企业邮箱" prop="orgEmail">
                <Input v-model="formItem.orgEmail"></Input>
              </FormItem>
              <FormItem label="员工工号" prop="jobnumber">
                <Input v-model="formItem.jobnumber"></Input>
              </FormItem>
              <FormItem label="入职时间" prop="hiredDate">
                <DatePicker
                  type="datetime"
                  v-model="formItem.hiredDate"
                  format="yyyy-MM-dd HH:mm:ss"
                ></DatePicker>
              </FormItem>
              <FormItem label="办公地点" prop="workPlace">
                <Input v-model="formItem.workPlace"></Input>
              </FormItem>
              <FormItem label="所属企业" prop="companyId">
                <Select v-model="formItem.companyId" @on-change="changeCompany">
                  <Option
                    v-for="item in companyList"
                    :value="item.companyId"
                    :key="item.companyId"
                  >{{ item.companyName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="所属部门" prop="departmentId">
                <Select v-model="formItem.departmentId" multiple @on-change="changeDepartment">
                  <Option
                    v-for="item in departmentList"
                    :value="item.departmentId"
                    :key="item.departmentId"
                  >{{ item.departmentName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="所属岗位" prop="positionId">
                <Select v-model="formItem.positionId" @on-change="changePosition">
                  <Option
                    v-for="item in positionList"
                    :value="item.positionId"
                    :key="item.positionId"
                  >{{ item.positionName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="上级" prop="parentId">
                <Select v-model="formItem.parentId" clearable>
                  <Option
                    v-for="(item,index) in higherList"
                    :value="item.userId"
                    :key="index"
                  >{{ item.name }}</Option>
                </Select>
              </FormItem>
              <FormItem label="备注" prop="remark">
                <Input v-model="formItem.remark" type="textarea"></Input>
              </FormItem>
            </div>
            <div class="right">
              <div class="imgBox">
                <img :src="formItem.avatar" alt />
              </div>
              <Upload
                :action="uploadUrl"
                :show-upload-list="false"
                :on-success="upsuccess"
                class="uploadImg"
                :data="{prefix:''}"
              >
                <Button icon="ios-cloud-upload-outline" type="primary">上传</Button>
              </Upload>
            </div>
          </div>
          <div class="btnDev">
            <Button type="primary" @click="submit">确定</Button>
            <Button @click="popup=false">取消</Button>
          </div>
        </Form>
      </Modal>
      <Modal v-model="modalVisible" title="设置管理员信息" footer-hide>
        <Form ref="adminForm" :model="adminForm" :rules="formItemRules" :label-width="100">
          <FormItem label="用户类型" prop="userType">
            <RadioGroup v-model="adminForm.userType">
              <Radio label="super">超级管理员</Radio>
              <Radio label="normal">普通管理员</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="昵称" prop="nickName">
            <Input v-model="adminForm.nickName" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="登录名" prop="userName">
            <Input v-model="adminForm.userName" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="登录密码" prop="password">
            <Input type="password" v-model="adminForm.password" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="再次确认密码" prop="passwordConfirm">
            <Input type="password" v-model="adminForm.passwordConfirm" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="adminForm.email" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="手机号" prop="mobile">
            <Input v-model="adminForm.mobile" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model="adminForm.status" type="button">
              <Radio label="0">禁用</Radio>
              <Radio label="1">正常</Radio>
              <Radio label="2">锁定</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="adminForm.userDesc" type="textarea" placeholder="请输入内容"></Input>
          </FormItem>
          <div class="btnDev">
            <Button type="primary" @click="submitInfo">确定</Button>
            <Button @click="modalVisible=false">取消</Button>
          </div>
        </Form>
      </Modal>
    </div>
  </div>
</template>
<script>
import {
  searchStaff,
  updateStaff,
  departmentList,
  getPosition,
  companyInfo,
  addUser,
  getAllStaff
} from '@/api/organization'
import leftTree from '@/view/module/organization/components/leftTree'
export default {
  components: {
    leftTree
  },
  data () {
    const validateEn = (rule, value, callback) => {
      let reg = /^[_a-zA-Z0-9]+$/
      let reg2 = /^.{4,18}$/
      // 长度为6到18个字符
      if (value === '') {
        callback(new Error('登录名不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线'))
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('长度6到18个字符'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      let reg2 = /^.{6,18}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('长度6到18个字符'))
      } else {
        callback()
      }
    }

    const validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.adminForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      let reg = /^1\d{10}$/
      if (value !== '' && !reg.test(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      popup: false,
      modalVisible: false,
      title: '编辑人员',
      tableLoading: false,
      uploadUrl: this.baseUrl + '/file/oss/upload',
      data: [],
      loading1: false,
      columns: [
        {
          title: '序号',
          align: 'center',
          width: '60px',
          render: (h, params) => {
            return h('span', params.row._index + 1)
          }
        },
        {
          title: '员工名字',
          align: 'center',
          key: 'name'
        },
        {
          title: '所属公司',
          align: 'center',
          key: 'companyName'
        },
        {
          title: '所属部门',
          align: 'center',
          key: 'departmentName'
        },
        {
          title: '岗位',
          align: 'center',
          key: 'positionName'
        },
        {
          title: '上级',
          align: 'center',
          key: 'parentName'
        },
        {
          title: '手机号码',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operation',
          width: '134px'
        }
      ],
      formItem: {
        departmentId: [],
        jobnumber: '',
        mobile: '',
        name: '',
        positionId: '',
        userId: '',
        active: '',
        avatar: '',
        email: '',
        hiredDate: '',
        orgEmail: '',
        parentId: '',
        position: '',
        remark: '',
        tel: '',
        unionid: '',
        workPlace: '',
        companyId: '',
        ddUserid: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '员工名字不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
        ],
        jobnumber: [
          { required: true, message: '员工工号不能为空', trigger: 'blur' }
        ],
        departmentId: [
          {
            required: true,
            message: '所属部门不能为空',
            trigger: 'change',
            type: 'array'
          }
        ],
        positionId: [
          { required: true, message: '所属岗位不能为空', trigger: 'change' }
        ]
      },
      staffInfo: {
        active: '',
        companyId: '',
        departmentId: '',
        department: '',
        jobnumber: '',
        mobile: '',
        name: '',
        pageIndex: 1,
        pageSize: 10,
        parentId: '',
        positionCode: '',
        positionId: '',
        positionName: '',
        userId: '',
        total: 0
      },
      departmentList: [],
      positionList: [],
      higherList: [],
      optionList: [],
      adminForm: {
        userName: '',
        nickName: '',
        password: '',
        passwordConfirm: '',
        status: 1,
        email: '',
        mobile: '',
        userType: 'normal',
        userDesc: '',
        ddUserid: '',
        avatar: ''
      },
      formItemRules: {
        userType: [
          { required: true, message: '用户类型不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { required: true, validator: validateEn, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, validator: validatePassConfirm, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        email: [
          {
            required: false,
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [{ validator: validateMobile, trigger: 'blur' }]
      },
      companyList: [],
      staffList: []
    }
  },
  watch: {
    'formItem.companyId' (old, val) {
      this.getDepartment(old)
    },
    higherList: {
      handler (val, old) {
        this.higherList = val
        // console.log(this.higherList);
      },
      deep: true
    }
  },
  methods: {
    getcompanyInfo () {
      companyInfo().then(res => {
        if (res.code === 0) {
          this.companyList = res.data
        }
      })
    },
    changeCompany (val) {
      this.getDepartment(val)
      this.formItem.departmentId = []
    },
    getDepartment (val) {
      const companyId = val
      if (companyId === '' || companyId === undefined) {
        // this.$Message.info("请先选择公司");
        return
      }
      departmentList({ companyId: companyId }).then(res => {
        if (res.code === 0) {
          this.departmentList = res.data
        }
      })
    },
    searchStaff (pageIndex) {
      this.tableLoading = true
      if (pageIndex) {
        this.staffInfo.pageIndex = pageIndex
      }
      searchStaff(this.staffInfo).then(res => {
        if (res.code === 0) {
          this.data = res.data.records
          this.staffInfo.total = Number(res.data.total)
          this.tableLoading = false
        }
      })
    },
    changeDepartment (val) {
      if (val) {
        let obj = {}
        if (typeof val === 'string') {
          obj = { departmentId: val }
        } else {
          obj = { departmentId: val.join(',') }
        }
        getPosition(obj).then(res => {
          if (res.code === 0) {
            this.positionList = res.data
          }
        })
      }
    },
    changePosition (val) {
      this.staffInfo.positionId = val
    },
    editor (row) {
      this.popup = true
      this.formItem = row.row
      this.formItem.departmentId = row.row.department.split(',')
      if (row.row.department) {
        this.changeDepartment(row.row.department)
      }
      if (row.row.positionId) {
        this.changePosition(row.row.positionId)
      }
    },
    upsuccess (res, file, fileList) {
      this.formItem.logo = file.response.data.fileUrl
      // console.log(file);
    },
    submit () {
      this.$refs['formItem'].validate(valid => {
        if (valid) {
          this.formItem.hiredDate = this.formatDate(this.formItem.hiredDate)
          this.formItem.department = this.formItem.departmentId.join(',')
          delete this.formItem.parentName
          if (this.formItem.parentId === undefined) this.formItem.parentId = ''
          // console.log(this.formItem);

          updateStaff(this.formItem).then(res => {
            if (res.code === 0) {
              this.$Message.success('修改成功')
              this.popup = false
              this.staffInfo.positionId = ''
              this.searchStaff()
            }
          })
        }
      })
    },
    setAdmin (row) {
      this.modalVisible = true
      // console.log(row);
      this.adminForm.userName = row.mobile
      this.adminForm.mobile = row.mobile
      this.adminForm.avatar = row.avatar
      this.adminForm.email = row.orgEmail
      this.adminForm.ddUserid = row.ddUserid
      this.adminForm.nickName = row.name
    },
    submitInfo () {
      this.$refs['adminForm'].validate(valid => {
        if (valid) {
          addUser(this.adminForm)
            .then(res => {
              if (res.code === 0) {
                this.$Message.success('添加成功')
                this.modalVisible = false
                this.searchStaff()
              }
            })
            .finally(() => {
              this.getStaffList()
              this.$refs['adminForm'].resetFields()
            })
        }
      })
    },
    formatDate (date) {
      if (typeof date === 'object') {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d + ' 00:00:00'
      } else {
        return date
      }
    },
    changeData (val) {
      this.data = val.records
      this.staffInfo.total = Number(val.total)
      this.tableLoading = false
    },
    handlePage (val) {
      this.searchStaff(val)
    },
    handlePageSize (val) {
      this.staffInfo.pageSize = val
      this.searchStaff(1)
    },
    changeStaffInfo (val) {
      this.tableLoading = true
      this.staffInfo.name = ''
      this.staffInfo.mobile = ''
    },
    getStaffList () {
      getAllStaff().then(res => {
        if (res.code === 0) {
          this.staffList = res.data
          this.getParentList()
        }
      })
    },
    getParentList () {
      const list = this.staffList.map(item => {
        return {
          userId: item.userId,
          name: item.name
        }
      })
      this.higherList = list.filter(item => item.userId !== '0')
      // this.optionList = this.higherList;
    },
    resetForm () {
      this.staffInfo.name = ''
      this.staffInfo.mobile = ''
      this.searchStaff(1)
    }
  },
  created () {
    this.getStaffList()
  },
  mounted () {
    // this.getParentList();
    this.getcompanyInfo()
    this.searchStaff()
  }
}
</script>
<style lang="less" scoped>
.operation {
  span {
    color: #1890ff;
    margin: 4px;
    cursor: pointer;
  }
}
.btnDev {
  text-align: center;
  button {
    margin: 0 10px;
  }
}
.popupForm {
  .clearfix {
    overflow: hidden;
    .left {
      width: 60%;
      float: left;
      /deep/ .ivu-date-picker {
        width: 100%;
      }
    }
    .right {
      float: right;
      width: 33%;
      .imgBox {
        width: 100%;
        height: 240px;
        text-align: center;
        line-height: 240px;
        font-size: 16px;
        border: 1px solid #c9c9c9;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .uploadImg {
        display: block;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
/deep/ .ivu-table-wrapper {
  overflow: hidden !important;
}
</style>
