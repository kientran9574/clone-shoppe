import React, { useContext, useEffect, useMemo } from 'react'
import purchaseApi from '../../apis/purchase.api'
import { purchaseStatus } from '../../constrants/purchase'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import { generateNameId } from '../../utils/utils'
import QuantityController from '../../components/QuantityController'
import Button from '../../components/Button/Button'
import { Purchase } from '../../types/purchase.type'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/app.context'
// kiểu mở rộng của purchase
export interface ExtendedPurchase extends Purchase {
  // thêm thuộc tính cho cái purchase này
  disabled: boolean
  checked: boolean
}

const Cart = () => {
  const { extendedPurchase, setExtendedPurchase } = useContext(AppContext)
  const { data: purchaseInCartData, refetch } = useQuery({
    queryKey: ['purchase', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchaseList({ status: purchaseStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const location = useLocation()
  const choosePurchaseIdFromLocation = (location.state as { purchaseId: string | null })?.purchaseId
  const purchaseIncart = purchaseInCartData?.data.data
  // những cái ông đã được checked
  const checkedPurchases = useMemo(() => extendedPurchase.filter((purchase) => purchase.checked), [extendedPurchase])
  // Bao nhiêu ông đã được checked
  const checkedPurchasesCount = checkedPurchases.length
  // Tổng thanh toán
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )
  // Tính Tiết kiệm
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  useEffect(() => {
    setExtendedPurchase((prev) => {
      // tìm ra thằng nào đang được checked và giữ nguyên giá trị đó không bị thay đổi khi refetch
      const extendedPurchasesObject = keyBy(prev, '_id')
      console.log(extendedPurchasesObject)
      return (
        purchaseIncart?.map((purchase) => {
          const isChoosePurchaseFromLocation = choosePurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosePurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
    return () => {
      history.replaceState(null, '')
    }
  }, [purchaseIncart, choosePurchaseIdFromLocation, setExtendedPurchase])
  const isAllPurchase = useMemo(() => extendedPurchase.every((purchase) => purchase.checked), [extendedPurchase])
  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }
  const handleCheckAll = () => {
    setExtendedPurchase((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllPurchase
      }))
    )
  }
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchase[purchaseIndex]
      setExtendedPurchase(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  // value này là được xuất ra từ  onType && onType(_value)
  const handleType = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const handleDelete = (purchaseIndex: number) => {
    const purchaseId = extendedPurchase[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }
  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchaseIds)
  }
  const handleBuyPurchase = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }
  if (!purchaseIncart) return
  return (
    <div className='py-16 bg-neutral-100'>
      <div className='px-4 mx-auto max-w-7xl'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            {/* head */}
            <div className='grid grid-cols-12 py-5 text-sm text-gray-500 capitalize bg-white rounded-sm shadow px-9'>
              <div className='col-span-6 bg-white'>
                <div className='flex items-center'>
                  <div className='flex items-center justify-center flex-shrink-0 pr-3'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 accent-orange'
                      checked={isAllPurchase}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            {/* Center */}
            <div className='p-5 my-3 rounded-sm shadow bg-white'>
              {extendedPurchase.map((purchase, index) => {
                return (
                  <div
                    className='grid grid-cols-12 px-4 py-5 mt-5 text-sm text-center text-gray-500 capitalize bg-white border border-gray-200 rounded-sm shadow first:mt-0'
                    key={purchase._id}
                  >
                    <div className='col-span-6'>
                      <div className='flex'>
                        <div className='flex items-center justify-center flex-shrink-0 pr-3'>
                          <input
                            type='checkbox'
                            className='w-5 h-5 accent-orange'
                            checked={purchase.checked}
                            onChange={handleCheck(index)}
                          />
                        </div>
                        <div className='flex-grow'>
                          <div className='flex'>
                            <Link
                              className='flex-shrink-0 w-20 h-20'
                              to={`${'/'}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                            >
                              <img src={purchase.product.image} alt={purchase.product.name} />
                            </Link>
                            <div className='flex-grow px-2 pt-1 pb-2'>
                              <Link
                                className='line-clamp-2'
                                to={`${'/'}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                              >
                                {purchase.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Đơn giá,... */}
                    <div className='col-span-6'>
                      <div className='grid items-center grid-cols-5'>
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center'>
                            <span className='text-gray-300 line-through'>
                              {new Intl.NumberFormat('de-DE').format(purchase.product.price_before_discount)}đ
                            </span>
                            <span className='ml-3 text-gray-800'>
                              {new Intl.NumberFormat('de-DE').format(purchase.product.price)}đ
                            </span>
                          </div>
                        </div>
                        <div className='col-span-1 -ml-10'>
                          <QuantityController
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                            onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                            onType={handleType(index)}
                            onFocusOut={(value) =>
                              handleQuantity(
                                index,
                                value,
                                value >= 1 &&
                                  value <= purchase.product.quantity &&
                                  value !== (purchaseIncart as Purchase[])[index].buy_count
                              )
                            }
                            disabled={purchase.disabled}
                          ></QuantityController>
                        </div>
                        <div className='col-span-1'>
                          <div className='text-orange'>
                            {new Intl.NumberFormat('de-DE').format(purchase.product.price * purchase.buy_count)}đ
                          </div>
                        </div>
                        <div className='col-span-1'>
                          <button
                            className='text-black transition-colors bg-none hover:text-orange'
                            onClick={() => handleDelete(index)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* Sticky Bottom */}
        <div className='sticky bottom-0 z-10 flex items-center p-5 bg-white rounded-sm sm:flex-row sm:items-center'>
          <div className='flex items-center justify-center flex-shrink-0 pr-3'>
            <input
              type='checkbox'
              className='w-5 h-5 accent-orange'
              checked={isAllPurchase}
              onChange={handleCheckAll}
            />
          </div>
          <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>
            Chọn tất cả ({extendedPurchase.length})
          </button>
          <button className='mx-3 border-none bg-none ' onClick={handleDeleteManyPurchases}>
            Xóa
          </button>

          <div className='mt-5 flex flex-col ml-2 sm:ml-auto'>
            <div className=''>
              <div className='flex items-center sm:justify-end'>
                <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                <div className='ml-2 text-2xl text-orange'>
                  {new Intl.NumberFormat('de-DE').format(totalCheckedPurchasePrice)}đ
                </div>
              </div>
              <div className='flex items-center text-sm sm:justify-end'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>
                  {' '}
                  {new Intl.NumberFormat('de-DE').format(totalCheckedPurchaseSavingPrice)}đ
                </div>
              </div>
            </div>
            <Button
              className='!mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-auto sm:mt-0'
              onClick={handleBuyPurchase}
              disabled={buyProductsMutation.isPending}
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
