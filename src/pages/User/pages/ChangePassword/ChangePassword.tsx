import Button from '../../../../components/Button/Button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserSchema, userSchema } from '../../../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import { userApi } from '../../../../apis/user.api'
import { omit } from 'lodash'
import { toast } from 'react-toastify'

type FormData = Pick<UserSchema, 'password' | 'confirm_password' | 'new_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])
const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: '',
      new_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error)
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900 '>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-center' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow max-w-2xl'>
          <div className='flex flex-col mt-4 flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu cũ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                type='password'
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                {...register('password')}
              />
              <div className='h-[1rem] text-red-500 mt-1'>{errors.password?.message}</div>
            </div>
          </div>

          <div className='flex flex-col mt-4 flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu mới</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                type='password'
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                {...register('new_password')}
              />
              <div className='h-[1rem] text-red-500 mt-1'>{errors.new_password?.message}</div>
            </div>
          </div>

          <div className='flex flex-col mt-4 flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Nhập Lại Mật khẩu</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                type='password'
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                {...register('confirm_password')}
              />
              <div className='h-[1rem] text-red-500 mt-1'>{errors.confirm_password?.message}</div>
            </div>
          </div>

          <div className='flex flex-col mt-2 flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5 text-right'>
              <Button type='submit' className='bg-orange rounded w-12 h-10 text-white '>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword
