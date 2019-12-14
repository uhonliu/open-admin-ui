## 运营后台管理UI

#### 按钮权限控制
 全局函数
 hasAuthority('功能编码,功能编码2') 多个用,号隔开  
 ```html
 <Button v-show="hasAuthority('systemUserCreate')" type="primary">
 ```

#### 初始化安装
```bush
// install dependencies
npm install
```
#### 修改配置(/src/config/index.js)
```
  /**
   *  发布目录
   */
  publicPath: {
    dev: '/', //  本地环境发布目录
    pro: '/admin' //  生产环境发布目录
  },
  /**
   *  api请求基础路径
   */
  apiUrl: {
    dev: 'http://39.106.187.125/api', //  本地环境接口请求地址
    pro: 'http://39.106.187.125/api' //  生产环境接口请求地址
  },
```
#### 本地运行
```bush
npm run dev
```
#### 打包部署
```bush
npm run build
```
#### 功能预览

<table>
	<tr>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/125654_a85872f7_791541.png"/></td>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130140_14d04387_791541.png"/></td>
  </tr>
  <tr>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130152_c96b3171_791541.png"/></td>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130201_0db637b1_791541.png"/></td>
  </tr>
  <tr>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130211_cd9ddb75_791541.png"/></td>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130221_2a7981e9_791541.png"/></td>
  </tr>
  <tr>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130230_f92ce88a_791541.png"/></td>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130242_7a25f1e5_791541.png"/></td>
  </tr>
  <tr>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130256_2874fa40_791541.png"/></td>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130306_5d533140_791541.png"/></td>
  </tr>
  <tr>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130317_8dabaced_791541.png"/></td>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130326_da7b3fb4_791541.png"/></td>
  </tr>
  <tr>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130335_713a714d_791541.png"/></td>
      <td><img src="https://images.gitee.com/uploads/images/2019/0328/130345_83f2bf83_791541.png"/></td>
  </tr>                                                
</table>
