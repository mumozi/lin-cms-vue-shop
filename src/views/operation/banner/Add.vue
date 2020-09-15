<template>
    <div class="container">
        <div class="header">
            <span>新增轮播图</span>
            <span class="back" @click="handleBack">
                <i class="iconfont icon-fanhui"/> 返回
            </span>
        </div>
        <el-divider/>
        <div class="form-container">
            <el-row>
                <el-col :lg="16" :md="20" :sm="24" :xs="24">
                    <BannerForm @submit="handleSubmit"/>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import BannerForm from './components/Form'
    import banner from '@/models/banner'

    export default {
        name: 'Add',
        components: { BannerForm },
        methods: {
            async handleSubmit(formData) {
                // 格式化数据
                // map函数和for函数的对比，根据喜好选择。

                // const items = []
                // for (let i = 0; i < formData.items.length; i++) {
                //   const item = {
                //     img_id: formData.items[i].img_id,
                //     key_word: formData.items[i].key_word,
                //     type: formData.items[i].type,
                //   }
                //   items.push(item)
                // }
                // formData.items = items

                formData.items = formData.items.map(item => ({
                    img_id: item.img_id,
                    key_word: item.key_word,
                    type: item.type,
                }))

                // 调用模型方法新增轮播图
                try {
                    const res = await banner.createBanner(formData)
                    // 添加成功，弹出一条消息提示
                    this.$message.success(res.msg)
                    // 触发一次返回按钮事件，回到列表列表页面
                    this.handleBack()
                } catch (e) {
                    // 提示异常信息
                    this.$message.error(e.data.msg)
                }
            },
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
            margin-top: 40px;
        }
    }
</style>
