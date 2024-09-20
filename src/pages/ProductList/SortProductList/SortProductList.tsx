import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { sortBy, order as orderConstants } from '../../../constrants'
import { QueryConfig } from '../ProductList'
import { ProductConfig } from '../../../types/product.type'
import { omit } from 'lodash'
import classNames from 'classnames'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
const SortProductList = ({ queryConfig, pageSize }: Props) => {
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.view, order } = queryConfig
  const navigate = useNavigate()
  const handleSort = (sortValue: Exclude<ProductConfig['sort_by'], undefined>) => {
    navigate({
      pathname: '/',
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const handleIsActive = (sortByValue: Exclude<ProductConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const handlePriceOrder = (orderValue: Exclude<ProductConfig['order'], undefined>) => {
    navigate({
      pathname: '/',
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='font-bold'>Sắp xếp theo:</div>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-orange text-white hover:bg-orange/80': handleIsActive(sortBy.view),
              'bg-white text-black hover:bg-slate/100': !handleIsActive(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-orange text-white hover:bg-orange/80': handleIsActive(sortBy.createdAt),
              'bg-white text-black hover:bg-slate/100': !handleIsActive(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center', {
              'bg-orange text-white hover:bg-orange/80': handleIsActive(sortBy.sold),
              'bg-white text-black hover:bg-slate/100': !handleIsActive(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <select
            className='h-8 px-4 capitalize bg-white text-black text-sm hover:bg-slate-100 text-left outline-none'
            value={order || ''}
            onChange={(e) => handlePriceOrder(e.target.value as Exclude<ProductConfig['order'], undefined>)}
          >
            <option value='' disabled>
              Giá
            </option>
            <option value={orderConstants.asc} className='block mb-10'>
              Giá: thấp đến cao
            </option>
            <option value={orderConstants.desc}>Giá: Cao đến thấp</option>
          </select>
        </div>

        <div className='flex items-center'>
          <div className=''>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='flex items-center'>
            {page === 1 ? (
              <span className='cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: '/',
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: '/',
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className=' cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SortProductList
