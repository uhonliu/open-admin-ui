<template>
  <div>
    <leftTree menuType="position" @changeData="changeData"></leftTree>
    <div>
      <Button type="primary" @click="add('formItem')">新建</Button>
      <Table
        stripe
        border
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
          <FormItem label="岗位名称" prop="positionName">
            <Input v-model="formItem.positionName"></Input>
          </FormItem>
          <FormItem label="岗位代码" prop="positionCode">
            <Input v-model="formItem.positionCode"></Input>
          </FormItem>
          <FormItem label="所属公司" prop="companyId">
            <Select v-model="formItem.companyId" @on-change="changeCompany">
              <Option
                v-for="item in companyList"
                :value="item.companyId"
                :key="item.companyId"
              >{{ item.companyName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属部门" prop="departmentId">
            <Select v-model="formItem.departmentId">
              <Option
                v-for="item in departmentList"
                :value="item.departmentId"
                :key="item.departmentId"
              >{{ item.departmentName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="显示顺序" prop="seq">
            <Input v-model="formItem.seq"></Input>
          </FormItem>
          <FormItem label="工作内容" prop="workContent">
            <Input type="textarea" v-model="formItem.workContent"></Input>
          </FormItem>
          <FormItem label="工作标准" prop="workStandard">
            <Input type="textarea" v-model="formItem.workStandard"></Input>
          </FormItem>
          <FormItem label="责任权重" prop="responsibilityWeight">
            <Input type="textarea" v-model="formItem.responsibilityWeight"></Input>
          </FormItem>
          <FormItem label="所需资格条件" prop="requiredQualifications">
            <Input type="textarea" v-model="formItem.requiredQualifications"></Input>
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
  getAllPosition,
  changePositionStatus,
  companyInfo,
  addPosition,
  updatePosition,
  departmentList
} from '@/api/organization'
import leftTree from '@/view/module/organization/components/leftTree'
export default {
  components: {
    leftTree
  },
  data () {
    return {
      popup: false,
      title: '新增岗位',
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
          title: '岗位名称',
          align: 'center',
          key: 'positionName'
        },
        {
          title: '岗位代码',
          align: 'center',
          key: 'positionCode'
        },
        {
          title: '岗位ID',
          align: 'center',
          key: 'positionId'
        },
        {
          title: '所属部门',
          align: 'center',
          key: 'departmentName'
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
        positionCode: '',
        positionName: '',
        requiredQualifications: '',
        responsibilityWeight: '',
        seq: '',
        workContent: '',
        workStandard: '',
        status: '',
        companyId: ''
      },
      ruleValidate: {
        positionName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ],
        positionCode: [
          { required: true, message: '岗位代码不能为空', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '所属公司不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '所属部门不能为空', trigger: 'change' }
        ]
      },
      departmentList: [],
      companyList: []
    }
  },
  methods: {
    getcompanyInfo () {
      companyInfo().then(res => {
        if (res.code === 0) {
          this.companyList = res.data
        }
      })
    },
    changeCompany (val) {
      this.getDepartment(val)
      this.formItem.departmentId = ''
    },
    getDepartment (val) {
      const companyId = val
      if (companyId === '' || companyId === undefined) {
        // this.$Message.info("请先选择公司");
        return
      }
      departmentList({ companyId: companyId }).then(res => {
        if (res.code === 0) {
          this.departmentList = res.data
        }
      })
    },
    getAllPosition () {
      getAllPosition().then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    },
    add (name) {
      this.popup = true
      this.title = '新增岗位'
      this.$refs[name].resetFields()
    },
    editor (row) {
      this.popup = true
      this.title = '编辑岗位'
      this.formItem = row.row
    },
    isHomeShowSwitch (row) {
      let status = 0
      if (row.status) {
        status = 1
      } else {
        status = 0
      }
      let obj = {
        positionId: row.positionId,
        status: status
      }
      changePositionStatus(obj).then(res => {
        if (res.code === 0) {
          this.$Message.success('修改成功')
        }
      })
    },
    submit () {
      this.$refs['formItem'].validate(valid => {
        if (valid) {
          if (this.title == '新增岗位') {
            addPosition(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('添加成功')
                this.popup = false
                this.getAllPosition()
              }
            })
          } else {
            updatePosition(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('修改成功')
                this.popup = false
                this.getAllPosition()
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
  watch: {
    'formItem.companyId' (old, val) {
      this.getDepartment(old)
    }
  },
  mounted () {
    this.getcompanyInfo()
    this.getAllPosition()
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
