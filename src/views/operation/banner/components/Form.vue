<template>
    <el-form ref="form" :rules="rules" :model="temp" status-icon label-width="100px" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
            <el-input size="medium" v-model="temp.name" placeholder="轮播图名称"/>
        </el-form-item>
        <el-form-item label="简介" prop="description">
            <el-input size="medium" type="textarea" :rows="4" placeholder="可选，轮播图简介" v-model="temp.description"/>
        </el-form-item>
        <!--轮播内容-->
        <el-form-item prop="items">
            <div v-if="temp.items.length" class="banner-item">
                <div v-for="(item,index) in temp.items" :key="index">
                    <div class="banner-item-title">
                        <div class="banner-item-title-text">轮播图{{ index+1 }}</div>
                        <l-icon name="minus-circle" color="#F4516C" @click="handleMinusItem(index)"/>
                    </div>
                    <el-form-item label="关键字" :prop="'items.'+index+'.key_word'"
                                  :rules="bannerItemRules.key_word">
                        <el-col :span="5">
                            <el-input size="medium" v-model="temp.items[index].key_word" placeholder="执行关键字"/>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="跳转类型" :prop="'items.'+index+'.type'" :rules="bannerItemRules.type">
                        <el-select v-model="temp.items[index].type" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="轮播内容" :prop="'items.'+index+'.img_id'" :rules="bannerItemRules.img_id">
                        <div  @click="handleUploadImg(index)">
                            <upload-imgs ref="uploadEle" :max-num="1" :value="bannerItemImg[index]"
                                         :remote-fuc="uploadImage"/>
                        </div>
                    </el-form-item>
                    <div v-if="index ===temp.items.length-1">
                        <el-link @click="handlePlusItem">添加<i class="el-icon-circle-plus-outline el-icon--right"/>
                        </el-link>
                    </div>
                </div>
            </div>
            <div v-else>
                <el-link @click="handlePlusItem">添加<i class="el-icon-circle-plus-outline el-icon--right"/></el-link>
            </div>
        </el-form-item>
        <!--按钮-->
        <el-form-item>
            <el-button @click="resetForm">重 置</el-button>
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import UploadImgs from '@/components/base/upload-imgs'
    import { customImageUpload } from '@/lin/utils/file'

    /** 生成随机字符串 */
    function createId() {
        return Math.random()
            .toString(36)
            .substring(2)
    }

    export default {
        name: 'Form',
        components: { UploadImgs },
        props: {
            data: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                temp: {
                    id: null,
                    name: null,
                    description: null,
                    items: [],
                },
                options: [
                    {
                        value: 0,
                        label: '无导向',
                    },
                    {
                        value: 1,
                        label: '导向商品',
                    },
                    {
                        value: 2,
                        label: '导向专题',
                    },
                ],
                currentUploadImgIndex: null,
                bannerItemImg: [],
                rules: {
                    name: [
                        {
                            required: true,
                            message: '请输入轮播图名称',
                            trigger: 'blur',
                        },
                    ],
                    items: [
                        {
                            required: true,
                            message: '轮播图元素不能为空',
                            trigger: 'blur',
                        },
                    ],
                },
                bannerItemRules: {
                    key_word: [
                        {
                            required: true,
                            message: '请配置关键字',
                            trigger: 'blur',
                        },
                    ],
                    type: [
                        {
                            required: true,
                            message: '请配置跳转类型',
                            trigger: 'blur',
                        },
                    ],
                    img_id: [
                        {
                            required: true,
                            message: '请上传轮播图图片',
                            trigger: 'blur',
                        },
                    ],
                },
            }
        },
        created() {
            // 如果有传入data就赋值给temp，没有就保持原来的temp，对应新增和编辑的场景
            this.temp = this.data != null ? JSON.parse(JSON.stringify(this.data)) : this.temp

            // 存在轮播图元素，初始化轮播图元素的图片组件
            if (this.temp.items.length > 0) {
                this.initBannerItemImage()
            }
        },
        methods: {
            /**
             * 初始化图片上传组件
             */
            initBannerItemImage() {
                this.bannerItemImg = []
                for (let i = 0; i < this.temp.items.length; i++) {
                    const item = this.temp.items[i]
                    const img = [{
                        id: createId(),
                        imgId: item.img.id,
                        display: item.img.url,
                    }]
                    this.bannerItemImg.push(img)
                }
            },
            /**
             * 添加轮播图元素点击事件
             */
            handlePlusItem() {
                const item = {
                    id: '',
                    banner_id: this.temp.id,
                    key_word: '',
                    img_id: '',
                    img: {
                        id: '',
                        url: '',
                    },
                }
                this.temp.items.push(item)
                this.bannerItemImg.push([])
            },
            /**
             * 删除轮播图图元素点击事件
             */
            handleMinusItem(index) {
                this.temp.items.splice(index, 1)
                this.bannerItemImg.splice(index, 1)
            },
            /**
             * 提交表单
             */
            async handleSubmit() {
                // 遍历banner下的items数组，把图片上传组件中的图片id赋值给每个item
                // 这一步不做的话，图片元素的表单检验不会通过
                for (let i = 0; i < this.temp.items.length; i++) {
                    // 取出图片上传组件中的数据，因为索引与items是一致的，可以一一对应每个item
                    // eslint-disable-next-line no-await-in-loop
                    const img = await this.$refs.uploadEle[i].getValue()
                    // 图片上传组件中有图片
                    if (img.length > 0) {
                        // 把对应的图片id赋值给item
                        this.temp.items[i].img_id = img[0].imgId
                    } else {
                        // 图片上传组件中没有图片，新增的时候或者清空了原来已有的图片
                        this.temp.items[i].img_id = ''
                    }
                }
                // 获取表单验证的结果，都通过就触发一个提交表单的事件
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.$emit('submit', this.temp)
                    }
                })
            },
            /**
             * 重置表单
             */
            resetForm() {
                if (this.data != null) {
                    this.temp = JSON.parse(JSON.stringify(this.data))
                } else {
                    this.temp = {
                        id: null,
                        name: null,
                        description: null,
                        items: [],
                    }
                }

                if (this.temp.items.length > 0) {
                    this.initBannerItemImage()
                }
            },
            /**
             * 自定义上传图片方法
             */
            async uploadImage(file) {
                const res = await customImageUpload(file)
                for (let i = 0; i < res.length; i++) {
                    const img = [{
                        id: createId(),
                        imgId: res[i].id,
                        display: res[i].url,
                    }]
                    this.bannerItemImg[this.currentUploadImgIndex] = img
                    return Promise.resolve({
                        id: res[i].id,
                        url: res[i].url,
                    })
                }
            },
            /**
             * 记录每次点击图片上传组件时当前轮播图元素的索引
             * 这个索引用于在每次成功上传图片后给bannerItemImg赋值用
             * @param index
             */
            handleUploadImg(index){
                console.log(index)
                this.currentUploadImgIndex = index
            }
        },
    }
</script>

<style lang="scss" scoped>
    .banner-item-title {
        display: flex;
        align-items: center;

        .banner-item-title-text {
            margin-right: 10px;
        }
    }
</style>
