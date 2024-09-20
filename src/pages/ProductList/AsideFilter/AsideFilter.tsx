import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import { QueryConfig } from '../ProductList'
import ICategory from '../../../types/category.type'
import classNames from 'classnames'
import InputNumber from '../../../components/InputNumber'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from '../../../utils/rules'
import RatingStart from '../../../components/RaitingStart/RaitingStart'

interface Props {
  queryConfig: QueryConfig
  categories: ICategory[]
}
type FormData = Pick<Schema, 'price_max' | 'price_min'>
const priceSchema = schema.pick(['price_max', 'price_min'])
const AsideFilter = ({ queryConfig, categories }: Props) => {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(priceSchema)
  })
  const naviage = useNavigate()
  const onSubmit = handleSubmit((data) => {
    const priceMin = data.price_min
    if (!priceMin) return
    const priceMax = data.price_max
    if (!priceMax) return
    naviage({
      pathname: '/',
      search: createSearchParams({
        ...queryConfig,
        price_min: priceMin,
        price_max: priceMax
      }).toString()
    })
  })
  return (
    <>
      <div className='py-4'>
        <Link to={'/'} className='flex items-center font-bold'>
          <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
            <g fillRule='evenodd' stroke='none' strokeWidth={1}>
              <g transform='translate(-373 -208)'>
                <g transform='translate(155 191)'>
                  <g transform='translate(218 17)'>
                    <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          Tất cả danh mục
        </Link>
        <div className='bg-gray-300 h-[1px] my-4'></div>
        <ul>
          {categories.map((item) => {
            const isActive = queryConfig.category === item._id
            return (
              <li className='py-2 pl-3' key={item._id}>
                <Link
                  to={{
                    pathname: '/',
                    search: createSearchParams({
                      ...queryConfig,
                      category: item._id
                    }).toString()
                  }}
                  className={classNames('relative px-2', {
                    'text-orange': isActive,
                    'text-black': !isActive
                  })}
                >
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
        <Link to={'/'} className='flex items-center font-bold mt-4 uppercase'>
          <svg
            enableBackground='new 0 0 15 15'
            viewBox='0 0 15 15'
            x={0}
            y={0}
            className='w-3 h-4 fill-current stroke-current mr-3'
          >
            <g>
              <polyline
                fill='none'
                points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </g>
          </svg>
          Bộ lọc tìm kiếm
        </Link>
        <div className='bg-gray-300 h-[1px] my-4'></div>
        <div className='mt-2'>
          <div>Khoảng giá:</div>
          <form className='my-2' onSubmit={onSubmit}>
            <div className='flex items-start'>
              <div className='grow'>
                <Controller
                  control={control}
                  name='price_min'
                  render={({ field }) => {
                    return (
                      <InputNumber
                        type='text'
                        placeholder='đ TỪ'
                        {...field}
                        onChange={(event) => {
                          field.onChange(event)
                          trigger('price_max')
                        }}
                      />
                    )
                  }}
                />
              </div>
              <div className='mx-2 mt-1 shrink-0'>-</div>
              <div className='grow'>
                <Controller
                  control={control}
                  name='price_max'
                  render={({ field }) => {
                    return (
                      <InputNumber
                        type='text'
                        placeholder='đ ĐẾN'
                        {...field}
                        onChange={(event) => {
                          field.onChange(event)
                          trigger('price_min')
                        }}
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
            <Button className='w-full p-2  uppercase bg-orange text-white text-sm hover:bg-orange/80 justify-center items-center mt-4'>
              Áp dụng
            </Button>
          </form>
          <div className=' text-xl font-bold mt-7'>Đánh giá:</div>
          <RatingStart queryConfig={queryConfig}></RatingStart>
        </div>
      </div>
    </>
  )
}

export default AsideFilter
