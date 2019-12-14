<template>
  <div class="payAdmin">
    <Card v-show="listModel">
      <Form ref="searchForm" :model="searchForm" class :label-width="80" inline>
        <FormItem label="支付单号：" prop="payOrderId">
          <Input style="width:200px;" clearable v-model="searchForm.payOrderId" placeholder="请输入" />
        </FormItem>
        <FormItem label="商户单号：" prop="mchOrderNo">
          <Input style="width:200px;" clearable v-model="searchForm.mchOrderNo" placeholder="请输入" />
        </FormItem>
        <FormItem label="商户ID" prop="mchId">
          <Input style="width:200px;" clearable v-model="searchForm.mchId" placeholder="请输入" />
        </FormItem>
        <FormItem label="订单状态：" prop="status">
          <Select style="width:200px;" clearable v-model="searchForm.status" placeholder="全部订单">
            <Option
              v-for="(item,index) in allocationType"
              :value="item.key"
              :key="index"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label prop="dateRange">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            placeholder="选择最后跟进日期范围"
            style="width: 200px"
            v-model="searchForm.dateRange"
            @on-change="choicedate"
          ></DatePicker>
        </FormItem>-->
        <FormItem>
          <Button type="primary" @click="getList('searchForm')">查询</Button>
          <Button @click="clearHandler('searchForm')" type="primary" ghost>重置</Button>
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loadTable">
        <template slot="amount" slot-scope="{ row ,index }">
          <span>{{(row.amount/100).toFixed(2)}}元</span>
        </template>
        <template slot="channelCode" slot-scope="{ row ,index }">
          <span>{{row.channelCode}}</span>
        </template>
        <template slot="status" slot-scope="{ row ,index }">
          <span>{{row.status===0?'订单生成':row.status===1?'支付中':row.status===2?'支付成功':row.status===3?'业务处理完成':'未知状态'}}</span>
        </template>
        <template slot="action" slot-scope="{ row ,index }">
          <Button type="primary" ghost @click="clientInfo(row.payOrderId)">详情</Button>
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
    </Card>
    <Card v-show="!listModel">
      <div>
        <Row>
          <Col span="8">支付单号：{{listInfo.payOrderId}}</Col>
        </Row>
        <Row>
          <Col span="8">商户ID：{{listInfo.mchId}}</Col>
        </Row>
        <Row>
          <Col span="8">商户单号：{{listInfo.mchOrderNo}}</Col>
        </Row>
        <Row>
          <Col
            span="8"
          >订单状态：{{listInfo.status===0?'订单生成':listInfo.status===1?'支付中':listInfo.status===2?'支付成功':listInfo.status===3?'业务处理完成':'未知状态'}}</Col>
        </Row>
        <!-- <Row>
          <Col span="8">商品标题：{{listInfo.subject}}</Col>
        </Row>
        <Row>
          <Col span="8">商品金额：{{listInfo.amount}}元</Col>
        </Row>-->
        <Row>
          <Col span="8">支付金额：{{(listInfo.amount/100).toFixed(2)}}元</Col>
        </Row>
        <Row>
          <Col span="8">创建时间：{{listInfo.createTime}}</Col>
        </Row>
        <Row>
          <Col span="8">成功时间：{{listInfo.paySuccTime}}</Col>
        </Row>
      </div>
      <div>
        <Button type="primary" ghost @click="listModel=true">返回</Button>
      </div>
    </Card>
  </div>
</template>
<script>
import { getPayList, getPayInfo, getAllpayWay } from '@/api/payment'
export default {
  data () {
    return {
      allocationType: [
        { key: 0, name: '订单生成' },
        { key: 1, name: '支付中' },
        { key: 2, name: '支付成功' },
        { key: 3, name: '业务处理完成' }
      ],
      listModel: true,
      listInfo: {},
      loadTable: true,
      columns: [
        {
          title: '支付单号',
          key: 'payOrderId',
          sortable: true
        },
        {
          title: '商户ID',
          key: 'mchId'
        },
        {
          title: '商户单号',
          key: 'mchOrderNo'
        },
        {
          title: '支付渠道',
          key: 'channelCode',
          slot: 'channelCode'
        },
        {
          title: '支付金额(元)',
          slot: 'amount'
        },
        {
          title: '状态',
          slot: 'status'
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
        payOrderId: '',
        mchId: ''
      },
      searchstatecode: [1, 0],
      pageInfo: {
        payOrderId: '',
        mchId: '',
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      selectobj: '',
      selects: [],
      allType: []
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
              this.allType = res.data
            }
          },
          // eslint-disable-next-line handle-callback-err
          err => {}
        )
        .finally(() => {})
    },
    getList () {
      let self = this
      let obj = this.searchForm
      self.loadTable = true
      //   console.log(this.searchForm);
      for (let i in obj) {
        if (obj[i] || obj[i] === 0) {
          self.pageInfo[i] = obj[i]
        }
        if (obj[i] === undefined) {
          self.pageInfo[i] = ''
        }
      }
      if (obj.payOrderId === undefined) self.pageInfo.payOrderId = ''
      if (obj.mchId === undefined) self.pageInfo.mchId = ''
      if (obj.mchOrderNo === undefined) self.pageInfo.mchOrderNo = ''
      getPayList(this.pageInfo)
        .then(
          res => {
            console.log(res)
            if (res.code === 0) {
              this.pageInfo.total = parseInt(res.data.total)
              let arrlist = res.data.records
              arrlist.map(function (i, k) {
                self.allType.map(function (j, f) {
                  if (i.channelCode === j.channelCode) {
                    arrlist[k].channelCode = j.channelName
                  }
                })
              })
              this.data = arrlist
              self.loadTable = false
            }
          },
          // eslint-disable-next-line handle-callback-err
          err => {}
        )
        .finally(() => {})
    },
    clearHandler (all) {
      this.searchForm = {}
    },
    clientInfo (id) {
      getPayInfo(id)
        .then(
          res => {
            // console.log(res);
            if (res.code === 0) {
              this.listInfo = res.data
              this.listModel = false
            }
          },
          // eslint-disable-next-line handle-callback-err
          err => {}
        )
        .finally(() => {})
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
