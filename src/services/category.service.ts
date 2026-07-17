import axiosInstance from '@lib/axios'
import { Category } from '@app-types/category.type'

class CategoryService {
    async getCategories(): Promise<Category[]> {
        const { data } = await axiosInstance.get<Category[]>('/categories')
        return data
    }
}

export const categoryService = new CategoryService()