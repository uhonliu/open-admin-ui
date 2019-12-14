<template>
  <div class="userAdmin">
    <Card>
      <Form :label-width="120">
        <div class="formTitle">
          <span>基本信息</span>
        </div>
        <div class="tableBase">
          <div class="baseImg">
            <img v-if="userbaseInfo.avatar" :src="userbaseInfo.avatar" alt />
            <img
              v-if="userbaseInfo.avatar===''&&userbaseInfo.sex===1"
              src="@/assets/images/userdefault/man.png"
              alt
            />
            <img
              v-if="userbaseInfo.avatar===''&&userbaseInfo.sex===2"
              src="@/assets/images/userdefault/girl.png"
              alt
            />
            <img
              v-if="userbaseInfo.avatar===''&&userbaseInfo.sex===0"
              src="@/assets/images/userdefault/unknown.png"
              alt
            />
            <p>{{userbaseInfo.nickname}}</p>
          </div>
          <Row type="flex" justify="end" class="code-row-bg">
            <Col class="rowbase" span="4">用户ID</Col>
            <Col class="rowbase" span="4">{{userbaseInfo.userId}}</Col>
            <Col class="rowbase" span="4">手机</Col>
            <Col class="rowbase" span="4">{{userbaseInfo.mobile}}</Col>
          </Row>
          <Row type="flex" justify="end" class="code-row-bg">
            <Col class="rowbase" span="4">性别</Col>
            <Col
              class="rowbase"
              span="4"
            >{{userbaseInfo.sex===0?'保密':userbaseInfo.sex===1?'男':userbaseInfo.sex===2?'女':''}}</Col>
            <Col class="rowbase" span="4">邮箱</Col>
            <Col class="rowbase" span="4">{{userbaseInfo.email}}</Col>
          </Row>
          <Row type="flex" justify="end" class="code-row-bg">
            <Col class="rowbase" span="4">用户来源</Col>
            <Col class="rowbase" span="4">{{userbaseInfo.sourceStr}}</Col>
            <Col class="rowbase" span="4">注册时间</Col>
            <Col class="rowbase" span="4">{{userbaseInfo.registerTime}}</Col>
          </Row>
          <Row type="flex" justify="end" class="code-row-bg">
            <Col class="rowbase" span="4">最后登录时间</Col>
            <Col class="rowbase" span="4">{{userbaseInfo.lastLoginTime}}</Col>
            <Col class="rowbase" span="4"></Col>
            <Col class="rowbase" span="4"></Col>
          </Row>
        </div>
        <!-- <div class="formTitle">统计信息</div>
        <Table border :columns="columns" :data="data">
          <template slot="action" slot-scope="{ row  }">
            <Button type="primary" ghost @click="changeClientInfo(row.customer_id)">详情</Button>
          </template>
        </Table>
        <Page
          :total="pageInfo.total"
          show-elevator
          show-sizer
          transfer
          :current="pageInfo.page"
          :page-size="pageInfo.size"
          show-total
        />-->
        <div class="formTitle">收货地址</div>
        <Table border :columns="columns1" :data="data1">
          <template slot="action" slot-scope="{ row  }">
            <Button type="primary" ghost @click="changeInfo(row.id)">详情</Button>
          </template>
        </Table>
      </Form>
    </Card>
  </div>
</template>
<script>
import { getUserInfo } from '@/api/userclient'
export default {
  components: {

  },
  data () {
    return {
      idNow: '',
      userbaseInfo: {}, // 基本信息
      addFrom: {
        name: '',
        englishname: '',
        belong: '',
        creater: '',
        address: ''
      },
      ruleFrom: {},
      alltypes: [1, 0],
      allPlats: '',
      allWebs: '',
      addAllFrom: {
        name: '',
        isBig: '',
        admin: ''
      },
      ruleAllFrom: {},
      modalAll: false,
      columns: [
        {
          title: '消费金额',
          key: 'customer_name'
        },
        {
          title: '订单数量',
          key: 'customer_tel'
        },
        {
          title: '积分数量',
          key: 'customer_email'
        },
        {
          title: '跨境指数',
          key: 'customer_qq'
        },
        {
          title: '浏览量',
          key: 'customer_wx'
        },
        {
          title: '登录次数',
          key: 'customer_wx'
        }
      ],
      data: [
        {
          index: 1,
          name: '12822222',
          phone: 'John Brown',
          email: '50-100',
          qq: 100,
          wx: 'wx'
        }
      ],
      columns1: [
        {
          title: '姓名',
          key: 'resource'
        },
        {
          title: '手机号码',
          key: 'orderId'
        },
        {
          title: '详细地址',
          key: 'customer'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 50
        }
      ],
      data1: [],
      pageInfo: {
        total: 0,
        page: 1,
        size: 10
      }
    }
  },
  methods: {
    getInfo (id) {
      getUserInfo(id)
        .then(
          res => {
            // console.log(res);
            if (res.code === 0) {
              // console.log(res.data.user);
              this.userbaseInfo = res.data.user
              this.data1 = res.data.address
            }
          },
          err => {}
        )
        .finally(() => {})
    }
  },
  created () {
    this.idNow = { id: this.$route.query.id, type: 3 }
    this.getInfo(this.$route.query.id)
  },
  mounted () {}
}
</script>
<style lang="less">
.userAdmin {
  .ivu-card {
    padding-bottom: 20px;
  }
  .ivu-form {
    .ivu-btn {
      margin-right: 5px;
    }
    .ivu-col {
      button {
        margin-left: 20px;
      }
    }
  }
  .formTitle {
    font-size: 18px;
    color: #000;
    margin: 30px 0 10px 10px;
  }
  .ivu-row {
    .ivu-form-item {
      margin-bottom: 0px;
    }
  }
  .tableBase {
    position: relative;
    border: 1px solid #e5e5e5;
    margin-bottom: 20px;
    .baseImg {
      position: absolute;
      padding-left: 13%;
      padding-top: 10px;
      img {
        display: block;
        width: 80px;
        height: 80px;
        border: 1px solid #e5e5e5;
        border-radius: 50%;
      }
      p {
        text-align: center;
        margin-top: 5px;
      }
    }
    .rowbase {
      border: 1px solid #e5e5e5;
      padding: 5px 0;
      text-align: center;
    }
  }
}
</style>
