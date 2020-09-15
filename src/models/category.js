// src/models/catrogry.js

import { get,post,put,_delete } from '@/lin/plugins/axios'

class Category {

    handleError = true

    async getCategory() {
        const res = await get('v1/category')
        return res
    }

    async createCategory(name, description, topicImgId){
        const res = await post('v1/category',
            { name, description,topic_img_id:topicImgId },
            { handleError: this.handleError })
        return res;
    }
    async editCategory(id, name, description, topicImgId) {
        const res = await put(`v1/category/${id}`, {
            name,
            description,
            topic_img_id: topicImgId,
        }, { handleError: this.handleError })
        return res
    }
    async delCategory(ids) {
        const res = await _delete('v1/category', { ids })
        return res
    }
}

export default new Category()
