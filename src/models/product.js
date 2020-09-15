import {
    get,
} from '@/lin/plugins/axios'

class Product {
    /**
     * 获取所有商品，不分页
     * @returns {Promise<*>}
     */
    async getProducts() {
        const res = await get('v1/product')
        return res
    }
    /**
     * 获取所有商品，分页
     * @param product_key 商品名称关键字，用于搜索商品
     * @param count 查询数量
     * @param page  查询起始页数，默认成第0页开始
     * @returns {Promise<*>}
     */
    async getProductsPaginate({ product_name, count = 10, page = 0 }) {
        const url = 'v1/product/paginate'
        let res
        if (product_name) {
            res = await get(url, {
                count,
                page,
                product_name,
                handleError: this.handleError,
            })
        } else {
            res = await get(url, {
                count,
                page,
                handleError: this.handleError,
            })
        }
        return res
    }
}

export default new Product()
