<template>
  <div>
    <Row :gutter="8">
      <Col :xs="8" :sm="8" :md="8" :lg="6">
      <Card shadow>
        <tree-table style="max-height:700px;overflow: auto"
                    expand-key="menuName"
                    @radio-click="rowClick"
                    :expand-type="false"
                    :is-fold="true"
                    :tree-type="true"
                    :selectable="false"
                    :columns="columns"
                    :data="data">
          <template slot="status" slot-scope="scope">
            <Badge v-if="scope.row.status===1" status="success"/>
            <Badge v-else="" status="error"/>
            <Icon :type="scope.row.icon" size="16"/>
          </template>
        </tree-table>
      </Card>
      </Col>
      <Col :xs="16" :sm="16" :md="16" :lg="10">
      <Card shadow>
        <div class="search-con search-con-top">
          <ButtonGroup>
            <Button type="primary" :disabled="hasAuthority('systemMenuEdit')?false:true" @click="setEnabled(true)">添加
            </Button>
            <Button type="primary" :disabled="formItem.menuId && hasAuthority('systemMenuEdit')?false:true"
                    @click="confirmModal = true">删除
            </Button>
          </ButtonGroup>
          <Modal
            v-model="confirmModal"
            title="提示"
            @on-ok="handleRemove">
            确定删除,菜单资源【{{formItem.menuName}}】吗?{{formItem.children && formItem.children.length > 0 ?
            '存在子菜单,将一起删除.是否继续?' : ''}}
          </Modal>
        </div>
        <Form ref="menuForm" :model="formItem" :rules="formItemRules" :label-width="80">
          <FormItem label="前端应用" prop="serviceId">
              <Select v-model="formItem.serviceId" filterable clearable>
                <Option :title="item.serviceName" v-for="(item,index) in selectServiceList"  @click.native="handleOnSelectService(item)"
                        :value="item.serviceId" :label="item.serviceName" v-bind:key="index">
                  <span>{{ item.serviceName }}</span>
                </Option>
              </Select>
            </FormItem>
            <FormItem label="上级菜单" prop="parentId">
            <treeselect
              v-model="formItem.parentId"
              :options="selectTreeData"
              :default-expand-level="1"
              :normalizer="treeSelectNormalizer"/>
          </FormItem>
          <FormItem label="菜单标识" prop="menuCode">
            <Input v-model="formItem.menuCode" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="菜单名称" prop="menuName">
            <Input v-model="formItem.menuName" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem label="页面地址" prop="path">
            <Input v-model="formItem.path" placeholder="请输入内容">
            <Select v-model="formItem.scheme" slot="prepend" style="width: 80px">
              <Option value="/">/</Option>
              <Option value="http://">http://</Option>
              <Option value="https://">https://</Option>
            </Select>
            <Select v-model="formItem.target" slot="append" style="width: 100px">
              <Option value="_self">窗口内打开</Option>
              <Option :disabled="formItem.scheme==='/'" value="_blank">新窗口打开</Option>
            </Select>
            </Input>
            <span v-if="formItem.scheme === '/'">前端组件：/view/module/{{formItem.path}}.vue</span>
            <span v-else="">跳转地址：{{formItem.scheme}}{{formItem.path}}</span>
          </FormItem>
          <FormItem label="图标">
            <Input v-model="formItem.icon" placeholder="请输入内容">
            <Icon size="22" :type="formItem.icon" slot="prepend"/>
            <Poptip width="600" slot="append" placement="bottom">
              <Button icon="ios-search"></Button>
              <div slot="content">
                <ul class="icons">
                  <li class="icons-item" :title="item" @click="onIconClick(item)" v-for="(item,index) in selectIcons" v-bind:key="index">
                    <Icon :type="item" size="28"/>
                    <p>{{item}}</p>
                  </li>
                </ul>
              </div>
            </Poptip>
            </Input>
          </FormItem>
          <FormItem label="优先级">
            <InputNumber v-model="formItem.priority"></InputNumber>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model="formItem.status" type="button">
              <Radio label="0">禁用</Radio>
              <Radio label="1">启用</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="formItem.menuDesc" type="textarea" placeholder="请输入内容"></Input>
          </FormItem>
          <FormItem>
            <Button @click="handleSubmit" :loading="saving" type="primary">保存</Button>
            <Button @click="setEnabled(true)" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Card>
      </Col>
      <Col :xs="16" :sm="16" :md="16" :lg="8">
      <Card shadow>
        <menu-action :value="formItem"></menu-action>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { listConvertTree } from '@/libs/util'
