<template>
  <div>
    <leftTree
      menuType="department"
      @changeData="changeData"
      :isReload="isReload"
      @offReload="isReload=false"
    ></leftTree>
    <div>
      <Button type="primary" @click="add('formItem')">新建</Button>
      <Table
        border
        stripe
        :data="data"
        :columns="columns"
        :loading="tableLoading"
        style="margin-top:10px;"
      >
        <template slot="status" slot-scope="{row}">
          <i-switch
            v-model="row.status"
            :value="row.status"
            @on-change="isHomeShowSwitch(row)"
            size="large"
          ></i-switch>
        </template>
        <template slot="operation" slot-scope="row">
          <div class="operation">
            <span @click="editor(row)">编辑</span>
          </div>
        </template>
      </Table>
      <Modal v-model="popup" footer-hide :title="title">
        <Form :model="formItem" :label-width="80" :rules="ruleValidate" class="form" ref="formItem">
          <FormItem label="部门名称" prop="departmentName">
            <Input v-model="formItem.departmentName"></Input>
          </FormItem>
          <FormItem label="部门代码" prop="departmentCode">
            <Input v-model="formItem.departmentCode"></Input>
          </FormItem>
          <FormItem label="部门级别" prop="level">
            <Select v-model="formItem.level">
              <Option
                v-for="item in levelList"
                :value="String(item.value)"
                :key="item.value"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属企业" prop="companyId">
            <Select v-model="formItem.companyId" @on-change="changeCompany">
              <Option
                v-for="item in companyList"
                :value="item.companyId"
                :key="item.companyId"
              >{{ item.companyName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="上级部门" prop="parentId">
            <Select v-model="formItem.parentId" clearable>
              <Option
                v-for="item in departmentList"
                :value="item.departmentId"
                :key="item.departmentId"
              >{{ item.departmentName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="排序" prop="seq">
            <Input v-model="formItem.seq"></Input>
          </FormItem>
          <div class="btnDev">
            <Button type="primary" @click="submit">确定</Button>
            <Button @click="popup=false">取消</Button>
          </div>
        </Form>
      </Modal>
    </div>
  </div>
</template>
<script>
import {
  departmentList,
  changeDepartmentStatus,
  addDepartment,
  updateDepartment,
  companyInfo,
  getLevels,
  searchDepartmentList
} from '@/api/organization'
import leftTree from '@/view/module/organization/components/leftTree'
export default {
  components: {
    leftTree
  },
  data () {
    return {
      popup: false,
      title: '新增部门',
      tableLoading: false,
      data: [],
      columns: [
        {
          title: '序号',
          align: 'center',
          width: '60px',
          render: (h, params) => {
            return h('span', params.row._index + 1)
          }
        },
        {
          title: '部门名称',
          align: 'center',
          key: 'departmentName'
        },
        {
          title: '部门代码',
          align: 'center',
          key: 'departmentCode'
        },
        {
          title: '上级部门',
          align: 'center',
          key: 'parentName'
        },
        {
          title: '所属企业',
          align: 'center',
          key: 'companyName'
        },
        {
          title: '启用状态',
          align: 'center',
          slot: 'status'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operation',
          width: '80px'
        }
      ],
      formItem: {
        departmentId: '',
        departmentName: '',
        departmentCode: '',
        level: '',
        companyId: '',
        parentId: '',
        seq: '',
        status: ''
      },
      ruleValidate: {
        departmentName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        departmentCode: [
          { required: true, message: '部门代码不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '部门级别不能为空', trigger: 'change' }
        ],
        companyId: [
          { required: true, message: '所属企业不能为空', trigger: 'change' }
        ]
      },
      companyList: [],
      levelList: [],
      departmentList: [],
      isReload: false
    }
  },
  methods: {
    getLevel () {
      getLevels().then(res => {
        if (res.code === 0) {
          this.levelList = res.data.levels
        }
      })
    },
    getcompanyInfo () {
      companyInfo().then(res => {
        if (res.code === 0) {
          this.companyList = res.data
        }
      })
    },
    getDepartment () {
      departmentList({ companyId: this.formItem.companyId }).then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    },
    add (name) {
      this.popup = true
      this.title = '新增部门'
      this.$refs[name].resetFields()
    },
    editor (row) {
      // console.log(row);
      this.popup = true
      this.title = '编辑部门'
      this.formItem = row.row
      this.formItem.level = String(row.row.level)
      this.getSelectDepartment()
    },
    changeCompany (val) {
      this.getSelectDepartment(val)
    },
    getSelectDepartment (companyId) {
      // console.log(companyId);
      let obj = {}
      this.departmentList = []
      if (companyId) {
        obj = {
          companyId: companyId,
          departmentId: this.formItem.departmentId
        }
        this.searchDepartmentList(obj)
      } else if (this.formItem.companyId !== undefined) {
        obj = {
          companyId: this.formItem.companyId,
          departmentId: this.formItem.departmentId
        }
        this.searchDepartmentList(obj)
      } else {
        this.$Message.info('请先选择所属企业')
      }
    },
    searchDepartmentList (obj) {
      searchDepartmentList(obj).then(res => {
        if (res.code === 0) {
          this.departmentList = res.data
        }
      })
    },
    isHomeShowSwitch (row) {
      let status = 0
      if (row.status) {
        status = 1
      } else {
        status = 0
      }
      let obj = {
        departmentId: row.departmentId,
        status: status
      }
      changeDepartmentStatus(obj).then(res => {
        if (res.code === 0) {
          this.$Message.success('修改成功')
        }
      })
    },
    submit () {
      this.$refs['formItem'].validate(valid => {
        if (valid) {
          if (this.title === '新增部门') {
            addDepartment(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('添加成功')
                this.popup = false
                this.getDepartment()
                this.isReload = true
              }
            })
          } else {
            updateDepartment(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('修改成功')
                this.popup = false
                this.getDepartment()
                this.isReload = true
              }
            })
          }
        }
      })
    },
    changeData (val) {
      this.data = val
    }
  },
  mounted () {
    this.getDepartment()
    this.getcompanyInfo()
    this.getLevel()
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
/deep/ .ivu-table-wrapper{
  overflow: hidden !important;
}
</style>
