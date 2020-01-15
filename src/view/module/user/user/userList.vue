<template>
  <div class="userAdmin">
    <Card>
      <Form ref="searchForm" :model="searchForm" class :label-width="10" inline>
        <!-- <FormItem label prop="level">
          <Select style="width:200px;" clearable v-model="searchForm.level" placeholder="会员等级">
            <Option v-for="(item,index) in searchstatecode" :value="item" :key="index">{{item}}</Option>
          </Select>
        </FormItem>-->
        <FormItem label prop="source">
          <Select style="width:200px;" clearable v-model="searchForm.source" placeholder="用户来源">
            <Option
              v-for="(item,index)  in allResource"
              :value="item.name"
              :key="item.name"
            >{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label prop="status">
          <Select style="width:200px;" clearable v-model="searchForm.status" placeholder="账户状态">
            <Option
              v-for="item in searchstatecode"
              :value="item"
              :key="item"
            >{{item=== 0 ? '禁用' : '启用'}}</Option>
          </Select>
        </FormItem>

        <FormItem label prop="searchContent">
          <Input
            style="width:200px;"
            clearable
            v-model="searchForm.searchContent"
            placeholder="用户昵称、手机号、用户ID"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList('searchForm')">查询</Button>
          <Button @click="clearHandler" type="primary" ghost>重置</Button>
        </FormItem>
      </Form>
      <Row type="flex" justify="space-between">
        <Col span="8">
          <Button type="primary" ghost @click="switchUse">批量启用</Button>
          <Button type="primary" ghost @click="switchnoUse">批量停用</Button>
          <Button type="primary" ghost @click="pushAll">批量推送</Button>
        </Col>
        <Col span="1">
          <Button type="primary" @click="exportList">导出</Button>
        </Col>
      </Row>
      <Table
        border
        :columns="columns"
        :data="data"
        @on-selection-change="selectData"
        :loading="loadTable"
      >
        <!-- <template slot="source" slot-scope="{ row ,index }">
          <span>{{row.source===0?'跨境知道':row.source===1?'卖家成长':row.source===3?'人工录入':'未知来源'}}</span>
        </template>-->
        <template slot="status" slot-scope="{ row ,index }">
          <i-switch
            v-model="row.status"
            :value="row.status"
            @on-change="isHomeShowSwitch(row,index)"
            size="large"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </template>
        <template slot="action" slot-scope="{ row ,index }">
          <Button type="primary" ghost @click="changeInfo(row.userId)">查看</Button>
          <Button
            type="primary"
            ghost
            @click="pushClientIndex(row.userId)"
            :disabled="row.userType===2"
          >推送</Button>
        </template>
      </Table>
      <Page
        :total="pageInfo.total"
        show-elevator
        show-sizer
        transfer
        :current="pageInfo.pageIndex"
        :page-size="pageInfo.pageSize"
        show-total
        @on-change="handlePage"
        @on-page-size-change="handlePageSize"
      />
    </Card>
  </div>
</template>
<script>
import {
  getUserList,
  changeUserState,
  getType,
  pushClientSystem
} from '@/api/userclient'
import { getToken } from '@/libs/util'
export default {
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'No',
          type: 'index',
          sortable: true,
          width: 70
        },
        {
          title: '用户id',
          key: 'userId',
          minWidth: 70
        },
        {
          title: '手机号',
          key: 'mobile',
          minWidth: 80
        },
        {
          title: '用户昵称',
          key: 'nickname',
          minWidth: 50
        },
        {
          title: '用户来源',
          key: 'source',
          minWidth: 30
        },
        {
          title: '账户状态',
          slot: 'status',
          minWidth: 30
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 80
        }
      ],
      data: [],
      loadTabl: true,
      allResource: [],
      searchForm: {
        searchContent: '',
        source: '',
        status: ''
      },
      searchstatecode: [1, 0],
      pageInfo: {
        searchContent: '',
        source: '',
        status: '',
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      loadTable: true,
      selectArr: [],
      selectUserArr: [],
      objUserArr: []
    }
  },
  methods: {
    // 导出列表
    exportList () {
      // console.log(this.searchForm);
      let params = this.searchForm
      let formData = new FormData()
      formData.append('searchContent', this.searchForm.searchContent)
      formData.append('source', this.searchForm.source)
      formData.append('status', this.searchForm.status)
      // console.log(params);
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/plat/user/list/export', true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    changeInfo (id) {
      this.$router.push({
        name: 'userInfo',
        query: { id: id }
      })
    },
    selectData (val) {
      let self = this
      // console.log(val);
      this.selectUserArr = val
      val.map(function (i, k) {
        self.selectArr.push(i.userId)
      })
    },
    getList () {
      this.loadTable = true
      let obj = this.searchForm
      for (let i in obj) {
        if (obj[i] || obj[i] === 0) {
          this.pageInfo[i] = obj[i]
        }
        if (obj[i] === undefined) {
          this.pageInfo[i] = ''
        }
      }
      if (this.searchForm.searchContent === undefined) {
        this.pageInfo.searchContent = ''
      }
      getUserList(this.pageInfo)
        .then(
          res => {
            if (res.code === 0) {
              // console.log(this.allResource);
              this.pageInfo.total = parseInt(res.data.total)
              let arrlist = res.data.records
              let arrType = this.allResource
              arrlist.map(function (i, k) {
                if (i.status === 1) i.status = true
                if (i.status === 0) i.status = false
                arrType.map(function (j, d) {
                  if (i.source === j.name) i.source = j.value
                })
              })
              this.data = arrlist
              this.loadTable = false
            }
          },
          err => {}
        )
        .finally(() => {})
    },
    switchUse () {
      // console.log(this.selectArr);
      if (this.selectArr.length === 0) {
        this.$Message.warning('请选择启用的用户')
      } else {
        let selectStr = this.selectArr.join(',')
        let obj = { ids: selectStr, status: 1 }
        this.changeStatus(obj)
      }
    },
    switchnoUse () {
      if (this.selectArr.length === 0) {
        this.$Message.warning('请选择要禁用的用户')
      } else {
        let selectStr = this.selectArr.join(',')
        let obj = { ids: selectStr, status: 0 }
        this.changeStatus(obj)
      }
    },
    pushAll () {
      let self = this
      if (this.selectUserArr.length === 0) {
        this.$Message.warning('请选择要推送的用户')
      } else {
        // console.log(this.selectUserArr);
        let sarr = this.selectUserArr
        let sobj = []
        sarr.map(function (i, k) {
          sobj.push(i.userId)
        })
        // console.log(sobj);
        sobj = sobj.join(',')
        let objPush = {
          ids: sobj
        }
        this.pushClient(objPush)
      }
    },
    isHomeShowSwitch (isShow, index) {
      let objswitch = isShow
      console.log(objswitch)
      if (objswitch.status === false) objswitch.status = 0
      if (objswitch.status === true) objswitch.status = 1
      let obj = { ids: objswitch.userId, status: objswitch.status }
      this.changeStatus(obj)
    },
    changeStatus (obj) {
      changeUserState(obj)
        .then(
          res => {
            if (res.code === 0) {
              this.$Message.success('修改成功!')
              this.getList()
              this.selectArr = []
            }
          },
          err => {}
        )
        .finally(() => {})
    },
    clearHandler () {
      this.searchForm = {}
    },
    getType () {
      getType()
        .then(
          res => {
            if (res.code === 0) {
              this.allResource = res.data.user_source
              this.getList()
            }
          },
          err => {}
        )
        .finally(() => {})
    },
    // 推送到客户管理
    pushClientIndex (ids) {
      // console.log(obj);
      let objUser = {
        ids: ids
      }
      // this.objUserArr.push(objUser);
      this.pushClient(objUser)
    },
    pushClient (objArr) {
      // console.log(objArr);
      pushClientSystem(objArr)
        .then(
          res => {
            if (res.code === 0) {
              this.$Message.success('推送成功!')
              this.getList()
              this.selectArr = []
              this.objUserArr = []
            }
          },
          err => {
            this.getList()
            this.selectArr = []
            this.objUserArr = []
          }
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
      this.getList()
    }
  },
  created () {
    this.getType()
  },
  mounted () {
    // this.getList()
  }
}
</script>
<style lang="less">
.userAdmin {
  .ivu-form,
  .ivu-row-flex {
    button {
      margin-right: 10px;
    }
  }
  .ivu-table-wrapper {
    margin-top: 10px;
    .ivu-btn {
      margin-right: 5px;
    }
  }
}
</style>
