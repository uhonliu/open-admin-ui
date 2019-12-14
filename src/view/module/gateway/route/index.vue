<template>
  <div>
    <Card shadow>
      <div class="search-con search-con-top">
        <ButtonGroup>
          <Button :disabled="hasAuthority('gatewayRouteEdit')?false:true" class="search-btn" type="primary"
                  @click="handleModal()">
            <span>添加</span>
          </Button>
        </ButtonGroup>
      </div>
      <Alert show-icon>谨慎添加或修改路由,如果修改不当,将影响正常访问！&nbsp;<a @click="handleRefreshGateway">手动刷新网关</a></Alert>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="status" slot-scope="{ row }">
          <Badge v-if="row.status===1" status="success" text="启用"/>
          <Badge v-else="" status="error" text="禁用"/>
        </template>
        <template slot="routeType" slot-scope="{ row }">
          <span v-if="row.routeType==='service'"><Tag color="green">负载均衡</Tag>{{row.serviceId}}</span>
          <span v-else-if="row.routeType==='url'"><Tag color="blue">反向代理</Tag>{{row.url}}</span>
        </template>

        <template slot="action" slot-scope="{ row }">
          <a :disabled="hasAuthority('gatewayRouteEdit')?false:true" @click="handleModal(row)">
            编辑</a>&nbsp;
          <Dropdown v-show="hasAuthority('gatewayRouteEdit')" transfer ref="dropdown"
                    @on-click="handleClick($event,row)">
            <a href="javascript:void(0)">
              <span>更多</span>
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="remove">删除</DropdownItem>
            </DropdownMenu>
          </Dropdown>&nbsp;
        </template>
      </Table>
      <Page :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.limit" show-elevator show-sizer
            show-total
            @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Modal v-model="modalVisible"
           :title="modalTitle"
           width="50"
           @on-cancel="handleReset">
      <div>
        <Form ref="routeForm" :model="formItem" :rules="formItemRules" :label-width="100">
          <FormItem label="路由名称" prop="routeDesc">
            <Input v-model="formItem.routeDesc" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="路由标识" prop="routeName">
            <Input v-model="formItem.routeName" placeholder="默认使用服务名称{application.name}"></Input>
          </FormItem>
          <FormItem label="路由前缀" prop="path">
            <Input v-model="formItem.path" placeholder="/{path}/**"></Input>
          </FormItem>
          <FormItem label="路由方式" prop="routeType">
            <Select v-model="formItem.routeType">
              <Option value="service" label="负载均衡(serviceId)"></Option>
              <Option value="url" label="反向代理(url)"></Option>
            </Select>
          </FormItem>
          <FormItem v-if="formItem.routeType==='service'" label="负载均衡" prop="serviceId"
                    :rules="{required: true, message: '服务名称不能为空', trigger: 'blur'}">
            <Input v-model="formItem.serviceId" placeholder="服务名称application.name"></Input>
          </FormItem>
          <FormItem v-if="formItem.routeType==='url'" label="反向代理" prop="url"
                    :rules="[{required: true, message: '服务地址不能为空', trigger: 'blur'},{type: 'url', message: '请输入有效网址', trigger: 'blur'}]">
            <Input v-model="formItem.url" placeholder="http://localhost:8080"></Input>
          </FormItem>
          <FormItem label="忽略前缀">
            <RadioGroup v-model="formItem.stripPrefix" type="button">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="失败重试">
            <RadioGroup v-model="formItem.retryable" type="button">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model="formItem.status" type="button">
              <Radio label="0">禁用</Radio>
              <Radio label="1">启用</Radio>
            </RadioGroup>
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
import { getRoutes, updateRoute, addRoute, removeRoute } from '@/api/route'
import { refreshGateway } from '@/api/gateway'

export default {
  name: 'GatewayRoute',
  data () {
    return {
      loading: false,
      saving: false,
      modalVisible: false,
      modalTitle: '',
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      selectServiceList: [],
      formItemRules: {
        routeDesc: [
          { required: true, message: '路由名称不能为空', trigger: 'blur' }
        ],
        routeName: [
          { required: true, message: '路由标识不能为空', trigger: 'blur' }
        ],
        routeType: [
          { required: true, message: '路由方式不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由前缀不能为空', trigger: 'blur' }
        ]
      },
      formItem: {
        routeId: '',
        path: '',
        serviceId: '',
        url: '',
        stripPrefix: 0,
        retryable: 0,
        status: 1,
        routeName: '',
        routeType: 'service',
        routeDesc: ''
      },
      columns: [
        {
          title: '路由名称',
          key: 'routeDesc',
          width: 300
        },
        {
          title: '路由标识',
          key: 'routeName',
          width: 300

        },
        {
          title: '路由前缀',
          key: 'path',
          width: 200
        },
        {
          title: '路由方式',
          slot: 'routeType',
          width: 300
        },
        {
          title: '忽略前缀',
          key: 'stripPrefix'
        },
        {
          title: '失败重试',
          key: 'retryable'
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status'
        },
        {
          title: '操作',
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
        this.modalTitle = '编辑路由'
        this.formItem = Object.assign({}, this.formItem, data)
      } else {
        this.modalTitle = '添加路由'
      }
      this.formItem.status = this.formItem.status + ''
      this.formItem.stripPrefix = this.formItem.stripPrefix + ''
      this.formItem.retryable = this.formItem.retryable + ''
      this.formItem.url = this.formItem.routeType === 'url' ? this.formItem.url : ''
      this.formItem.service = this.formItem.routeType === 'service' ? this.formItem.service : ''
      this.modalVisible = true
    },
    handleReset () {
      const newData = {
        routeId: '',
        path: '',
        serviceId: '',
        url: '',
        stripPrefix: 0,
        retryable: 0,
        status: 1,
        routeName: '',
        routeType: 'service',
        routeDesc: ''
      }
      this.formItem = newData
      // 重置验证
      this.$refs['routeForm'].resetFields()
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit () {
      this.$refs['routeForm'].validate((valid) => {
        if (valid) {
          this.saving = true
          if (this.formItem.routeId) {
            updateRoute(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
            }).finally(() => {
              this.saving = false
            })
          } else {
            addRoute(this.formItem).then(res => {
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
    handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getRoutes({ page: this.pageInfo.page, limit: this.pageInfo.limit }).then(res => {
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
    handleRemove (data) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        onOk: () => {
          removeRoute(data.routeId).then(res => {
            if (res.code === 0) {
              this.pageInfo.page = 1
              this.$Message.success('删除成功')
              this.handleSearch()
            }
          })
        }
      })
    },
    handleClick (name, row) {
      switch (name) {
        case 'remove':
          this.handleRemove(row)
          break
      }
    },
    handleRefreshGateway () {
      this.$Modal.confirm({
        title: '提示',
        content: '将重新加载所有网关实例包括（访问权限、流量限制、IP访问限制、路由缓存），是否继续？',
        onOk: () => {
          refreshGateway().then(res => {
            if (res.code === 0) {
              this.$Message.success('刷新成功')
            }
          })
        }
      })
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
