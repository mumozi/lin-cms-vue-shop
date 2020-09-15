<!-- src/views/operation/theme/Add.vue -->
<template>
    <div class="container">
        <div class="header">
            <span>新增主题</span>
            <span class="back" @click="handleBack">
                <i class="iconfont icon-fanhui"/> 返回
            </span>
        </div>
        <el-divider/>
        <div class="form-container">
            <el-row>
                <el-col :lg="16" :md="20" :sm="24" :xs="24">
                    <theme-form @submit="handleSubmit"/>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import ThemeForm from './components/Form'
    import themeModel from '@/models/theme'

    export default {
        name: 'Add',
        components: { ThemeForm },
        methods: {
            /**
             * 处理表单组件的提交事件
             */
            async handleSubmit(formData) {
                try {
                    // 调用新增精选主题接口
                    const res = await themeModel.createTheme(formData.name, formData.description, formData.topic_img.id, formData.head_img.id)
                    // 将商品关联到新增的主题
                    const productIds = formData.products.map(p => p.id)
                    await themeModel.addThemeProduct(res.result.id, productIds)
                    // 页面消息提示
                    this.$message.success('精选主题新增成功')
                    this.handleBack()
                } catch (e) {
                    const msg = Object.values(e.data.msg).join('；')
                    this.$message.error(msg)
                }
            },
            /**
             * 处理返回按钮点击事件
             */
            handleBack() {
                this.$emit('back')
            },
        },
    }
</script>

<style lang="scss" scoped>
    .el-divider--horizontal {
        margin: 0
    }

    .container {

        .header {
            height: 59px;
            line-height: 59px;
            color: $parent-title-color;
            font-size: 16px;
            font-weight: 500;
            text-indent: 40px;

            .back {
                float: right;
                margin-right: 40px;
                cursor: pointer;
            }
        }

        .form-container {
            padding: 20px 20px 40px 20px;
        }
    }
</style>
