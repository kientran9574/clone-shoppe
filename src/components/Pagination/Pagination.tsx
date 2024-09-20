import { Link, createSearchParams } from 'react-router-dom'
import { QueryConfig } from '../../pages/ProductList/ProductList'
import classNames from 'classnames'
interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
const RAMGE = 2
const Pagination = ({ queryConfig, pageSize }: Props) => {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let doBefore = false
    const renderDotBefore = (index: number) => {
      if (!doBefore) {
        doBefore = true
        return (
          <span key={index} className='bg-white rounded-sm px-3 py-2 shadow-sm mx-2'>
            ...
          </span>
        )
      }
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='bg-white rounded-sm px-3 py-2 shadow-sm mx-2'>
            ...
          </span>
        )
      }
    }
    return (
      <>
        {Array(pageSize)
          .fill(0)
          .map((_, index) => {
            const pageNumber = index + 1
            // trường hợp đầu tiên hiển thị dấu ...
            if (page <= RAMGE * 2 + 1 && pageNumber > page + RAMGE && pageNumber < pageSize - RAMGE + 1) {
              return renderDotAfter(index)
            } else if (page > RAMGE * 2 + 1 && page < pageSize - RAMGE * 2) {
              if (pageNumber < page - RAMGE && pageNumber > RAMGE) {
                return renderDotBefore(index)
              } else if (pageNumber > page + RAMGE && pageNumber < pageSize - RAMGE + 1) {
                return renderDotAfter(index)
              }
            } else if (page >= pageSize - RAMGE * 2 && pageNumber > RAMGE && pageNumber < page - RAMGE) {
              return renderDotBefore(index)
            }
            return (
              <Link
                to={{
                  pathname: '/',
                  search: createSearchParams({
                    ...queryConfig,
                    page: pageNumber.toString()
                  }).toString()
                }}
                className={classNames('bg-white rounded-sm px-3 py-2 shadow-sm mx-2 cursor-pointer border', {
                  'border-cyan-500': pageNumber === page,
                  'border-transparent': pageNumber !== page
                })}
                key={index}
              >
                {pageNumber}
              </Link>
            )
          })}
      </>
    )
  }
  return (
    <div className='flex flex-wrap mt-6 justify-center '>
      {page === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: '/',
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
        >
          Prev
        </Link>
      )}
      {/* cái này chứa rất nhiều login cho nên là tạo 1 node ở bên ngoài  */}
      {renderPagination()}
      {page === pageSize ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>Next</span>
      ) : (
        <Link
          to={{
            pathname: '/',
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
        >
          Next
        </Link>
      )}
    </div>
  )
}
export default Pagination
