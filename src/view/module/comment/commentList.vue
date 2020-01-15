<template>
  <div class="comment-list padding16">
      <Form ref="searchForm" :model="searchForm" class="selector-wrapper clearfix" :label-width="70" inline>
        <span class="left-title">评论列表</span>
        <FormItem class="right-input" :label-width="0">
          <Button class="blue-btn" @click="getCommentListData">搜索</Button>
          <span @click="clearHandler" class="clear-btn">清空筛选条件</span>
        </FormItem>
        <FormItem class="right-input" :label-width="0" label="">
          <Input style="width:105px;" v-model="searchForm.searchContent" placeholder="商品名称/用户名"></Input>
        </FormItem>
        <FormItem class="right-input" style="width:100px;" :label-width="0" label="">
          <Select v-model="searchForm.commentType" placeholder="请选择类型">
            <Option :value="'goods'" >商品</Option>
            <Option :value="'course'" >课程</Option>
            <Option :value="'article'" >帖子</Option>
            <Option :value="'activity'" >活动</Option>
          </Select>
        </FormItem>
      </Form>
    <div class="btn-wrapper">
        <Button @click="batchAdopt" class="add blue-btn">批量通过审核</Button>
        <Button @click="batchReply" class="deleteSelected white-btn">批量回复</Button>
        <Button @click="batchShield" class="deleteSelected white-btn">批量屏蔽</Button>
    </div>
    <div class="table-wrapper clearfix">
        <Table @on-selection-change="selectChange" :loading="loading" border :columns="columns" :data="tableData">
          <template slot="source" slot-scope="{ row }">
            <span v-if="row.source == 1">客户端APP</span>
            <span v-else-if="row.source == 2">PC</span>
            <span v-else-if="row.source == 3">WAP</span>
            <span v-else>未知</span>
          </template>
          <template slot="status" slot-scope="{ row }">
            <span v-if="row.status == 1">未审核</span>
            <span v-else-if="row.status == 2">未回复</span>
            <span v-else-if="row.status == 3">已回复</span>
            <span v-else-if="row.status == 4">已屏蔽</span>
          </template>
          <template slot="replyNum" slot-scope="{ row }">
            <Button @click="replyInfo(row)" type="info">{{row.replyNum}}</Button>
          </template>
          <template slot="operation" slot-scope="{ row }">
            <div v-if="row.status == 1">
              <Button size="small" class="blue-btn" @click="adopt(row)">审核通过</Button>
            </div>
            <div v-else-if="row.status == 2">
              <Button size="small" class="blue-btn" @click="shield(row)">屏蔽</Button>
              <Button size="small" class="blue-btn" @click="reply(row)">回复</Button>
              <Button size="small" class="blue-btn" @click="toTop(row)">置顶</Button>
            </div>
            <div v-else-if="row.status == 3">
              <Button size="small" class="blue-btn" @click="shield(row)">屏蔽</Button>
              <Button size="small" class="blue-btn" @click="toTop(row)">置顶</Button>
            </div>
            <div v-else-if="row.status == 4"></div>
          </template>
        </Table>
        <Page
          class="pagination"
          @on-page-size-change="pageSizeChangeHandler"
          @on-change="changePageHandler"
          :current="current" :total="listTotal"
          :page-size="perPageCount"
          :page-size-opts="[3, 6, 10, 15]"
          show-total
          show-elevator
        />
    </div>
    <Modal
        v-model="isAdopt"
        title="Title"
        :loading="loading"
        @on-ok="isAdoptOK">
        <p>确定审核通过该评论吗？</p>
    </Modal>
    <Modal
        v-model="isShield"
        title="Title"
        :loading="loading"
        @on-ok="isShieldOK">
        <p>确定屏蔽该评论吗？</p>
    </Modal>
    <Modal
        v-model="isReply"
        title="回复"
        @on-ok="isReplyOk"
       >
        <Input v-model="replyContent" type="textarea" style="width: 100%" />
    </Modal>
    <Modal
        v-model="replyInfoModel"
        title="回复详情"
        @on-ok="ok"
        @on-cancel="cancel">
        <Table border ref="selection2" @on-selection-change='selectChange2' :columns="replyInfoDataColumns" :data="replyInfoData"></Table>
    </Modal>
  </div>
