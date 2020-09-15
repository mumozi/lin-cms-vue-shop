<template>
    <div class="container">
        <div class="header">
            <span>编辑精选主题</span>
            <span class="back" @click="handleBack">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
        </div>
        <el-divider></el-divider>
        <div class="form-container">
            <el-row>
                <el-col :lg="16" :md="20" :sm="24" :xs="24">
                    <theme-form v-if="theme" :data="theme" @submit="submitForm"></theme-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import themeModel from '@/models/theme'
    import ThemeForm from './components/Form'

    export default {
        name: 'Edit',
        components: { ThemeForm },
        props: {
            themeId: {
                type: Number,
            },
        },
        data() {
            return {
                loading: false,
                theme: null,
            }
        },
        async created() {
            this.theme = await themeModel.getThemeById(this.themeId)
        },

        methods:{
            // 表单提交事件处理
            async submitForm(formData) {
                try {
                    // 主题信息更新的处理逻辑
                    await this.updateThemeInfo(formData)
                    // 主题关联商品的处理逻辑
                    await this.updateThemeProduct(formData.products)
                    this.$message.success('编辑成功')
                    this.handleBack()
                } catch (e) {
                    this.$message.error(e)
                }
            },

            async updateThemeInfo(formData) {
                const params = this._processUpdateThemeInfoParams(formData)
                if (JSON.stringify(params) !== '{}') {
                    try {
                        await themeModel.updateThemeInfo(this.themeId, params)
                    } catch (e) {
                        throw Object.values(e.data.msg)
                            .join('；')
                    }
                }
            },

            async updateThemeProduct(newProducts) {
                // 待新增的主题商品
                let addThemeProduct = []
                // 待移除的主题商品
                let delThemeProduct = []

                const oriProductIds = this.theme.products.map(p => p.id)
                const newProductIds = newProducts.map(p => p.id)

                if (JSON.stringify(oriProductIds) !== JSON.stringify(newProductIds)) {
                    addThemeProduct = this._processAddThemeProductArray(oriProductIds, newProductIds)
                    delThemeProduct = this._processDelThemeProductArray(oriProductIds, newProductIds)
                }

                try {
                    // 判断是否需要发起新增主题商品
                    if (addThemeProduct.length > 0) {
                        await themeModel.addThemeProduct(this.themeId, addThemeProduct)
                    }
                    // 判断是否需要发起移除主题商品
                    if (delThemeProduct.length > 0) {
                        await themeModel.delThemeProduct(this.themeId, delThemeProduct)
                    }
                } catch (e) {
                    throw Object.values(e.data.msg)
                        .join('；')
                }
            },

            // 编辑主题信息接口的参数加工函数
            _processUpdateThemeInfoParams(formData) {
                const params = {}
                if (formData.name !== this.theme.name) {
                    params['name'] = formData.name
                }
                if (formData.description !== this.theme.description) {
                    params['description'] = formData.description

                }
                if (formData.topic_img.id !== this.theme.topic_img.id) {
                    params['topic_img_id'] = formData.topic_img.id

                }
                if (formData.head_img.id !== this.theme.head_img.id) {
                    params['head_img_id'] = formData.head_img.id

                }
                return params
            },
            // 待新增的主题商品数组的加工函数
            _processAddThemeProductArray(oriProductIds, newProductIds) {
                return newProductIds.filter(newPid => {
                    // 这里注意变量的命名，可以让你更好理解这里的含义。
                    // 这里在oriProductIds数据里找和newProductIds里id一样的元素
                    // 一个新添加的product,它的Id肯定是在oriProductIds里找不到的。
                    const product = oriProductIds.find(oriPid => oriPid === newPid)
                    return typeof (product) === 'undefined'
                })
            },
            // 待移除的主题商品数组的加工函数
            _processDelThemeProductArray(oriProductIds, newProductIds) {
                return oriProductIds.filter(oriPid => {
                    // 与上一个函数同理，只不过是反过来了。
                    const product = newProductIds.find(newPid => oriPid === newPid)
                    return typeof (product) === 'undefined'
                })
            },
            handleBack() {
                this.$emit('back')
            },
        }
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
