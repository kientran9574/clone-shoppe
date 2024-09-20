import { Link } from 'react-router-dom'
import { Product } from '../../../types/product.type'
import ProductRating from '../../../components/ProductRating'
import { generateNameId } from '../../../utils/utils'

const ProductItem = ({ data }: { data: Product }) => {
  return (
    <>
      <Link to={`${'/'}${generateNameId({ name: data.name, id: data._id })}`}>
        <div className='bg-white shadow rounded-sm hover:translate-y-[-0.05rem] hover:shadow-md duration-100 transition-transform overflow-hidden]'>
          <div className='w-full relative pt-[100%]'>
            <img
              src={data.image}
              alt=''
              className='pointer-events-none zom w-full h-full object-cover absolute top-0 left-0'
            />
          </div>
          <div className='p-2'>
            <div className='min-h-[2rem] line-clamp-2 text-xs'>{data.name}</div>
            <div className='flex mt-3 items-center'>
              <div className='line-through max-w-[50%] text-gray-500 truncate'>
                <span className='text-xs'>₫</span>
                <span className='text-xs'>{new Intl.NumberFormat('de-DE').format(data.price_before_discount)}đ</span>
              </div>
              <div className='text-orange truncate ml-1'>
                <span className='text-xs'>₫</span>
                <span className='text-sm'>{new Intl.NumberFormat('de-DE').format(data.price)}đ</span>
              </div>
            </div>
            <div className='mt-3 flex items-center justify-end'>
              <ProductRating rating={data.rating}></ProductRating>
              <div className='ml-2 text-sm'>
                <span>
                  {new Intl.NumberFormat('en', {
                    notation: 'compact',
                    maximumFractionDigits: 1
                  })
                    .format(data.sold)
                    .replace('.', ',')
                    .toLowerCase()}
                </span>
                <span className='ml-1'>Đã bán</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default ProductItem