</template>

<script>
import { getCommentList, adoptComment, shieldComment, setCommentTop, commentReply, getReplyInfo, shieldReply } from '@/api/comment.js'
export default {
  name: 'attributeList',
  data () {
    return {
      replyInfoModel: false,
      isBatch: false,
      replyContent: '',
      isReply: false,
      isAdopt: false,
      isShield: false,
      deleteArray: [], // 批量删除  存id的数组
      spinShow: false, // 编辑页loading
      loading: false, // 表格loading
      isAdd: false, // 判断点击的是新增还是编辑
      perPageCount: 10, // 每页条数
      current: 1, // 当前页
      listTotal: 1, // 总条数
      formWrapper: false, // 控制表单页是否显示
      formData: {}, // 表单数据,
      searchForm: {
        searchContent: undefined,
        commentType: undefined
      },
      orders: ['desc', 'asc'],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          align: 'center',
          key: 'topicName'
        },
        {
          title: '评论内容',
          align: 'center',
          key: 'content'
        },
        {
          title: '用户名|ID',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.userName),
              h('div', params.row.userId)
            ]
            )
          }
        },
        {
          title: '来源',
          align: 'center',
          slot: 'source'
        },
        {
          title: '时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '点赞数',
          align: 'center',
          key: 'likeNum'
        },
        {
          title: '点踩数',
          align: 'center',
          key: 'unLikeNum'
        },
        {
          title: '回复数',
          align: 'center',
          slot: 'replyNum'
        },
        {
          title: '状态',
          align: 'center',
          slot: 'status'
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          slot: 'operation'
        }
      ],
      replyInfoDataColumns: [{
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '用户ID',
        key: 'fromUserId'
      },
      {
        title: '内容',
        key: 'content'
      }],
      tableData: [], // 表格数据
      rowData: {},
      replyInfoData: [],
      replyInfoArray: ''
    }
  },
  methods: {
    selectChange2 (rowData) {
      let self = this
      const arr = []
      rowData.forEach(element => {
        arr.push(element.replyId)
      })
      self.replyInfoArray = arr.join(',')
    },
    ok () {
      shieldReply({ replyIds: this.replyInfoArray }).then(res => {
        if (res.code === 0) {
          this.$Notice.success({
            title: '通知',
            desc: '回复已屏蔽'
          })
          this.getCommentListData()
          this.replyInfoModel = false
        } else {
          this.$Notice.warning({
            title: '通知',
            desc: '失败'
          })
          this.replyInfoModel = false
        }
      }).catch(err => {
        this.$Notice.warning({
          title: '通知',
          desc: '失败'
        })
        this.replyInfoModel = false
      })
    },
    cancel () {
      this.replyInfoModel = false
    },
    replyInfo (row) {
      this.replyInfoData = []
      getReplyInfo({ commentId: row.commentId }).then(res => {
        if (res.code === 0) {
          this.replyInfoModel = true
          this.replyInfoData = res.data
        }
      }).catch(err => {

      })
    },
    batchAdopt () {
      if (this.deleteArray.length > 0) {
        adoptComment({ commentIds: this.deleteArray }).then(res => {
          if (res.code === 0) {
            this.$Notice.success({
              title: '通知',
              desc: '评论审批通过成功！'
            })
            this.getCommentListData()
          } else {
            this.$Notice.warning({
              title: '通知',
              desc: '失败'
            })
          }
          this.isAdopt = false
        }).catch(err => {
          this.$Notice.warning({
            title: '通知',
            desc: '失败'
          })
          this.isAdopt = false
        })
      }
    },
    batchReply () {
      this.replyContent = ''
      this.isReply = true
      this.isBatch = true
    },
    batchShield () {
      this.isShield = true
      this.isBatch = true
    },
    isReplyOk () {
      let val = this.replyContent
      if (val && val.trim() !== '') {
        let params = {}
        if (this.isBatch === true) {
          params = { commentIds: this.deleteArray, replyContent: val }
        } else {
          params = { commentIds: this.rowData.commentId, replyContent: val }
        }
        commentReply(params).then(res => {
          if (res.code === 0) {
            this.$Notice.success({
              title: '通知',
              desc: '回复成功'
            })
            this.getCommentListData()
          } else {
            this.$Notice.success({
              title: '通知',
              desc: '失败'
            })
          }
          this.isReply = false
        }).catch(err => {
          this.$Notice.success({
            title: '通知',
            desc: '失败'
          })
          this.isReply = false
        })
      }
    },
    reply (row) {
      this.isBatch = false
      this.replyContent = ''
      this.isReply = true
      this.rowData = row
    },
    isShieldOK () {
      let params = {}
      if (this.isBatch === true) {
        params = { commentIds: this.deleteArray }
      } else {
        params = { commentIds: this.rowData.commentId }
      }
      shieldComment(params).then(res => {
        if (res.code === 0) {
          this.$Notice.success({
            title: '通知',
            desc: '评论已屏蔽'
          })
          this.getCommentListData()
        } else {
          this.$Notice.warning({
            title: '通知',
            desc: '失败'
          })
        }
        this.isShield = false
      }).catch(err => {
        this.isShield = false
        this.$Notice.warning({
          title: '通知',
          desc: '失败'
        })
      })
    },
    toTop (row) {
      this.isBatch = false
      setCommentTop({ commentId: row.commentId }).then(res => {
        if (res.code === 0) {
          this.$Notice.success({
            title: '通知',
            desc: '评论置顶成功！'
          })
          this.getCommentListData()
        } else {
          this.$Notice.warning({
            title: '通知',
            desc: '失败'
          })
        }
      }).catch(err => {
        this.$Notice.warning({
          title: '通知',
          desc: '失败'
        })
      })
    },
    shield (row) {
      this.isBatch = false
      this.isShield = true
      this.rowData = row
    },
    isAdoptOK () {
      adoptComment({ commentIds: this.rowData.commentId }).then(res => {
        if (res.code === 0) {
          this.$Notice.success({
            title: '通知',
            desc: '评论审批通过成功！'
          })
          this.getCommentListData()
        } else {
          this.$Notice.warning({
            title: '通知',
            desc: '失败'
          })
        }
        this.isAdopt = false
      }).catch(err => {
        this.$Notice.warning({
          title: '通知',
          desc: '失败'
        })
        this.isAdopt = false
      })
    },
    adopt (row) {
      this.isBatch = false
      this.isAdopt = true
      this.rowData = row
    },
    // 点击新增后的回调
    addHandler () {
      this.formWrapper = true
      this.isAdd = true
      this.formData = {

      }
    },
    // 获取分页获取评论
    getCommentListData (params = {}) {
      let self = this
      let pageData = {
        pageIndex: self.current,
        pageSize: self.perPageCount
      }
      params = { ...pageData, ...self.searchForm }
      self.loading = true
      getCommentList(params).then((res) => {
        self.tableData = res.data.records
        self.listTotal = parseInt(res.data.total)
        self.loading = false
      })
    },
    // 改变页码的回调
    changePageHandler (page = 1) {
      this.current = page
      this.getCommentListData()
    },
    // 改变每页条数的回调
    pageSizeChangeHandler (pageSize) {
      this.perPageCount = pageSize
      this.changePageHandler()
    },

    // 批量操作
    selectChange (rowData) {
      let self = this
      const arr = []
      rowData.forEach(element => {
        arr.push(element.commentId)
      })
      self.deleteArray = arr.join(',')
    },
    clearHandler () {
      this.searchForm = {
        commentType: undefined,
        searchContent: undefined
      }
    }
  },
  mounted () {

  },
  created () {
    this.getCommentListData()
  }
}
</script>

