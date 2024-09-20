import NavHeader from '../NavHeader'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import IconShoppe from '../icons/IconShoppe'
import useQueryConfig from '../../hook/useQueryConfig'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from '../../utils/rules'
type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])
const CartHeader = () => {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: '/',
      search: createSearchParams(config).toString()
    })
  })
  return (
    <div className='border-b border-b-black/10'>
      <div className='bg-orange text-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <NavHeader></NavHeader>
        </div>
      </div>
      <div className='bg-white py-6'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='md:flex md:items-center md:justify-between'>
            <Link to={'/'} className='inline-block'>
              <nav className='flex items-end'>
                <IconShoppe></IconShoppe>
                <div className='h-8 mx-4 bg-orange w-[1px]'></div>
                <div className='lg:text-xl'>Giỏ Hàng</div>
              </nav>
            </Link>
            <form className='mt-4 md:mt-0 md:w-[50%]' onSubmit={onSubmitSearch}>
              <div className='flex rounded-sm border-2 border-orange'>
                <input
                  type='text'
                  className='w-full flex-grow border-none bg-transparent px-3 py-1 text-black outline-none'
                  placeholder='Free Ship Đơn Từ 0Đ'
                  {...register('name')}
                />
                <button className='flex-shrink-0 rounded-sm bg-orange py-2 px-8 hover:opacity-90'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5 stroke-white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartHeader
