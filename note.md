```php
/**
├───public // 公共资源目录，该目录webpack原封打包
│    ├───icons // icon图片存放目录
│    │   favicon.ico // 本站favicon图片
│    │   iconfont.css // 阿里iconfont文件
│    │   index.html // template模板
│    │   robots.txt // Robots协议
├───script // 脚本
├───src
│    ├───assets // 静态资源文件存放目录
│    ├───components // 布局组件及业务基础组件
│    │   ├───layout // layout布局组件
│    │   ├───base // 通用基础组件库（包含element-ui二次封装组件）
│    ├───config // config配置项
│    │   ├───stage // 路由配置文件
│    │   │   error-code.js // 与服务端约定的错误状态码
│    │   │   index.js // 前端自定义配置项
│    ├───lin // Lin CMS核心库
│    │   ├───directives // 全局指令
│    │   ├───filter // 全局过滤器
│    │   ├───mixin // 全局mixin
│    │   ├───models // model层
│    │   ├───utils // 各种工具函数
│    ├───plugins // 插件
│    ├───router // 前端路由
│    │   ├───modules // 每个业务模型的路由树
│    │   │   home-router.js // 菜单路由
│    │   │   index.js // vue-router入口文件
│    │   │   routes.js // vue-router路由配置
│    ├───store // vuex状态管理文件
│    ├───views // 业务组件
│    │   App.vue // vue根组件
│    │   main.js // webpack打包入口
│   babel.config.js // babel配置文件
│   .browserslistrc // 适配浏览器版本
│   .eslintrc.js // eslint配置文件
│   .gitignore // git上传忽略文件
**/
```
