/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product, ProductConfig, ProductList } from '../types/product.type'
import { SuccessResponseApi } from '../types/utils.type'
import http from '../utils/http'

const URL = 'products'
export const getProductsList = async (params: ProductConfig) => {
  return http.get<SuccessResponseApi<ProductList>>(URL, { params })
}
export const getProductDetails = async (id: string) => {
  return http.get<SuccessResponseApi<Product>>(`${URL}/${id}`)
}
