<template>
    <div v-if="!switchComponent" class="lin-container">
        <div class="lin-container">
            <div class="lin-title">主题列表</div>
            <div class="button-container">
                <!-- 指定button类型 -->
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
            <div class="table-container">
                <el-table v-loading="loading" :data="themeList">
                    <el-table-column type="index" label="序号" width="80"/>
                    <el-table-column prop="name" label="主题名称" width="250"/>
                    <el-table-column prop="description" label="主题介绍" width="300"/>
                    <el-table-column label="主题图片" width="250">
                        <template slot-scope="scope">
                            <img class="theme-img" :src="scope.row.topic_img.url"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="详情页头图" width="350">
                        <template slot-scope="scope">
                            <img class="theme-img" :src="scope.row.head_img.url"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" min-width="150">
                        <template slot-scope="scope">
                            <el-button plain size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
                            <el-button plain size="mini" type="danger" @click="handleDel(scope.row.id,scope.row.name)" v-auth="'删除主题'">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="showDialog"
                width="30%"
                center>
            <span>确定删除【{{themeName}}】的主题？</span>
            <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteTheme">确 定</el-button>
        </span>
        </el-dialog>
    </div>
    <component v-else :is="targetComponent" :themeId="id" @back="handleBack"/>
</template>

<script>
    import ThemeModel from '@/models/theme'
    import Add from "./Add";
    // 引入组件
    import Edit from './Edit'
    import banner from "../../../models/banner";
    export default {
        name: 'List',
        data() {
            return {
                // 控制对话框显示/隐藏，默认不显示
                showDialog: false,
                switchComponent: false,
                targetComponent: '',
                loading: false,
                themeList: [],
                id: null,
                themeName: null,
            }
        },
        created() {
            this.getThemes()
        },
        methods: {

            /**
             * 获取精选主题列表
             */
            async getThemes() {
                try {
                    this.loading = true
                    this.themeList = await ThemeModel.getThemes()
                    this.loading = false
                } catch (e) {
                    this.$message.error('精选主题列表加载失败')
                    this.loading = false
                }
            },

            /*
             * 新增按钮点击事件
             */
            handleAdd() {
                this.switchComponent = true
                this.targetComponent = 'Add'
            },

            /**
             * 编辑按钮点击事件
             * @param row
             */
            handleEdit(id) {
                this.switchComponent = true
                this.targetComponent = 'Edit'
                this.id = id
            },

            // 删除按钮的点击事件
            handleDel(id, name) {
                // 数据绑定，用于显示对话框内容
                this.id = id
                this.themeName = name
                // 数据绑定，显示对话框
                this.showDialog = true
            },
            // 执行删除
            async deleteTheme() {
                // 关闭对话框
                this.showDialog = false
                // 显示加载状态
                this.loading = true
                const ids = [id]
                try {
                    // 调用模型方法删除
                    const res = await ThemeModel.delTheme(ids)
                    // 再次调用获取所有主题的方法
                    await this.getThemes()
                    // 关闭加载状态
                    this.loading = false
                    // 消息提示
                    this.$message({
                        message: res.msg,
                        type: 'success',
                    })
                }catch(e) {
                    this.loading = false
                    this.$message({
                        message: e.data.msg,
                        type: 'error',
                    })
                }
            },
            /**
             * 监听子组件的返回按钮事件
             */
            handleBack() {
                this.switchComponent = false
                this.targetComponent = ''
                this.getThemes()
            },
        },
        components: {
            Add,Edit
        },
    }
</script>

<style lang="scss" scoped>
    .button-container {
        margin-top: 30px;
        padding-left: 30px;
    }

    .table-container {
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;

        .theme-img {
            height: 120px;
            width: auto;
        }
    }
</style>
