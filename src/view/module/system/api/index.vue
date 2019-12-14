<template>
  <div>
    <Card shadow>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="请求路径" prop="path">
          <Input type="text" v-model="pageInfo.path" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem label="接口名称" prop="apiName">
          <Input type="text" v-model="pageInfo.apiName" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem label="接口编码" prop="apiCode">
          <Input type="text" v-model="pageInfo.apiCode" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem label="服务名" prop="serviceId">
          <Input type="text" v-model="pageInfo.serviceId" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <Button @click="handleResetForm('searchForm')">重置</Button>
        </FormItem>
      </Form>
      <div class="search-con search-con-top">
        <ButtonGroup>
          <Button :disabled="hasAuthority('systemApiEdit')?false:true" class="search-btn" type="primary"
                  @click="handleModal()">
            <span>添加</span>
          </Button>
        </ButtonGroup>
        <Dropdown v-if="tableSelection.length>0 && hasAuthority('systemApiEdit')" @on-click="handleBatchClick"
                  style="margin-left: 20px">
          <Button>
            <span>批量操作</span>
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="remove">删除</DropdownItem>
            <Dropdown placement="right-start">
              <DropdownItem>
                <span>状态</span>
                <Icon type="ios-arrow-forward"></Icon>
              </DropdownItem>
              <DropdownMenu slot="list">
                <DropdownItem name="status1">启用</DropdownItem>
                <DropdownItem name="status2">禁用</DropdownItem>
                <DropdownItem name="status3">维护中</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown placement="right-start">
              <DropdownItem>
                <span>公开访问</span>
                <Icon type="ios-arrow-forward"></Icon>
              </DropdownItem>
              <DropdownMenu slot="list">
                <DropdownItem name="open1">允许公开访问</DropdownItem>
                <DropdownItem name="open2">拒绝公开访问</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown placement="right-start">
              <DropdownItem>
                <span>身份认证</span>
                <Icon type="ios-arrow-forward"></Icon>
              </DropdownItem>
              <DropdownMenu slot="list">
                <DropdownItem name="auth1">开启身份认证</DropdownItem>
                <DropdownItem name="auth2">关闭身份认证</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Alert show-icon>
        <span>自动扫描<code>@EnableResourceServer</code>资源服务器接口信息,注:自动添加的接口,都是未公开的. <code>只有公开的接口,才可以通过网关访问。否则将提示:"请求地址,拒绝访问!"</code></span>
      </Alert>
      <Table @on-selection-change="handleTableSelectChange" border :columns="columns" :data="data" :loading="loading">
        <template slot="apiName" slot-scope="{ row }">
          <span>{{row.apiName}}</span>
        </template>
        <template slot="isAuth" slot-scope="{ row }">
          <Tag color="green" v-if="row.isOpen===1">允许公开访问</Tag>
          <Tag color="red" v-else-if="row.isOpen!==1">拒绝公开访问</Tag>
          <Tag color="green" v-if="row.isAuth===1">开启身份认证</Tag>
          <Tag color="red" v-else-if="row.isAuth!==1">关闭身份认证</Tag>
          <Tag v-if="row.status===1" color="green">启用</Tag>
          <Tag v-else-if="row.status===2" color="orange">维护中</Tag>
          <Tag v-else="" color="red">禁用</Tag>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a :disabled="hasAuthority('systemApiEdit')?false:true" @click="handleModal(row)">
            编辑</a>&nbsp;
          <a :disabled="hasAuthority('systemApiEdit')?false:true" @click="handleRemove(row)">
            删除</a>
        </template>
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.limit" show-elevator
            show-sizer
            show-total
            @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Modal v-model="modalVisible"
           :title="modalTitle"
           width="50"
           @on-cancel="handleReset">
      <div>
        <Alert show-icon v-if="formItem.apiId?true:false">
          <span>自动扫描接口swagger注解。</span>
          <Poptip placement="bottom" title="示例代码">
            <a>示例代码</a>
            <div slot="content">
              <div v-highlight>
                <pre>
                      // 接口介绍
                      @ApiOperation(value = "接口名称", notes = "接口备注")
                      @PostMapping("/testApi")
                      // 忽略接口,将不再添加或修改次接口
                      @ApiIgnore
                      public ResultBody testApi() {
                          return ResultBody.success();
                      }
                </pre>
              </div>
            </div>
          </Poptip>
        </Alert>
        <Form ref="form1" :model="formItem" :rules="formItemRules" :label-width="100">
          <FormItem label="服务名称" prop="serviceId">
            <Select :disabled="formItem.apiId && formItem.isPersist === 1?true:false" v-model="formItem.serviceId"
                    filterable clearable>
              <Option v-for="(item,index) in selectServiceList" :value="item.serviceId" v-bind:key="index">{{ item.serviceName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="接口分类" prop="apiCategory">
            <Input v-model="formItem.apiCategory" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="接口编码" prop="apiCode">
            <Input :disabled="formItem.apiId && formItem.isPersist === 1?true:false" v-model="formItem.apiCode"
                   placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="接口名称" prop="apiName">
            <Input :disabled="formItem.apiId && formItem.isPersist === 1?true:false" v-model="formItem.apiName"
                   placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="请求地址" prop="path">
            <Input :disabled="formItem.apiId && formItem.isPersist === 1?true:false" v-model="formItem.path"
                   placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="优先级">
            <InputNumber v-model="formItem.priority"></InputNumber>
          </FormItem>
          <FormItem label="身份认证">
            <RadioGroup v-model="formItem.isAuth" type="button">
              <Radio :disabled="formItem.apiId && formItem.isPersist === 1?true:false" label="0">关闭</Radio>
              <Radio :disabled="formItem.apiId && formItem.isPersist === 1?true:false" label="1">开启</Radio>
            </RadioGroup>
            <p><code>开启：未认证登录,提示"认证失败,请重新登录!";关闭: 不需要认证登录</code></p>
          </FormItem>
          <FormItem label="公开访问">
            <RadioGroup v-model="formItem.isOpen" type="button">
              <Radio label="0">拒绝</Radio>
              <Radio label="1">允许</Radio>
            </RadioGroup>
            <p><code>拒绝:提示"请求地址,拒绝访问!"</code></p>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model="formItem.status" type="button">
              <Radio label="0">禁用</Radio>
              <Radio label="1">启用</Radio>
              <Radio label="2">维护中</Radio>
            </RadioGroup>
            <p><code>禁用：提示"请求地址,禁止访问!";维护中：提示"正在升级维护中,请稍后再试!";</code></p>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="formItem.apiDesc" type="textarea" placeholder="请输入内容"></Input>
          </FormItem>
        </Form>
        <div class="drawer-footer">
          <Button type="default" @click="handleReset">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving">保存</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getApis,
  updateApi,
  addApi,
  removeApi,
  batchRemoveApi,
  batchUpdateOpenApi,
  batchUpdateStatusApi,
  batchUpdateAuthApi
} from '@/api/api'
import { getServiceList } from '@/api/gateway'

export default {
  name: 'SystemApi',
  data () {
    const validateEn = (rule, value, callback) => {
      let reg = /^[_.a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('接口标识不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、点、下划线'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      modalVisible: false,
      modalTitle: '',
      saving: false,
      tableSelection: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        path: '',
        apiName: '',
        apiCode: '',
        serviceId: ''
      },
      selectServiceList: [],
      formItemRules: {
        serviceId: [
          { required: true, message: '所属服务不能为空', trigger: 'blur' }
        ],
        apiCategory: [
          { required: true, message: '接口分类不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '接口地址不能为空', trigger: 'blur' }
        ],
        apiCode: [
          { required: true, validator: validateEn, trigger: 'blur' }
        ],
        apiName: [
          { required: true, message: '接口名称不能为空', trigger: 'blur' }
        ]
      },
      formItem: {
        apiId: '',
        apiCode: '',
        apiName: '',
        apiCategory: 'default',
        path: '',
        status: 1,
        isAuth: 1,
        openSwatch: false,
        authSwatch: true,
        serviceId: '',
        priority: 0,
        apiDesc: '',
        isOpen: 1
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'md5编码',
          key: 'apiCode',
          width: 300
        },
        {
          title: '名称',
          key: 'apiName',
          slot: 'apiName',
          width: 300,
          filters: [
            {
              label: '禁用',
              value: 0
            },
            {
              label: '启用',
              value: 1
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 0) {
              return row.status === 0
            } else if (value === 1) {
              return row.status === 1
            }
          }
        },
        {
          title: '地址',
          key: 'path',
          width: 200
        },
        {
          title: '分类',
          key: 'apiCategory',
          width: 100
        },
        {
          title: '服务名称',
          key: 'serviceId',
          width: 200
        },
        {
          title: '接口安全',
          key: 'isAuth',
          slot: 'isAuth',
          width: 300
        },
        {
          title: '描述',
          key: 'apiDesc',
          width: 200
        },
        {
          title: '最后更新时间',
          key: 'updateTime',
          width: 180
        },
        {
          title: '操作',
          key: '',
          slot: 'action',
          fixed: 'right',
          width: 120
        }
      ],
      data: []
    }
  },
  methods: {
    handleModal (data) {
      if (data) {
        this.modalTitle = '编辑接口 - ' + data.apiName
        this.formItem = Object.assign({}, this.formItem, data)
      } else {
        this.modalTitle = '添加接口'
      }
      this.formItem.status = this.formItem.status + ''
      this.formItem.isAuth = this.formItem.isAuth + ''
      this.formItem.isOpen = this.formItem.isOpen + ''
      this.modalVisible = true
    },
    handleResetForm (form) {
      this.$refs[form].resetFields()
    },
    handleReset () {
      const newData = {
        apiId: '',
        apiCode: '',
        apiName: '',
        apiCategory: 'default',
        path: '',
        status: 1,
        isAuth: 1,
        serviceId: '',
        priority: 0,
        apiDesc: '',
        isOpen: 1
      }
      this.formItem = newData
      // 重置验证
      this.handleResetForm('form1')
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit () {
      this.$refs['form1'].validate((valid) => {
        if (valid) {
          this.saving = true
          if (this.formItem.apiId) {
            updateApi(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
            }).finally(() => {
              this.saving = false
            })
          } else {
            addApi(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
            }).finally(() => {
              this.saving = false
            })
          }
        }
      })
    },
    handleRemove (data) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        onOk: () => {
          removeApi(data.apiId).then(res => {
            if (res.code === 0) {
              this.pageInfo.page = 1
              this.$Message.success('删除成功')
              this.handleSearch()
            }
          })
        }
      })
    },
    handleSearch (page) {
      this.tableSelection = []
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getApis(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handlePage (current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize (size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    handleLoadServiceList () {
      getServiceList().then(res => {
        if (res.code === 0) {
          this.selectServiceList = res.data
        }
      })
    },
    handleTableSelectChange (selection) {
      this.tableSelection = selection
    },
    handleBatchClick (name) {
      if (name) {
        this.$Modal.confirm({
          title: `已勾选${this.tableSelection.length}项,是否继续执行操作？`,
          onOk: () => {
            let ids = []
            this.tableSelection.map(item => {
              if (!ids.includes(item.apiId)) {
                ids.push(item.apiId)
              }
            })
            switch (name) {
              case 'remove':
                batchRemoveApi(ids).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('批量操作成功')
                    this.handleSearch()
                  }
                })
                break
              case 'open1':
                batchUpdateOpenApi({ ids: ids, open: 1 }).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('批量操作成功')
                    this.handleSearch()
                  }
                })
                break
              case 'open2':
                batchUpdateOpenApi({ ids: ids, open: 2 }).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('批量操作成功')
                    this.handleSearch()
                  }
                })
                break
              case 'status1':
                batchUpdateStatusApi({ ids: ids, status: 1 }).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('批量操作成功')
                    this.handleSearch()
                  }
                })
                break
              case 'status2':
                batchUpdateStatusApi({ ids: ids, status: 0 }).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('批量操作成功')
                    this.handleSearch()
                  }
                })
                break
              case 'status3':
                batchUpdateStatusApi({ ids: ids, status: 2 }).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('批量操作成功')
                    this.handleSearch()
                  }
                })
                break
              case 'auth1':
                batchUpdateAuthApi({ ids: ids, auth: 1 }).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('批量操作成功')
                    this.handleSearch()
                  }
                })
                break
              case 'auth2':
                batchUpdateAuthApi({ ids: ids, auth: 0 }).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('批量操作成功')
                    this.handleSearch()
                  }
                })
                break
            }
          }
        })
      }
    }
  },
  mounted: function () {
    this.handleLoadServiceList()
    this.handleSearch()
  }
}
</script>
