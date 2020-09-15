<template>
    <div class="lin-container">
        <div class="lin-title">商品分类列表</div>
        <div class="button-container">
            <!-- 添加一个点击事件的回调方法  -->
            <el-button type="primary" @click="handleAdd">新增分类</el-button>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading">
                <el-table-column type="index" width="80"></el-table-column>
                <el-table-column label="分类名称" prop="name"></el-table-column>
                <el-table-column label="分类描述" prop="description"></el-table-column>
                <!-- 操作列 -->
                <el-table-column label="操作" fixed="right" width="170">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 引入对话框组件 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handleClose">
            <el-form ref="form" :model="temp" status-icon label-width="100px"
                     @submit.native.prevent>
                <el-form-item label="名称" prop="name">
                    <el-input size="medium" v-model="temp.name" placeholder="分类名称"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="description">
                    <el-input
                            size="medium"
                            type="textarea"
                            :rows="4"
                            placeholder="分类简介"
                            v-model="temp.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="分类图片" prop="img.id">
                    <upload-imgs ref="uploadEle" :max-num="1" :value="imgData" :remote-fuc="uploadImage"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-left:5px;">
                <el-button @click="resetForm('form')">重 置</el-button>
                <el-button type="primary" @click="confirm('form')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="提示"
                :visible.sync="showDialog"
                width="30%"
                center>
            <span>确定删除【{{categoryName}}】的分类？</span>
            <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteCategory">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import categoryModel from "../../../models/category"
    import UploadImgs from '@/components/base/upload-imgs'
    import { customImageUpload } from '../../../lin/utils/file'
    import banner from "../../../models/banner";

    export default {
        name: 'List',
        components: { UploadImgs },
        data() {
            return {
                loading: false,
                tableData: [],
                // 控制对话框显示/隐藏，默认不显示
                showDialog: false,
                // 是否显示对话框
                dialogFormVisible: false,
                // 对话框所属状态
                dialogStatus: '',
                // 根据状态显示对应对话框头部的文本信息
                textMap: {
                    update: '编辑分类',
                    create: '新增分类',
                },
                id: null,
                categoryName: null,
                temp: {
                    id: null,
                    name: '',
                    description: '',
                    img: {
                        id: '',
                        url: '',
                    },
                },
                imgData: [],
                row: null,
                rules: {
                    name: [
                        {
                            required: true,
                            message: '请输入分类名称',
                            trigger: 'blur',
                        },
                    ],
                    description: [
                        {
                            required: true,
                            message: '分类描述不能为空',
                            trigger: 'blur',
                        },
                    ],
                    'img.id': [
                        {
                            required: true,
                            message: '分类图片不能为空',
                            trigger: 'blur',
                        },
                    ],
                },
            }
        },
        created() {
            this.getCategory()
        },
        methods:{
            async getCategory() {
                let res
                try {
                    this.loading = true
                    this.tableData = await categoryModel.getCategory()
                    this.loading = false
                    this.tableData = [...res]
                } catch (e) {
                    this.loading = false
                }
            },

            /**
             * 新增分类按钮点击事件
             */
            handleAdd() {
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.temp = {
                    id: null,
                    name: '',
                    description: '',
                    img: {
                        id: '',
                        url: '',
                    },
                }
                this.resetForm('form')
            },

            /**
             * 对话框重置按钮点击事件
             */
            resetForm(formName) {
                // 通过配置对话框组件的@close事件监听，每次关闭对话框的时候也会触发这个方法
                this.imgData = this.dialogStatus === 'create' ? [] : [{
                    imgId: this.row.img.id,
                    display: this.row.img.url,
                }]
                // 使用this.$nextTick()可以等待dom生成以后再来获取dom对象
                this.$nextTick(() => {
                    this.$refs[formName].resetFields()
                })
            },
            /**
             * 对话框确认按钮点击事件
             */
            async confirm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        try {
                            if (this.dialogStatus === 'create') {
                                const res = await categoryModel.createCategory(this.temp.name, this.temp.description, this.temp.img.id)
                                this.$message.success(res.msg)
                            } else {
                                // 编辑场景
                                const res = await categoryModel.editCategory(this.temp.id,
                                    this.temp.name,
                                    this.temp.description,
                                    this.temp.img.id)
                                this.$message.success(res.msg)
                            }
                            this.dialogFormVisible = false
                            await this.getCategory()
                        } catch (e) {
                            this.$message.error(Object.values(e.data.msg).join('；'))
                        }
                    }
                })
            },
            // 自定义图片上传组件上传方法
            async uploadImage(file) {
                const res = await customImageUpload(file)
                // 给表单对象属性赋值，因为分类封面图仅会有一张图片，这里直接取第一个元素
                this.temp.img = res[0]
                // 给图片上传组件赋值，因为分类封面图仅会有一张图片，这里直接取第一个元素
                return Promise.resolve({
                    id: res[0].id,
                    url: res[0].url,
                })
            },
            /**
             * 编辑按钮点击事件
             * @param row
             */
            handleEdit(row) {
                // 将当前行记录的数据保存起来，用于重置表单的时候恢复图片上传组件的内容
                this.row = row
                // 将当前行的数据赋值到表单数据对象，用于初始化表单数据
                // 注意这里需要考虑深拷贝还是浅拷贝的问题
                // 如果直接使用this.temp = row（浅拷贝），会发现后面在修改数据的同时，表格的数据也会同步发生变化。
                this.temp = JSON.parse(JSON.stringify(row))
                // 初始化图片上传组件的图片内容
                this.imgData = [{
                    imgId: row.img.id,
                    display: row.img.url,
                }]

                this.dialogStatus = 'update'
                this.dialogFormVisible = true
            },

            /** 编辑按钮关闭事件 ...*/
            handleClose(){
                this.dialogFormVisible = false
                //this.getCategory()
            },

            // 删除按钮的点击事件
            handleDelete(row) {
                // 数据绑定，用于显示对话框内容
                this.id = row.id
                this.categoryName = row.name
                // 数据绑定，显示对话框
                this.showDialog = true
            },
            // 执行删除分类请求
            async deleteCategory() {
                // 关闭对话框
                this.showDialog = false
                // 显示加载状态
                this.loading = true
                try {
                    // 调用模型方法删除
                    const res = await categoryModel.delCategory([this.id])
                    // 再次调用获取所有轮播图的方法
                    await this.getCategory()
                    // 关闭加载状态
                    this.loading = false
                    // 消息提示
                    this.$message({
                        message: res.msg,
                        type: 'success',
                    })
                    //this.$message.success(res.msg)
                }catch(e) {
                    this.loading = false
                    this.$message({
                        message: e.data.msg,
                        type: 'error',
                    })
                    //this.$message.error(e.msg)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .button-container{
        margin-top: 30px;
        padding-left: 30px;
    }

    .table-container{
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }
</style>
