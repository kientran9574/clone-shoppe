import { Link, createSearchParams } from 'react-router-dom'
import { purchaseStatus } from '../../../../constrants/purchase'
import useQueryParams from '../../../../hook/useQueryParams'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import purchaseApi from '../../../../apis/purchase.api'
import { PurchaseListStatus } from '../../../../types/purchase.type'
import { generateNameId } from '../../../../utils/utils'
const purchaseTab = [
  { status: purchaseStatus.all, name: 'Tất cả' },
  { status: purchaseStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchaseStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchaseStatus.inProgress, name: 'Đang giao' },
  { status: purchaseStatus.delivered, name: 'Đã giao' },
  { status: purchaseStatus.cancelled, name: 'Đã hủy' }
]
const History = () => {
  // Lấy query params trên thanh url
  const queryParams: { status?: string } = useQueryParams()
  const status = Number(queryParams.status) || purchaseStatus.all
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', status],
    queryFn: () => purchaseApi.getPurchaseList({ status: status as PurchaseListStatus })
  })
  const purchasesInCart = purchasesInCartData?.data.data
  const purchaseTabsLink = purchaseTab.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: '/user/history',
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))
  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky text-xs top-0 flex rounded-t-sm shadow-sm '>{purchaseTabsLink}</div>
          <div className=''>
            {purchasesInCart?.map((purchase) => (
              <div
                className='mt-4 rounded-sm  border border-black/10 bg-white p-6 text-gray-800 shadow-sm'
                key={purchase._id}
              >
                <Link
                  to={`${'/'}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                  className='flex'
                >
                  <div className='flex-shrink-0'>
                    <img src={purchase.product.image} alt='' className='h-20 w-20 object-cover' />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-3 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      {new Intl.NumberFormat('de-DE').format(purchase.price_before_discount)}đ
                    </span>
                    <span className='ml-2 truncate text-orange'>
                      {' '}
                      {new Intl.NumberFormat('de-DE').format(purchase.price)}đ
                    </span>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>Tổng giá tiền</span>
                    <span className='ml-4 text-xl text-orange'>
                      {new Intl.NumberFormat('de-DE').format(purchase.price * purchase.buy_count)}đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default History
