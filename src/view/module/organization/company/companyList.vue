<template>
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
      <template slot="operation" slot-scope="row">
        <div class="operation">
          <span @click="editor(row)">编辑</span>
        </div>
      </template>
    </Table>
    <Modal :title="title" v-model="popup" footer-hide width="750" class="popupForm">
      <div class="title">
        <span v-bind:class="isbgcolor==1?'bgcolor':''">基础信息</span>
        <span v-bind:class="isbgcolor==2?'bgcolor':''">联系信息</span>
      </div>
      <Form :model="formItem" :label-width="80" :rules="ruleValidate" class="form" ref="formItem">
        <div v-if="isbgcolor==1" class="stepOne">
          <div class="clearfix">
            <div class="left">
              <FormItem label="企业全称" prop="companyName">
                <Input v-model="formItem.companyName"></Input>
              </FormItem>
              <FormItem label="显示顺序" prop="payer">
                <Input v-model="formItem.payer"></Input>
              </FormItem>
              <FormItem label="企业英文名" prop="companyNameEn">
                <Input v-model="formItem.companyNameEn"></Input>
              </FormItem>
              <FormItem label="企业性质" prop="natureId">
                <Input v-model="formItem.natureId"></Input>
              </FormItem>
              <FormItem label="所在区域" prop="areaId">
                <Input v-model="formItem.areaId"></Input>
              </FormItem>
              <FormItem label="成立时间" prop="establishedTime">
                <DatePicker
                  type="datetime"
                  v-model="formItem.establishedTime"
                  format="yyyy-MM-dd HH:mm:ss"
                ></DatePicker>
              </FormItem>
              <FormItem label="注册资金" prop="registeredCapital">
                <Input v-model="formItem.registeredCapital"></Input>
              </FormItem>
              <FormItem label="员工人数" prop="staffNum">
                <Input v-model="formItem.staffNum"></Input>
              </FormItem>
              <FormItem label="公司网址" prop="website">
                <Input v-model="formItem.website"></Input>
              </FormItem>
              <FormItem label="公司介绍" prop="profile">
                <Input v-model="formItem.profile" type="textarea"></Input>
              </FormItem>
            </div>
            <div class="right">
              <div class="imgBox">
                <span v-if="formItem.logo==''">企业logo</span>
                <img v-else :src="formItem.logo" alt />
              </div>
              <Upload
                :action="uploadUrl"
                :show-upload-list="false"
                :on-success="upsuccess"
                class="uploadImg"
                :data="{prefix:''}"
              >
                <Button icon="ios-cloud-upload-outline" type="primary">上传</Button>
              </Upload>
            </div>
          </div>
          <div class="next">
            <Button type="primary" @click="isbgcolor=2">下一步</Button>
          </div>
        </div>
        <div v-if="isbgcolor==2" class="stepTwo">
          <FormItem label="联系人" prop="contact">
            <Input v-model="formItem.contact"></Input>
          </FormItem>
          <FormItem label="电话" prop="phone">
            <Input v-model="formItem.phone"></Input>
          </FormItem>
          <FormItem label="传真" prop="fax">
            <Input v-model="formItem.fax"></Input>
          </FormItem>
          <FormItem label="电子邮件" prop="email">
            <Input v-model="formItem.email"></Input>
          </FormItem>
          <FormItem label="通信地址" prop="address">
            <Input v-model="formItem.address"></Input>
          </FormItem>
          <FormItem label="邮政编码" prop="postCode">
            <Input v-model="formItem.postCode"></Input>
          </FormItem>
          <div class="btnDev">
            <Button type="primary" @click="isbgcolor=1">上一步</Button>
            <Button type="primary" @click="submit">下一步</Button>
            <Button @click="popup=false;">取消</Button>
          </div>
        </div>
      </Form>
    </Modal>
  </div>
