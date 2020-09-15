<!-- src/views/product/product/List.vue -->
<template>
    <div class="lin-container">
        <div class="lin-title">商品列表</div>
        <div class="button-container">
            <el-button type="primary" v-auth="['新增商品']" @click="handleAdd">新增商品</el-button>
            <!-- 搜索框 -->
            <lin-search @query="onQueryChange" placeholder="搜索商品"/>
        </div>
        <div class="table-container">
            <el-table v-loading="loading" :data="productList">
                <el-table-column type="index" width="80"></el-table-column>
                <el-table-column label="商品图片" align="center" width="180">
                    <template slot-scope="props">
                        <img :src="props.row.main_img_url">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="name" width="180"/>
                <el-table-column label="所属分类" prop="category.name" width="180"/>
                <el-table-column label="商品单价" prop="price" width="180"/>
                <el-table-column label="商品库存" prop="stock" width="180"/>
                <el-table-column label="商品概要" prop="summary" width="180"/>
                <el-table-column label="商品状态" prop="status" width="110">
                    <template slot-scope="props">
                        <el-tag :type=" props.row.status ? 'success' :'info'">{{ props.row.status ? '上架中' :'已下架' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="260">
                    <template slot-scope="props">
                        <el-button :type="props.row.status ? 'warning' :'success'"v-auth="['商品上架/下架']" plain size="mini"
                                   @click="handleChangeStatus(props.row.id)">{{ props.row.status ? '下架':'上架' }}
                        </el-button>
                        <el-button type="primary" v-auth="['编辑商品']" plain size="mini" @click="handleEdit(props.row)">编辑</el-button>
                        <el-button v-auth="['删除商品']" type="danger" plain size="mini" @click="handleDelete(props.row.id)">删除</el-button>
                    </template>

                </el-table-column>
            </el-table>
        </div>
        <!-- 分页组件 -->
        <div class="pagination">
            <el-pagination
                    v-if="refreshPagination"
                    @current-change="handleCurrentChange"
                    :background="true"
                    :page-size="pageCount"
                    :current-page="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="total_nums">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import LinSearch from '@/components/base/search/lin-search'
    import product from "@/models/product";
    export default {
        name: 'List',
        components: {
            LinSearch,
        },
        data() {
            return {
                loading: false,
                productList: [],
                refreshPagination: true, // 用于避免因为组件缓存导致分页组件不加载数据的问题
                total_nums: 0, // 商品总数
                currentPage: 1, // 默认获取第一页的数据
                pageCount: 10, // 每页10条数据
                searchKeyword: '', // 搜索框内容
            }
        },
        // 通过生命周期函数调用获取数据列表的方法
        created() {
            this.getProductList()
        },
        methods: {

            // 获取商品数据列表
            async getProductList() {
                this.loading = true
                const currentPage = this.currentPage - 1
                try {
                    const res = await product.getProductsPaginate({
                        // 传入输入的关键字
                        product_name: this.searchKeyword,
                        count: this.pageCount,
                        page: currentPage,
                    })

                    this.productList = res.collection
                    this.total_nums = res.total_nums

                    this.loading = false
                } catch (e) {
                    this.loading = false
                    this.productList = []
                    this.total_nums = 0
                }
            },

            // 搜索框内容变化时回调方法
            onQueryChange(query) {
                // 去掉输入内容的前后空格
                this.searchKeyword = query.trim()
                this.getProductList()
            },
            handleAdd() {},

            handleEdit() {},

            handleDelete() {},

            handleChangeStatus() {},
            // 切换分页
            async handleCurrentChange(val) {
                this.currentPage = val
                await this.getProductList()
            },

        },
    }
</script>

<style lang="scss" scoped>
    .table-container {
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;

        .theme-img {
            height: 120px;
            width: auto;
        }
    }

    .pagination {
        display: flex;
        justify-content: flex-end;
        margin: 20px;
    }
    .button-container {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }
</style>
