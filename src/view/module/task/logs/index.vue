<template>
  <div>
    <Card shadow>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="任务名称" prop="jobName">
          <Input type="text" v-model="pageInfo.jobName" placeholder="请输入关键字"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <Button @click="handleResetForm('searchForm')">重置</Button>
        </FormItem>
      </Form>

      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="status" slot-scope="{ row }">
          <Badge v-if="row.status===1" status="success" text="成功"/>
          <Badge v-else="" status="error" text="失败"/>
        </template>
        <template slot="type" slot-scope="{ row }">
          <p v-if="row.cronExpression">cron表达式:{{row.cronExpression}}</p>
          <p v-else="">调度时间:{{row.startDate}} ~ {{row.endDate}}</p>
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
        <Badge v-if="currentRow.status===1" status="success"/>
        <Badge v-else="" status="error"/>
        {{currentRow.jobName}}
      </div>
      <div>
        <p><strong>执行类：</strong>{{ currentRow.jobClass }}</p>
        <p><strong>触发器：</strong>{{currentRow.triggerClass}}</p>
        <p><strong>运行时长：</strong>{{ currentRow.runTime }} ms  </p>
        <p v-if="currentRow.cronExpression"><strong>cron表达式：</strong>{{currentRow.cronExpression}}</p>
        <p v-else=""><strong>调度时间：</strong>: {{currentRow.startDate}} ~ {{currentRow.endDate}}</p>
        <strong>执行参数</strong>
        <pre>
              {{ currentRow.jobData ? JSON.stringify(JSON.parse(currentRow.jobData), null, 4) : ''}}
        </pre>
        <strong>错误信息</strong>
        <pre>
          {{currentRow.exception}}
        </pre>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { getJobLogs } from '@/api/job'

export default {
  name: 'TaskJobLogs',
  data () {
    return {
      drawer: false,
      currentRow: {},
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        jobName: ''
      },
      columns: [
        {
          title: '任务名称',
          key: 'jobName',
          width: 150
        },
        {
          title: '调度信息',
          width: 350,
          slot: 'type'
        },
        {
          title: '执行结果',
          key: 'status',
          slot: 'status'
        },
        {
          title: '耗时',
          key: 'runTime',
          render: (h, params) => {
            return h('div', (params.row.runTime ? params.row.runTime : 0) + ' ms')
          }
        },
        {
          title: '创建时间',
          key: 'createTime'
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
      getJobLogs(this.pageInfo).then(res => {
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