import { getMenus, updateMenu, addMenu, removeMenu, getAllServicesInMenu } from '@/api/menu'
import MenuAction from './menu-action.vue'
import icons from './icons'

export default {
  name: 'SystemMenu',
  components: {
    MenuAction
  },
  data () {
    const validateEn = (rule, value, callback) => {
      let reg = /^[_a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('菜单标识不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线'))
      } else {
        callback()
      }
    }
    return {
      confirmModal: false,
      saving: false,
      visible: false,
      selectIcons: icons,
      selectTreeData: [{
        menuId: 0,
        menuName: '无'
      }],
      selectServiceList: [],
      formItemRules: {
        parentId: [
          { required: false, message: '上级菜单', trigger: 'blur' }
        ],
        menuCode: [
          { required: true, validator: validateEn, trigger: 'blur' }
        ],
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ]
      },
      formItem: {
        serviceId: '',
        menuId: '',
        menuCode: '',
        menuName: '',
        icon: 'md-document',
        path: '',
        scheme: '/',
        target: '_self',
        status: 1,
        parentId: '0',
        priority: 0,
        menuDesc: ''
      },
      columns: [
        {
          title: '菜单名称',
          key: 'menuName',
          minWidth: '200px'
        },
        {
          title: '状态',
          key: 'status',
          type: 'template',
          minWidth: '100px',
          template: 'status'
        }
      ],
      data: []
    }
  },
  methods: {
    treeSelectNormalizer (node) {
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    },
    setSelectTree (data) {
      this.selectTreeData = data
    },
    setEnabled (enabled) {
      if (enabled) {
        this.handleReset()
      }
    },
    rowClick (data) {
      this.handleReset()
      if (data) {
        this.formItem = Object.assign({}, data.row)
      }
      this.formItem.status = this.formItem.status + ''
    },
    handleReset () {
      const newData = {
        serviceId: '',
        menuId: '',
        menuCode: '',
        menuName: '',
        icon: 'md-document',
        path: '',
        scheme: '/',
        target: '_self',
        status: '1',
        parentId: '0',
        priority: 0,
        menuDesc: ''
      }
      this.formItem = newData
      this.$refs['menuForm'].resetFields()
      this.saving = false
    },
    handleSubmit () {
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          this.saving = true
          if (this.formItem.menuId) {
            updateMenu(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('保存成功')
                this.handleSearch()
              }
            }).finally(() => {
              this.saving = false
            })
          } else {
            addMenu(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('保存成功')
                this.handleSearch()
              }
            }).finally(() => {
              this.saving = false
            })
          }
        }
      })
    },
    handleRemove () {
      removeMenu(this.formItem.menuId).then(res => {
        if (res.code === 0) {
          this.$Message.success('删除成功')
          this.handleReset()
          this.handleSearch()
        }
      })
    },
    onIconClick (item) {
      this.formItem.icon = item
    },
    handleSearch () {
      getMenus().then(res => {
        let opt = {
          primaryKey: 'menuId',
          parentKey: 'parentId',
          startPid: '0'
        }
        this.data = listConvertTree(res.data, opt)
        this.setSelectTree(this.data)
      })
    },
    handleOnSelectService (data) {
      // todo set parentId is 0 when serviceId changed
      if (data.serviceId !== this.formItem.serviceId) {
        this.formItem.parentId = '0'
      }
      this.formItem.serviceId = data.serviceId
    },
    handleLoadServices () {
      getAllServicesInMenu().then(res => {
        if (res.code === 0) {
          this.selectServiceList = res.data
        }
      })
    }
  },
  mounted: function () {
    this.handleLoadServices()
    this.handleSearch()
  }
}
</script>
<style>
  .icons {
    overflow: auto;
    zoom: 1;
    height: 300px;
  }

  .icons-item {
    float: left;
    margin: 6px;
    width: 60px;
    text-align: center;
    list-style: none;
    cursor: pointer;
    color: #5c6b77;
    transition: all .2s ease;
    position: relative;
  }

  .icons-item p {
    word-break: break-all;
    overflow: hidden;
  }
</style>
