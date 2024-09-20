import ICategory from '../types/category.type'
import { SuccessResponseApi } from '../types/utils.type'
import http from '../utils/http'
const URL = '/categories'
export const getCategories = () => {
  return http.get<SuccessResponseApi<ICategory[]>>(URL)
}
