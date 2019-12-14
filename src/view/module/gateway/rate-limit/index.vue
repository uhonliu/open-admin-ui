<template>
  <div>
    <Card shadow>
      <div class="search-con search-con-top">
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="handleModal()">
            <span>添加</span>
          </Button>
        </ButtonGroup>
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="policyType" slot-scope="{ row }">
          <Tag color="green" v-if="row.policyType===1">允许-白名单</Tag>
          <Tag color="red" v-else="">拒绝-黑名单</Tag>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a @click="handleModal(row)">
            编辑</a>&nbsp;
          <a @click="handleRemove(row)">
            删除
          </a>
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
        <Tabs :value="current" @on-click="handleTabClick">
          <TabPane label="策略信息" name="form1">
            <Form ref="form1" v-show="current=='form1'" :model="formItem" :rules="formItemRules" :label-width="100">
              <FormItem label="策略名称" prop="policyName">
                <Input v-model="formItem.policyName" placeholder="请输入内容"></Input>
              </FormItem>
              <FormItem label="策略类型" prop="policyType">
                <Select v-model="formItem.policyType">
                  <Option value="url" label="接口(url)"></Option>
                  <Option disabled value="origin" label="来源(origin)"></Option>
                  <Option disabled value="user" label="用户(user)"></Option>
                </Select>
              </FormItem>
              <FormItem label="单位时间" prop="intervalUnit">
                <Select v-model="formItem.intervalUnit">
                  <Option value="seconds" label="秒(seconds)"></Option>
                  <Option value="minutes" label="分钟(minutes)"></Option>
                  <Option value="hours" label="小时(hours)"></Option>
                  <Option value="days" label="天(days)"></Option>
                </Select>
              </FormItem>
              <FormItem label="限流数" prop="limitQuota">
                <InputNumber :min="10" v-model="formItem.limitQuota"></InputNumber>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane :disabled="!formItem.policyId" label="绑定接口" name="form2">
            <Alert type="warning" show-icon>请注意：如果API上原来已经绑定了一个策略，则会被本策略覆盖，请慎重选择！</Alert>
            <Form ref="form2" v-show="current=='form2'" :model="formItem" :rules="formItemRules">
              <FormItem prop="authorities">
                <Transfer
                  :data="selectApis"
                  :list-style="{width: '45%',height: '480px'}"
                  :titles="['选择接口', '已选择接口']"
                  :render-format="transferRender"
                  :target-keys="formItem.apiIds"
                  @on-change="handleTransferChange"
                  filterable>
                </Transfer>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
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
  getRateLimits,
  addRateLimit,
  updateRateLimit,
  removeRateLimit,
  getRateLimitApis,
  addRateLimitApis
} from '@/api/rateLimit'
import { getAuthorityApi } from '@/api/authority'
export default {
  name: 'GatewayRateLimit',
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
      current: 'form1',
      forms: [
        'form1',
        'form2'
      ],
      selectApis: [],
      formItemRules: {
        policyName: [
          { required: true, message: '策略名称不能为空', trigger: 'blur' }
        ],
        policyType: [
          { required: true, message: '策略类型不能为空', trigger: 'blur' }
        ]
      },
      formItem: {
        policyId: '',
        policyName: '',
        policyType: 'url',
        intervalUnit: 'second',
        limitQuota: 10,
        apiIds: []
      },
      columns: [
        {
          title: '策略名称',
          key: 'policyName',
          width: 350
        },
        {
          title: '策略类型',
          key: 'policyType',
          width: 300
        },
        {
          title: '单位时间',
          key: 'intervalUnit'
        },
        {
          title: '限流数',
          key: 'limitQuota'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 150
        }
      ],
      data: []
    }
  },
  methods: {
    handleModal (data) {
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑限流策略 - ' + this.formItem.policyName : '添加限流策略'
        this.modalVisible = true
      }
      if (this.current === this.forms[1]) {
        this.modalTitle = data ? '绑定接口 - ' + this.formItem.policyName : '绑定接口'
        this.handleRateLimitApi(this.formItem.policyId)
      }
      this.formItem.policyType = this.formItem.policyType + ''
    },
    handleTabClick (name) {
      this.current = name
      this.handleModal()
    },
    handleReset () {
      const newData = {
        policyId: '',
        policyName: '',
        policyType: 'url',
        intervalUnit: 'second',
        limitQuota: 10,
        apiIds: []
      }
      this.formItem = newData
      // 重置验证
      this.forms.map(form => {
        this.$refs[form].resetFields()
      })
      this.current = this.forms[0]
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit () {
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.formItem.policyId) {
              updateRateLimit(this.formItem).then(res => {
                if (res.code === 0) {
                  this.$Message.success('保存成功')
                  this.handleReset()
                  this.handleSearch()
                }
              }).finally(() => {
                this.saving = false
              })
            } else {
              addRateLimit(this.formItem).then(res => {
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
      }
      if (this.current === this.forms[1]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            addRateLimitApis({ policyId: this.formItem.policyId, apiIds: this.formItem.apiIds }).then(res => {
              if (res.code === 0) {
                this.$Message.success('绑定成功')
                this.handleReset()
                this.handleSearch()
              }
            }).finally(() => {
              this.saving = false
            })
          }
        })
      }
    },
    handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getRateLimits({ page: this.pageInfo.page, limit: this.pageInfo.limit }).then(res => {
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
          removeRateLimit(data.policyId).then(res => {
            if (res.code === 0) {
              this.pageInfo.page = 1
              this.$Message.success('删除成功')
              this.handleSearch()
            }
          })
        }
      })
    },
    handleRateLimitApi (policyId) {
      if (!policyId) {
        return
      }
      const that = this
      const p1 = getAuthorityApi('')
      const p2 = getRateLimitApis(policyId)
      Promise.all([p1, p2]).then(function (values) {
        let res1 = values[0]
        let res2 = values[1]
        if (res1.code === 0) {
          res1.data.map(item => {
            item.key = item.apiId
            item.label = `${item.prefix.replace('/**', '')}${item.path} - ${item.apiName}`
          })
          that.selectApis = res1.data
        }
        if (res2.code === 0) {
          let apiIds = []
          res2.data.map(item => {
            if (!apiIds.includes(item.apiId)) {
              apiIds.push(item.apiId)
            }
          })
          that.formItem.apiIds = apiIds
        }
        that.modalVisible = true
      })
    },
    transferRender (item) {
      return `<span  title="${item.label}">${item.label}</span>`
    },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      if (newTargetKeys.indexOf('1') !== -1) {
        this.formItem.apiIds = ['1']
      } else {
        this.formItem.apiIds = newTargetKeys
      }
    },
    handleClick (name, row) {
      switch (name) {
        case 'remove':
          this.handleRemove(row)
          break
      }
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
