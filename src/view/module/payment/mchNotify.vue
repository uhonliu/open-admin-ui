<template>
  <div class="payAdmin">
    <Card v-show="listModel">
      <Form ref="searchForm" :model="searchForm" class :label-width="80" inline>
        <FormItem label="订单号" prop="orderId">
          <Input style="width:200px;" clearable v-model="searchForm.orderId" placeholder="请输入" />
        </FormItem>
        <FormItem label="商户单号" prop="mchOrderNo">
          <Input style="width:200px;" clearable v-model="searchForm.mchOrderNo" placeholder="请输入" />
        </FormItem>
        <FormItem label="通知状态" prop="status">
          <Select style="width:200px;" clearable v-model="searchForm.status" placeholder="全部订单">
            <Option
              v-for="(item,index) in 3"
              :value="item"
              :key="index"
            >{{item===1?'通知中':item===2?'通知成功':item===3?'通知失败':''}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList('searchForm')">查询</Button>
          <Button @click="clearHandler('searchForm')" type="primary" ghost>重置</Button>
        </FormItem>
      </Form>

      <Table border :columns="columns" :data="data" :loading="loadTable">
        <template slot="orderType" slot-scope="{ row ,index }">
          <span>{{row.orderType==='1'?'支付':row.orderType==='2'?'转账':row.orderType==='3'?'退款':''}}</span>
        </template>
        <template slot="status" slot-scope="{ row ,index }">
          <span>{{row.status===1?'通知中':row.status===2?'通知成功':row.status===3?'通知失败':''}}</span>
        </template>
        <template slot="action" slot-scope="{ row ,index }">
          <Button type="primary" ghost @click="saleInfo(row.orderId)">详情</Button>
          <!-- <Button type="primary" ghost @click>发送通知</Button> -->
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
          <Col span="8">订单号：{{listInfo.orderId}}</Col>
        </Row>
        <Row>
          <Col span="8">商户ID：{{listInfo.mchId}}</Col>
        </Row>
        <Row>
          <Col
            span="8"
          >订单类型：{{listInfo.orderType==='1'?'支付':listInfo.orderType==='2'?'转账':listInfo.orderType==='3'?'退款':''}}</Col>
        </Row>
        <Row>
          <Col
            span="8"
          >状态：{{listInfo.status===1?'通知中':listInfo.status===2?'通知成功':listInfo.status===3?'通知失败':''}}</Col>
        </Row>
        <Row>
          <Col span="8">通知次数：{{listInfo.notifyCount}}</Col>
        </Row>
        <Row>
          <Col span="8">最后通知：{{listInfo.lastNotifyTime}}</Col>
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
import { getNotifyList, getNotifyInfo } from '@/api/payment'
export default {
  data () {
    return {
      allocationType: [
        { key: '0', name: '平台账户' },
        { key: '1', name: '私有账户' }
      ],
      listModel: true,
      listInfo: {},
      loadTable: true,
      modalAll: false,
      loadEdit: false,
      addAllFrom: {},
      ruleAllFrom: {
        name: [
          {
            required: true,
            message: '商户不能为空',
            trigger: 'blur'
          }
        ],
        type: {
          required: true,
          message: '请商户类型',
          trigger: 'change'
        }
      },
      columns: [
        {
          title: '订单号',
          key: 'orderId'
        },
        {
          title: '商户ID',
          key: 'mchId'
        },
        {
          title: '商户订单号',
          key: 'mchOrderNo'
        },
        {
          title: '订单类型',
          slot: 'orderType'
        },
        {
          title: '通知次数',
          key: 'notifyCount'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '最后通知',
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
        orderId: '',
        mchOrderNo: '',
        status: ''
      },
      searchstatecode: [1, 0],
      pageInfo: {
        orderId: '',
        mchOrderNo: '',
        status: '',
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
      if (obj.orderId === undefined) self.pageInfo.orderId = ''
      if (obj.mchOrderNo === undefined) self.pageInfo.mchOrderNo = ''
      getNotifyList(this.pageInfo)
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
    clearHandler (all) {
      this.searchForm = {}
    },
    saleInfo (id) {
      getNotifyInfo(id)
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
