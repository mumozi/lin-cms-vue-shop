const operationRouter = {
    route: null,
    name: null,
    title: '运营管理',
    type: 'folder', // 类型: folder, tab, view
    icon: 'iconfont icon-tushuguanli', // 菜单图标
    filePath: 'views/operation/', // 文件路径
    order: 2,
    inNav: true,
    children: [
        {
            title: '轮播图管理',
            type: 'folder',
            route: '/operation/banner',
            filePath: 'views/operation/banner/',
            inNav: true,
            icon: 'iconfont icon-tushuguanli',
            children: [
                {
                    title: '轮播图列表',
                    type: 'view',
                    route: '/operation/banner/list',
                    filePath: 'views/operation/banner/List.vue',
                    inNav: true,
                    icon: 'iconfont icon-tushuguanli',
                },
            ],
        },
        // 精选主题路由配置信息
        {
            title: '主题管理',
            type: 'folder',
            route: '/operation/theme',
            inNav: true,
            icon: 'iconfont icon-tushuguanli',
            children: [
                {
                    title: '主题列表',
                    type: 'view',
                    route: '/operation/theme/list',
                    filePath: 'views/operation/theme/List.vue',
                    inNav: true,
                    icon: 'iconfont icon-tushuguanli',
                },
            ],
        },
    ],
}

export default operationRouter
