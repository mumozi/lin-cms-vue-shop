// src/models/theme.js

import {
    get,
    post,
    patch,
    _delete,
} from '@/lin/plugins/axios'

class Theme {

    handleError = true

    async getThemes() {
        const res = await get('v1/theme', { handleError: this.handleError })
        return res
    }

    async createTheme(name, description, topic_img_id, head_img_id) {
        const res = await post('v1/theme', {
            name,
            description,
            topic_img_id,
            head_img_id,
        }, { handleError: this.handleError })
        return res
    }
    // 新增主题关联商品
    async addThemeProduct(id,productIds) {
        const res = await post(`v1/theme/product/${id}`, {
            products: productIds,
        }, { handleError: this.handleError })
        return res
    }
    // 移除主题关联商品
    async delThemeProduct(id,productIds) {
        const res = await _delete(`v1/theme/product/${id}`, {
            products: productIds,
        }, { handleError: this.handleError })
        return res
    }
    // 获取指定精选主题详情
    async getThemeById(id) {
        const res = await get(`v1/theme/${id}`)
        return res
    }
    // 更新精选主题基础信息
    async updateThemeInfo(id, params) {
        const res = await patch(`v1/theme/${id}`, { ...params }, { handleError: this.handleError })
        return res
    }
    // 删除精选主题
    async delTheme(ids) {
        const res = await _delete('v1/theme', { ids })
        return res
    }
}

export default new Theme()
