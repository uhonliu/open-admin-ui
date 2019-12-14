<template>
  <div>
    <Button type="primary" @click="add('formItem')">新建</Button>
    <Table stripe :data="data" :columns="columns" :loading="tableLoading" style="margin-top:10px;">
      <template slot="operation" slot-scope="row">
        <div class="operation">
          <span @click="deleteRow(row)">删除</span>
          <span @click="editor(row)">编辑</span>
        </div>
      </template>
    </Table>
    <Modal v-model="popup" footer-hide :title="title">
      <Form :model="formItem" :label-width="150" :rules="ruleValidate" class="form" ref="formItem">
        <FormItem label="所属企业" prop="companyId">
          <Select v-model="formItem.companyId">
            <Option
              v-for="item in companyList"
              :value="item.companyId"
              :key="item.companyId"
            >{{ item.companyName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="企业corpid" prop="corpId">
          <Input v-model="formItem.corpId"></Input>
        </FormItem>
        <FormItem label="应用的agentdid" prop="agentdId">
          <Input v-model="formItem.agentdId"></Input>
        </FormItem>
        <FormItem label="应用的APPKEY" prop="appKey">
          <Input v-model="formItem.appKey"></Input>
        </FormItem>
        <FormItem label="应用的APPsecret" prop="appSecret">
          <Input v-model="formItem.appSecret"></Input>
        </FormItem>
        <FormItem label="数据加密密钥" prop="encodingAesKey">
          <Input v-model="formItem.encodingAesKey"></Input>
        </FormItem>
        <FormItem label="加解密需要用到的token" prop="token">
          <Input v-model="formItem.token"></Input>
        </FormItem>
        <div class="btnDev">
          <Button type="primary" @click="submit">确定</Button>
          <Button @click="popup=false">取消</Button>
        </div>
      </Form>
    </Modal>
  </div>
</template>
<script>
import {
  companyInfo,
  searchDingTalk,
  addDingTalk,
  updateDingTalk,
  removeDingTalk
} from '@/api/organization'
export default {
  data () {
    return {
      popup: false,
      title: '新增配置',
      tableLoading: false,
      data: [],
      columns: [
        {
          title: '企业名称',
          align: 'center',
          key: 'companyName'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operation'
        }
      ],
      formItem: {
        agentdId: '',
        appKey: '',
        appSecret: '',
        companyId: '',
        corpId: '',
        encodingAesKey: '',
        token: ''
      },
      dingTalkInfo: {
        agentdId: '',
        appKey: '',
        appSecret: '',
        companyId: '',
        corpId: '',
        encodingAesKey: '',
        token: '',
        pageIndex: '',
        pageSize: ''
      },
      ruleValidate: {
        agentdId: [
          { required: true, message: 'agentdId不能为空', trigger: 'blur' }
        ],
        appKey: [
          { required: true, message: 'appKey不能为空', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: 'appSecret不能为空', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: 'companyId不能为空', trigger: 'change' }
        ],
        corpId: [{ required: true, message: 'corpId不能为空', trigger: 'blur' }]
      },
      companyList: []
    }
  },
  methods: {
    searchDingTalk () {
      searchDingTalk(this.dingTalkInfo).then(res => {
        if (res.code === 0) {
          this.data = res.data.records
        }
      })
    },
    getCompany () {
      companyInfo().then(res => {
        if (res.code === 0) {
          this.companyList = res.data
        }
      })
    },
    add (name) {
      this.popup = true
      this.title = '新增配置'
      this.$refs[name].resetFields()
    },
    editor (row) {
      this.popup = true
      this.title = '编辑'
      this.formItem = row.row
    },
    deleteRow (row) {
      this.$Modal.confirm({
        title: '确认删除吗？',
        onOk: () => {
          removeDingTalk({ companyId: row.row.companyId }).then(res => {
            if (res.code === 0) {
              this.searchDingTalk()
            }
          })
        }
      })
    },
    submit () {
      if (this.title === '新增配置') {
        addDingTalk(this.formItem).then(res => {
          if (res.code === 0) {
            this.$Message.success('添加成功')
            this.popup = false
            this.searchDingTalk()
          }
        })
      } else {
        updateDingTalk(this.formItem).then(res => {
          if (res.code === 0) {
            this.$Message.success('修改成功')
            this.popup = false
            this.searchDingTalk()
          }
        })
      }
    },
    changeData (val) {
      this.data = val
    }
  },
  mounted () {
    this.searchDingTalk()
    this.getCompany()
  }
}
</script>
<style lang="less" scoped>
.operation {
  span {
    color: #1890ff;
    margin: 4px;
    cursor: pointer;
  }
}
.btnDev {
  text-align: center;
  button {
    margin: 0 10px;
  }
}
</style>
