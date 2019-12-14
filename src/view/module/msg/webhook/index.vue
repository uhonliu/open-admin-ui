<template>
  <div>
    <Card shadow>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="通知地址" prop="url">
          <Input type="text" v-model="pageInfo.url" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem label="业务类型" prop="type">
          <Input type="text" v-model="pageInfo.type" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem label="通知结果" prop="result">
          <Select v-model="pageInfo.result">
            <Option value="">全部</Option>
            <Option value="1">成功</Option>
            <Option value="0">失败</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <Button @click="handleResetForm('searchForm')">重置</Button>
        </FormItem>
      </Form>

      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="status" slot-scope="{ row }">
          <Badge v-if="row.result===1" status="success" text="成功"/>
          <Badge v-else="" status="error" text="失败"/>
        </template>
        <template slot="detail" slot-scope="{ row }">
          <a @click="openDrawer(row)">详情</a>
        </template>
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.limit" show-elevator
            show-sizer
            show-total
            @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Drawer width="50" :closable="false" v-model="drawer">
      <div slot="header">
        <Badge v-if="currentRow.result===1" status="success"/>
        <Badge v-else="" status="error"/>
        {{currentRow.url}}
      </div>
      <div>
        <h3>执行参数</h3>
        <pre>
              {{ currentRow.data ? JSON.stringify(JSON.parse(currentRow.data), null, 2) : ''}}
        </pre>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { getNotifyHttpLogs } from '@/api/msg'

export default {
  name: 'MsgHttpLogs',
  data () {
    return {
      drawer: false,
      currentRow: {},
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        url: '',
        type: '',
        result: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '通知标识',
          key: 'msgId',
          width: 200
        },
        {
          title: '通知地址',
          key: 'url',
          width: 350
        },
        {
          title: '业务类型',
          key: 'type',
          width: 150
        },
        {
          title: '通知结果',
          key: 'result',
          slot: 'status',
          width: 100
        },
        {
          title: '重试次数',
          key: 'retryNums',
          width: 100
        },
        {
          title: '通知次数',
          key: 'totalNums',
          width: 100
        },
        {
          title: '当前重试时间',
          key: 'delay',
          render: (h, params) => {
            return h('div', (params.row.delay ? params.row.delay / 1000 : 0) + ' s')
          },
          width: 200
        },
        {
          title: '最后修改时间',
          key: 'updateTime'
        },
        {
          title: '详情',
          slot: 'detail',
          fixed: 'right',
          width: 150
        }
      ],
      data: []
    }
  },
  methods: {
    openDrawer (data) {
      this.currentRow = data
      this.drawer = true
    },
    handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getNotifyHttpLogs(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handleResetForm (form) {
      this.$refs[form].resetFields()
    },
    handlePage (current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize (size) {
      this.pageInfo.limit = size
      this.handleSearch()
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