<style>
  .operate,
  .operate:hover{
    color: #3388FF;
    background: none;
    border-color: #fff;
    padding: 0;
    margin: 0;
    border: none;
    font-size: 12px;
    margin-right: 16px;
  }
  .operate:nth-child(2n){
    margin-right: 0px;
  }
</style>

<style scoped>
    /* 清楚浮动    在父元素加这个类 就可 */
    .clearfix::after{
        display: block;
        line-height: 0px;
        content: '';
        clear: both;
    }
    .padding16{
        padding: 16px;
        border-radius:2px;
    }
    .selector-wrapper{
        background: #F8F8F8;
        padding: 20px 20px 0px 20px;
        margin-bottom: 20px;
    }
    /* 筛选区域清空筛选条件样式 */
    .clear-btn{
        color: #3388FF;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
    }

    /* 筛选区域按钮样式 */
    .blue-btn,
    .blue-btn:hover{
        border-color: #3388FF;
        background: #3388FF;
        color: #fff;
        font-size: 12px;
        border-radius:2px;
        margin-right: 10px;
    }
    .white-btn,
    .white-btn:hover{
        border-color: #D8D8D8;
        background: #fff;
        color: #303133;
        font-size:12px;
        border-radius:2px;
        margin-right: 10px;
    }

    .comment-list {
        background: #fff;
        position: relative;
    }
    .table-wrapper {
        margin-top: 10px;
    }
    .table-wrapper .pagination {
        margin-top: 13px;
        height: 41px;
        line-height: 41px;
        /* border: 1px solid #e6e6e6; */
        border-top: none;
        float: right;
    }
    .comment-list .left-title {
        font-size: 22px;
    }
    .comment-list .right-input {
        float: right;
    }

    /* 表单样式 */
    .comment-list .form-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
        background: #fff;
        width: 100%;
        height: 881px;
    }
    .comment-list .form-wrapper .form {
        margin-top: 20px;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item {
        margin-bottom: 15px;
    }
    .comment-list .form-wrapper .form >>> .tips {
        font-weight: bold
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-form-item-label {
        font-weight: 400;
        font-size: 14px;
        color: #000;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-select,
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-select-selection,
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-select-selected-value,
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-input {
        border-radius: 2px;
        height: 38px;
        font-size: 14px;
        /* border: 1px solid #dcdee2; */
        width: 300px;
        line-height: 38px;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-select-selection .ivu-select-placeholder{
      height: 38px;
      line-height: 38px;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-select-dropdown {
        width: 300px;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-select-dropdown .ivu-select-dropdown-list {
        width: 300px;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-select-selected-value {
      border: none;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-input:focus,
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-input:hover {
        border: 1px solid #ccc;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item .ivu-input:focus {
        box-shadow: none;
    }
    .comment-list .form-wrapper .form >>> .ivu-form-item textarea {
        min-height: 200px;
    }
    .comment-list .form-wrapper .form .submitBtn {
        width: 92px;
        height: 38px;
        color: #fff;
        background-color: #3388FF;
        border-radius: 2px;
        cursor: pointer;
    }
    .comment-list .form-wrapper .form .submitBtn:hover {
        border: 1px solid #3388FF;
    }
    .comment-list .form-wrapper .form .cancelBtn {
        margin-left: 10px;
        width: 66px;
        height: 38px;
        border: 1px solid #C9C9C9;
        background-color: #fff;
        color: #555;
        border-radius: 2px;
        cursor: pointer;
    }
    .comment-list .form-wrapper .form .submitBtn:focus,
    .comment-list .form-wrapper .form .cancelBtn:focus {
        box-shadow: none;
    }
    .comment-list .form-wrapper .form .upload-wrapper {
        margin-left: 110px;
        margin-bottom: 10px;
    }
    .comment-list .form-wrapper .form .upload-wrapper .img-wrapper {
        width: 150px;
        height: 150px;
        border: 1px solid #ccc;
        margin-top: 10px;
    }
    .comment-list .form-wrapper .form .upload-wrapper .img-wrapper img{
      width: 150px;
      height: 150px;
    }
    .comment-list .form-wrapper .form >>> .upload-wrapper .ivu-upload .uploadBtn {
        width: 150px;
        height: 38px;
        color: #fff;
        background-color: #009688;
        border-radius: 2px;
        font-size: 14px;
    }
    .comment-list .form-wrapper .form >>> .upload-wrapper .ivu-upload .uploadBtn:hover {
        border: 1px solid #009688;
    }
    .comment-list .form-wrapper .form >>> .upload-wrapper .ivu-upload .uploadBtn:focus {
        box-shadow: none;
    }
</style>
