<template>
  <div class="leftTree">
    <Tree :data="data" @on-select-change="click" class="tree"></Tree>
  </div>
</template>
<script>
import {
  getMenu,
  searchDepartment,
  searchStaff,
  searchPosition
} from '@/api/organization'
export default {
  name: 'leftTree',
  props: {
    menuType: {
      type: String
    },
    isReload: {
      type: Boolean
    }
  },
  data () {
    return {
      data: [],
      searchDinfo: {
        status: '',
        companyId: '',
        departmentCode: '',
        departmentName: '',
        level: '',
        parentId: 0,
        seq: '',
        departmentId: '',
        pageIndex: '',
        pageSize: ''
      },
      staffInfo: {
        active: '',
        companyId: '',
        departmentId: '',
        jobnumber: '',
        mobile: '',
        name: '',
        pageIndex: 1,
        pageSize: 10,
        parentId: '',
        positionCode: '',
        positionId: '',
        positionName: '',
        userId: '',
        total: 0
      },
      positionInfo: {
        companyId: '',
        departmentId: '',
        pageIndex: '',
        pageSize: '',
        positionCode: '',
        positionId: '',
        positionName: '',
        status: ''
      }
    }
  },
  methods: {
    getTreeMenu () {
      const self = this
      getMenu().then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    },
    click (index, val) {
      const self = this
      if (this.menuType === 'department') {
        this.changeDepartmentList(val)
      } else if (this.menuType === 'position') {
        this.changePositionList(val)
      } else if (this.menuType === 'staff') {
        this.changeStaffList(val)
      }
    },
    changeDepartmentList (val) {
      if (val.companyId) {
        this.searchDinfo.companyId = val.companyId
        this.searchDinfo.parentId = ''
        this.getDepartmentList()
      } else if (val.departmentId) {
        this.searchDinfo.parentId = val.departmentId
        this.searchDinfo.companyId = ''
        this.getDepartmentList()
      }
    },
    changePositionList (val) {
      if (val.companyId) {
        this.positionInfo.companyId = val.companyId
        this.positionInfo.departmentId = ''
        this.getPositionList()
      } else if (val.departmentId) {
        this.positionInfo.companyId = ''
        this.positionInfo.departmentId = val.departmentId
        this.getPositionList()
      }
    },
    changeStaffList (val) {
      this.staffInfo.name = ''
      this.staffInfo.mobile = ''
      if (val.companyId) {
        this.staffInfo.companyId = val.companyId
        this.staffInfo.departmentId = ''
        this.getStaffList()
        this.$emit('searchStaff', val)
      } else if (val.departmentId) {
        this.staffInfo.companyId = ''
        this.staffInfo.departmentId = val.departmentId
        this.getStaffList()
        this.$emit('searchStaff', val)
      }
    },
    getDepartmentList () {
      searchDepartment(this.searchDinfo).then(res => {
        if (res.code === 0) {
          this.$emit('changeData', res.data.records)
        }
      })
    },
    getPositionList () {
      searchPosition(this.positionInfo).then(res => {
        if (res.code === 0) {
          this.$emit('changeData', res.data.records)
        }
      })
    },
    getStaffList () {
      searchStaff(this.staffInfo).then(res => {
        if (res.code === 0) {
          this.$emit('changeData', res.data)
        }
      })
    }
  },
  mounted () {
    this.getTreeMenu()
  },
  watch: {
    isReload: function (val, old) {
      // console.log(val, old);
      if (val) {
        this.getTreeMenu()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.leftTree {
  min-height: 500px;
  float: left;
  margin-right: 10px;
  padding: 0 30px;
  min-width: 205px;
  /deep/ .ivu-tree ul {
    font-size: 14px;
  }
}
</style>
