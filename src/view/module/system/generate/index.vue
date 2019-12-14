<template>
  <div>
    <Card shadow>
      <Steps :current="current">
        <Step title="数据库连接"></Step>
        <Step title="生产代码"></Step>
      </Steps>
      <Form style="margin-top: 20px;" ref="form" :model="formItem" :rules="formItemRules" :label-width="140">
        <FormItem v-show="current===0" label="数据库类型" prop="type">
          <Select v-model="formItem.type">
            <Option value="mysql">mysql</Option>
            <Option disabled value="oracle">oracle</Option>
          </Select>
        </FormItem>
        <FormItem v-show="current===0" label="驱动名称" prop="driverName">
          <Input v-model="formItem.driverName" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem v-show="current===0" label="连接地址" prop="url">
          <Input v-model="formItem.url" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem v-show="current===0" label="用户名" prop="username">
          <Input v-model="formItem.username" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem v-show="current===0" label="密码" prop="password">
          <Input v-model="formItem.password" type="password" placeholder="请输入内容"></Input>
        </FormItem>
        <Row>
          <Col span="10">
          <FormItem v-show="current===1" label="模块名称" prop="moduleName">
            <Input v-model="formItem.moduleName" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem v-show="current===1" label="顶级包名" prop="parentPackage">
            <Input v-model="formItem.parentPackage" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem v-show="current===1" label="作者" prop="author">
            <Input v-model="formItem.author" placeholder="请输入内容"></Input>
          </FormItem>
          </Col>
          <Col span="14">
          <FormItem v-show="current===1" label="需要生成的表" prop="includeTables">
            <Transfer
              :data="selectTables"
              :list-style="{width: '45%',height: '500px'}"
              :titles="['选择表', '已选择表']"
              :target-keys="formItem.includeTables"
              @on-change="handleTransferChange"
              filterable>
            </Transfer>
          </FormItem>
          <FormItem v-show="current===1" label="忽略表前缀" prop="tablePrefix">
            <Select v-model="formItem.tablePrefix" multiple style="width:260px">
              <Option v-for="item in formItem.tablePrefix" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div style="margin-top: 20px;text-align: center">
        <Button v-if="current > 0" @click="up">上一步</Button>&nbsp;
        <Button v-if="current < 1" type="primary" @click="next">下一步</Button>&nbsp;
        <Button v-if="current===1" type="success" @click="handleSubmit" :loading="saving">确定生成</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import Generate from '@/api/generate'

export default {
  name: 'Generate',
  data () {
    return {
      saving: false,
      current: 0,
      selectTables: [],
      formItemRules: {
        type: [
          { required: true, message: '数据库类型不能为空', trigger: 'blur' }
        ],
        driverName: [
          { required: true, message: '驱动名称不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '数据库连接不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        parentPackage: [
          { required: true, message: '顶级包名不能为空', trigger: 'blur' }
        ],
        moduleName: [
          { required: true, message: '模块名不能为空', trigger: 'blur' }
        ],
        includeTables: [
          { required: true, message: '生成表名不能为空', trigger: 'blur', type: 'array', min: 1 }
        ],
        tablePrefix: [
          { required: true, message: '忽略表名前缀不能为空', trigger: 'blur', type: 'array', min: 1 }
        ]
      },
      formItem: {
        type: 'mysql',
        driverName: 'com.mysql.cj.jdbc.Driver',
        url: 'jdbc:mysql://localhost:3306/open-platform?useSSL=false&useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai',
        username: 'root',
        password: 'root',
        author: 'admin',
        parentPackage: 'com.opencloud',
        moduleName: 'base',
        includeTables: [],
        tablePrefix: []
      }
    }
  },
  methods: {
    up () {
      if (this.current === 0) {
        this.current = 0
      } else {
        this.current -= 1
      }
    },
    next () {
      if (this.current === 1) {
        this.current = 0
      } else {
        this.current += 1
      }
    },
    handleSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saving = true
          const data = Object.assign({}, this.formItem)
          Generate.execute(data).then(res => {
            if (res.code === 0) {
              let result = res.data
              let href = Generate.downloadPath + '?filePath=' + result.filePath
              this.$Modal.confirm({
                title: '是否下载',
                content: `代码生成成功! ${result.fileName}`,
                onOk: () => {
                  window.open(href, '_blank')
                }
              })
            }
          }).finally(() => {
            this.saving = false
          })
        }
      })
    },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      let tablePrefix = []
      newTargetKeys.map(item => {
        let prefix = item.split('_')[0] + '_'
        if (!tablePrefix.includes(prefix)) {
          tablePrefix.push(prefix)
        }
      })
      this.formItem.tablePrefix = tablePrefix
      this.formItem.includeTables = newTargetKeys
    }
  },
  mounted: function () {
  },
  watch: {
    'current' (val) {
      let that = this
      if (val === 1) {
        Generate.tables(this.formItem).then(res => {
          if (res.code === 0) {
            let items = []
            res.data.map(item => {
              items.push({
                key: item.name,
                label: `${item.name} - ${item.comment}`,
                disabled: false
              })
            })
            that.selectTables = items
          }
        })
      }
    }
  }
}
</script>
