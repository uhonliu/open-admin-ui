<template>
  <div class="payAdmin">
    <Card v-show="listModel">
      <Form ref="searchForm" :model="searchForm" class :label-width="80" inline>
        <FormItem label="渠道编码" prop="channelCode">
          <Input style="width:200px;" clearable v-model="searchForm.channelCode" placeholder="请输入" />
        </FormItem>
        <FormItem label="商户ID" prop="mchId">
          <Input style="width:200px;" clearable v-model="searchForm.mchId" placeholder="请输入" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList('searchForm')">查询</Button>
          <Button @click="clearHandler('searchForm')" type="primary" ghost>重置</Button>
        </FormItem>
      </Form>
      <Row justify="space-between">
        <Col span="2">
          <Button type="primary" @click="changeAdd">添加支付渠道</Button>
        </Col>
      </Row>
      <Table border :columns="columns" :data="data" :loading="loadTable">
        <template slot="status" slot-scope="{ row ,index }">
          <span>{{row.state===0?'停止使用':row.state===1?'使用中':'未知状态'}}</span>
        </template>
        <template slot="action" slot-scope="{ row ,index }">
          <Button type="primary" ghost @click="saleInfo(row.channelId)">详情</Button>
          <Button type="primary" ghost @click="editSale(row)">编辑</Button>
        </template>
      </Table>
      <Page
        :total="pageInfo.total"
        show-elevator
        show-sizer
        transfer
        :current="pageInfo.page"
        :page-size="pageInfo.size"
        show-total
        @on-change="handlePage"
        @on-page-size-change="handlePageSize"
      />
      <Modal v-model="modalAll" title="编写渠道信息" okText cancelText :mask-closable="false">
        <Form ref="addAllFrom" :model="addAllFrom" :rules="ruleAllFrom" :label-width="120">
          <FormItem label="商户ID：" prop="mchId">
            <Row>
              <Col>
                <Input v-model="addAllFrom.mchId" :maxlength="30" placeholder="请输入商户ID" />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="渠道商户ID：" prop="channelMchId">
            <Row>
              <Col>
                <Input v-model="addAllFrom.channelMchId" :maxlength="30" placeholder="请输入渠道商户ID" />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="渠道名称：" prop="channelCode">
            <Select
              style="width:200px;"
              clearable
              v-model="addAllFrom.channelCode"
              placeholder="请选择渠道"
            >
              <Option
                v-for="(item,index) in allocationType"
                :value="item.channelCode"
                :key="index"
              >{{item.channelName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="备注：" prop="remark">
            <Row>
              <Col>
                <Input v-model="addAllFrom.remark" type="textarea" placeholder="请输入备注" :rows="5" />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="支付配置：" prop="param">
            <Row>
              <Col>
                <Input
                  v-model="addAllFrom.param"
                  type="textarea"
                  placeholder="请输入支付配置信息"
                  :rows="10"
                />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="状态：" prop="state">
            <i-switch
              v-model="addAllFrom.state"
              :value="addAllFrom.state"
              size="large"
            >
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button
            class="footerBt"
            type="primary"
            size="small"
            long
            :loading="loadEdit"
            @click="ok('addAllFrom')"
          >提交</Button>
        </div>
      </Modal>
    </Card>
    <Card v-show="!listModel">
      <div>
        <Row>
          <Col span="8">渠道编码：{{listInfo.channelCode}}</Col>
        </Row>
        <Row>
          <Col span="8">渠道名称：{{listInfo.channelName}}</Col>
        </Row>
        <Row>
          <Col span="8">商户ID：{{listInfo.mchId}}</Col>
        </Row>
        <Row>
          <Col span="8">渠道商户ID：{{listInfo.channelMchId}}</Col>
        </Row>
        <Row>
          <Col span="8">状态：{{listInfo.state===0?'停止使用':listInfo.state===1?'使用中':''}}</Col>
        </Row>
        <Row>
          <Col span="8">备注信息：{{listInfo.remark}}</Col>
        </Row>
        <Row>
          <Col span="8">创建时间：{{listInfo.createTime}}</Col>
        </Row>
        <Row>
          <Col span="8">更新时间：{{listInfo.updateTime}}</Col>
        </Row>
      </div>
      <div>
        <Button type="primary" ghost @click="listModel=true">返回</Button>
      </div>
    </Card>
  </div>
</template>
<script>
import {
  getChannelList,
  getpayWayInfo,
  editpayWay,
  addpayWay,
  getAllpayWay
} from '@/api/payment'
export default {
  data () {
    return {
      allocationType: [],
      listModel: true,
      listInfo: {},
      loadTable: true,
      modalAll: false,
      loadEdit: false,
      addAllFrom: {},
      ruleAllFrom: {
        mchId: [
          {
            required: true,
            message: '商户ID不能为空',
            trigger: 'blur'
          }
        ],
        channelMchId: [
          {
            required: true,
            message: '渠道商户ID不能为空',
            trigger: 'blur'
          }
        ],
        channelCode: {
          required: true,
          message: '请选择渠道',
          trigger: 'change'
        }
      },
      columns: [
        {
          title: '渠道id',
          key: 'channelId'
        },
        {
          title: '渠道编码',
          key: 'channelCode'
        },
        {
          title: '商户ID',
          key: 'mchId'
        },
        {
          title: '渠道名称',
          key: 'channelName'
        },
        {
          title: '渠道商户ID',
          key: 'channelMchId'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '创建日期',
          key: 'createTime',
          sortable: true,
          minWidth: 70
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 100
        }
      ],
      data: [],
      searchForm: {
        channelCode: '',
        mchId: ''
      },
      searchstatecode: [1, 0],
      pageInfo: {
        channelCode: '',
        mchId: '',
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      selectobj: '',
      selects: [],
      editId: ''
    }
  },
  methods: {
    // 获取所有渠道
    getAllPayType () {
      getAllpayWay()
        .then(
          res => {
            console.log(res)
            if (res.code === 0) {
              this.allocationType = res.data
            }
          },
          err => {}
        )
        .finally(() => {})
    },
    getList () {
      let self = this
      let obj = this.searchForm
      self.loadTable = true
      // console.log(this.searchForm);
      for (let i in obj) {
        if (obj[i] || obj[i] === 0) {
          this.pageInfo[i] = obj[i]
        }
        if (obj[i] === undefined) {
          this.pageInfo[i] = ''
        }
      }
      if (obj.mchId === undefined) self.pageInfo.mchId = ''
      if (obj.channelCode === undefined) self.pageInfo.channelCode = ''
      getChannelList(this.pageInfo)
        .then(
          res => {
            // console.log(res);
            if (res.code === 0) {
              this.pageInfo.total = parseInt(res.data.total)
              let arrlist = res.data.records
              this.data = arrlist
              self.loadTable = false
              self.addAllFrom.state = true
            }
          },
          err => {}
        )
        .finally(() => {})
    },
    ok (all) {
      let self = this
      this.loadEdit = true
      this.$refs[all].validate(valid => {
        if (valid) {
          if (self.addAllFrom.state === true) self.addAllFrom.state = 1
          if (self.addAllFrom.state === false) self.addAllFrom.state = 0
          if (self.editId !== '') {
            editpayWay(self.addAllFrom)
              .then(
                res => {
                  // console.log(res);
                  if (res.code === 0) {
                    self.$Message.success('修改成功')
                    self.modalAll = false
                    self.loadEdit = false
                    self.editId = ''
                    self.getList()
                  } else {
                    self.loadEdit = false
                    self.$Message.success(res.message)
                  }
                },
                err => {
                  self.loadEdit = false
                }
              )
              .finally(() => {
                self.loadEdit = false
              })
          } else {
            self.allocationType.map(function (i, k) {
              if (self.addAllFrom.channelCode === i.channelCode) {
                self.addAllFrom.channelName = i.channelName
              }
            })
            console.log(self.addAllFrom)
            addpayWay(self.addAllFrom)
              .then(
                res1 => {
                  // console.log(res1);
                  if (res1.code === 0) {
                    self.$Message.success('新增成功')
                    self.modalAll = false
                    self.loadEdit = false
                    self.getList()
                    self.addAllFrom = {}
                  } else {
                    self.loadEdit = false
                    self.$Message.success(res.message)
                  }
                },
                err1 => {
                  self.loadEdit = false
                }
              )
              .finally(() => {
                self.loadEdit = false
              })
          }
        } else {
          self.loadEdit = false
        }
      })
    },
    clearHandler (all) {
      this.searchForm = {}
    },
    saleInfo (id) {
      getpayWayInfo(id)
        .then(
          res => {
            // console.log(res);
            if (res.code === 0) {
              this.listInfo = res.data
              this.listModel = false
            }
          },
          err => {}
        )
        .finally(() => {})
    },
    editSale (obj) {
      console.log(obj)
      // this.addAllFrom = obj;
      getpayWayInfo(obj.channelId)
        .then(
          res => {
            // console.log(res);
            if (res.code === 0) {
              if (res.data.state === 0) res.data.state = false
              if (res.data.state === 1) res.data.state = true
              this.addAllFrom = res.data
            }
          },
          err => {}
        )
        .finally(() => {})
      this.editId = obj.channelId
      this.modalAll = true
    },
    changeAdd () {
      this.addAllFrom = {}
      this.addAllFrom.state = true
      this.modalAll = true
    },
    // 分页
    handlePage (current) {
      this.pageInfo.pageIndex = current
      this.handleSearch()
    },
    handlePageSize (size) {
      this.pageInfo.pageSize = size
      this.handleSearch()
    },
    handleSearch (page) {
      if (page) {
        this.pageInfo.pageIndex = page
      }
      this.loading = true
      this.getList()
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.getAllPayType()
    this.getList()
  }
}
</script>
<style lang="less">
.payAdmin {
  .ivu-form,
  .ivu-row-flex {
    button {
      margin-right: 10px;
    }
  }
  .ivu-row {
    margin: 10px;
  }
  .ivu-table-wrapper {
    margin-top: 10px;
    button {
      margin-right: 10px;
    }
    .spanHd {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        margin-right: 5px;
      }
    }
  }
}
.ivu-modal-footer {
  text-align: center;
  .footerBt {
    width: 150px;
    height: 40px;
    font-size: 15px;
  }
}
</style>
