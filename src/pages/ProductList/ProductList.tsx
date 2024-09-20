import AsideFilter from './AsideFilter'
import ProductItem from './ProductItem'
import SortProductList from './SortProductList/SortProductList'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getProductsList } from '../../apis/product.api'
import { ProductConfig } from '../../types/product.type'
import Pagination from '../../components/Pagination'
import { getCategories } from '../../apis/category.api'
import useQueryConfig from '../../hook/useQueryConfig'
export type QueryConfig = {
  [key in keyof ProductConfig]: string
}
const ProductList = () => {
  const queryConfig = useQueryConfig()
  const { data } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => getProductsList(queryConfig as ProductConfig),
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })
  const { data: dataCategory } = useQuery({
    queryKey: ['category'],
    queryFn: () => getCategories()
  })
  return (
    <>
      <div className='bg-gray-200 py-6'>
        <div className='max-w-7xl mx-auto px-4'>
          {data && (
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-3'>
                <AsideFilter
                  categories={dataCategory ? dataCategory.data.data : []}
                  queryConfig={queryConfig}
                ></AsideFilter>
              </div>
              <div className='col-span-9'>
                <SortProductList
                  queryConfig={queryConfig}
                  pageSize={data.data.data.pagination.page_size}
                ></SortProductList>
                <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 shrink-0'>
                  {data &&
                    data.data.data.products.map((item, index) => (
                      <div key={index}>
                        <ProductItem data={item}></ProductItem>
                      </div>
                    ))}
                </div>
                <Pagination queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size}></Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductList
