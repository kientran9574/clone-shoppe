/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductDetails, getProductsList } from '../../../apis/product.api'
import ProductRating from '../../../components/ProductRating'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getIdFromNameId } from '../../../utils/utils'
import { ProductConfig } from '../../../types/product.type'
import ProductItem from '../ProductItem'
import QuantityController from '../../../components/QuantityController'
import purchaseApi from '../../../apis/purchase.api'
import { queryClient } from '../../../main'
import { purchaseStatus } from '../../../constrants/purchase'

const ProductDetails = () => {
  const navigate = useNavigate()
  const imgRef = useRef<HTMLImageElement>(null)
  const { nameId } = useParams()
  const [buyCount, setBuyCount] = useState(1)
  const id = getIdFromNameId(nameId as string)
  const { data } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetails(id as string)
  })
  const [currentIndexImg, setCurrentIndexImg] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const product = data?.data.data

  const currentImg = useMemo(() => product?.images.slice(...currentIndexImg), [currentIndexImg, product])
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product?.images[0])
    }
  }, [product])
  const queryConfig: ProductConfig = { limit: '20', page: '1', category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => getProductsList(queryConfig),
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product)
  })
  const addToCartMutation = useMutation({
    mutationFn: purchaseApi.addToCart
  })
  const addToCart = () => {
    addToCartMutation.mutate(
      { product_id: product?._id as string, buy_count: buyCount },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['purchase', { status: purchaseStatus.inCart }] })
        }
      }
    )
  }
  if (!product) return null
  const next = () => {
    console.log(currentIndexImg[1])
    if (currentIndexImg[1] < product.images.length) {
      setCurrentIndexImg((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prev = () => {
    console.log(currentIndexImg[1])
    if (currentIndexImg[0] > 0) {
      setCurrentIndexImg((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const hoverImg = (img: string) => {
    setActiveImage(img)
  }
  const handleZoomImg = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imgRef.current as HTMLImageElement
    const { offsetX, offsetY } = event.nativeEvent
    const { naturalWidth, naturalHeight } = image

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)

    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }
  const handleZoomReset = () => {
    imgRef.current?.removeAttribute('style')
  }
  const handleByCount = (value: number) => {
    setBuyCount(value)
  }
  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate('/cart', {
      state: {
        purchaseId: purchase._id
      }
    })
  }
  return (
    <div className='bg-gray-200 py-6'>
      <div className='bg-white p-4 shadow'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
                onMouseMove={handleZoomImg}
                onMouseLeave={handleZoomReset}
              >
                <img
                  ref={imgRef}
                  src={activeImage}
                  alt={product.name}
                  className='absolute top-0 left-0 w-full h-full object-cover !pointer-events-none '
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-8  w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImg &&
                  currentImg.map((img) => {
                    const isActive = img === activeImage
                    return (
                      <div
                        className='relative w-full pt-[100%] cursor-pointer'
                        key={img}
                        onMouseEnter={() => hoverImg(img)}
                      >
                        <img
                          src={img}
                          alt='img'
                          className='w-full h-full object-cover absolute top-0 left-0 cursor-pointer'
                        />
                        {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                      </div>
                    )
                  })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-8  w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='flex items-center mt-8'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange text-orange h-4 w-4'
                    nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                  <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                  <div>
                    <span>
                      {' '}
                      {new Intl.NumberFormat('en', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                      })
                        .format(product.sold)
                        .replace('.', ',')
                        .toLowerCase()}
                    </span>
                    <span className='ml-1 text-gray-500'>Đã bán</span>
                  </div>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>
                  ₫{new Intl.NumberFormat('de-DE').format(product.price)}
                </div>
                <div className='ml-3 text-3xl font-medium text-orange'>
                  ₫{new Intl.NumberFormat('de-DE').format(product.price)}
                </div>
              </div>
              <div className='flex items-center mt-5'>
                <div className='capitalize text-gray-500'>Số lượng:</div>
                <QuantityController
                  max={product.quantity}
                  onDecrease={handleByCount}
                  onIncrease={handleByCount}
                  onType={handleByCount}
                  value={buyCount}
                ></QuantityController>
              </div>

              <div className='mt-8 flex items-center'>
                <button
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                  onClick={addToCart}
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                  onClick={buyNow}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
          {productsData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <ProductItem data={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