</template>
<script>
import {
  companyInfo,
  editCompany,
  addCompany
} from '@/api/organization'
export default {
  data () {
    return {
      tableLoading: false,
      title: '新增企业',
      popup: false,
      uploadUrl: this.baseUrl + '/file/oss/upload',
      data: [],
      columns: [
        {
          title: '企业全称',
          align: 'center',
          key: 'companyName'
        },
        {
          title: '企业ID',
          align: 'center',
          key: 'companyId'
        },
        {
          title: '联系人',
          align: 'center',
          key: 'contact'
        },
        {
          title: '电话',
          align: 'center',
          key: 'phone'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operation',
          width: '80px'
        }
      ],
      isbgcolor: 1,
      formItem: {
        address: '',
        areaId: '',
        companyName: '',
        contact: '',
        email: '',
        establishedTime: '',
        fax: '',
        industryId: '',
        logo: '',
        natureId: '',
        phone: '',
        postCode: '',
        profile: '',
        registeredCapital: '',
        staffNum: '',
        website: ''
      },
      ruleValidate: {
        companyName: [
          { required: true, message: '企业全称不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getCompanys () {
      this.tableLoading = true
      companyInfo().then(res => {
        if (res.code === 0) {
          this.data = res.data
          this.tableLoading = false
        }
      })
    },
    add (name) {
      this.popup = true
      this.title = '新增企业'
      this.isbgcolor = 1
      this.formItem = {
        address: '',
        areaId: '',
        companyName: '',
        contact: '',
        email: '',
        establishedTime: '',
        fax: '',
        industryId: '',
        logo: '',
        natureId: '',
        phone: '',
        postCode: '',
        profile: '',
        registeredCapital: '',
        staffNum: '',
        website: ''
      }
    },
    editor (row) {
      this.isbgcolor = 1
      this.popup = true
      this.title = '编辑企业'
      this.formItem = row.row
    },
    upsuccess (res, file, fileList) {
      this.formItem.logo = file.response.data.fileUrl
      // console.log(file);
    },
    formatDate (date) {
      if (typeof date === 'object') {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d + ' 00:00:00'
      } else {
        return date
      }
    },
    submit () {
      this.formItem.establishedTime = this.formatDate(
        this.formItem.establishedTime
      )
      this.$refs['formItem'].validate(valid => {
        if (valid) {
          if (this.title == '新增企业') {
            addCompany(this.formItem).then(res => {
              if (res.code === 0) {
                this.$Message.success('添加成功')
                this.getCompanys()
                this.popup = false
              }
            })
          } else {
            editCompany(this.formItem).then(res => {
              this.$Message.success('编辑成功')
              this.getCompanys()
              this.popup = false
            })
          }
        }
      })
    }
  },
  mounted () {
    this.getCompanys()
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
.popupForm {
  .title {
    height: 32px;
    line-height: 32px;
    span {
      display: inline-block;
      text-align: center;
      width: 49%;
      border: 1px solid #f2f2f2;
    }
    .bgcolor {
      background-color: #f2f2f2;
    }
  }
  .form {
    margin-top: 20px;
  }
  .stepOne {
    .clearfix {
      overflow: hidden;
      .left {
        width: 60%;
        float: left;
        /deep/ .ivu-date-picker {
          width: 100%;
        }
      }
      .right {
        float: right;
        width: 33%;
        .imgBox {
          width: 100%;
          height: 240px;
          text-align: center;
          line-height: 240px;
          font-size: 16px;
          border: 1px solid #c9c9c9;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .uploadImg {
          display: block;
          text-align: center;
          margin-top: 10px;
        }
      }
    }
    .next {
      width: 100%;
      button {
        margin: auto;
        display: block;
      }
    }
  }
  .stepTwo {
    width: 60%;
    .btnDev {
      margin-top: 140px;
      width: 160%;
      text-align: center;
      margin-bottom: 20px;
      button {
        margin: 0 10px;
      }
    }
  }
}
</style>
