import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { loginFormData, loginSchema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { toast } from 'react-toastify'
import { login } from '../../apis/auth.api'
import { ErrorResponseApi } from '../../types/utils.type'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import Button from '../../components/Button/Button'
const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigation = useNavigate()
  type FormData = loginFormData
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  const loginMutation = useMutation({
    mutationFn: (body: FormData) => login(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success('Đăng nhập thành công')
        setProfile(data.data.data.user)
        setIsAuthenticated(true)
        navigation('/')
        reset()
        console.log(data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        } else {
          toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.')
        }
      }
    })
  })
  return (
    <>
      <div className='bg-orange'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-12'>
            <div className='lg:col-span-2 lg:col-start-4'>
              <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
                <div className='text-2xl'>Đăng nhập</div>
                <div className='mt-8'>
                  <input
                    type='text'
                    className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='Email'
                    // {...register('email', rules?.email as RegisterOptions<FormErrorProps, 'email'>)}
                    {...register('email')}
                  />
                  <div className='text-sm text-red-600 min-h-[1rem] mt-1'>{errors.email?.message}</div>
                </div>
                <div className='mt-6'>
                  <input
                    type='password'
                    autoComplete='on'
                    className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='Password'
                    // {...register('password', rules?.password as RegisterOptions<FormErrorProps, 'password'>)}
                    {...register('password')}
                  />
                  <div className='text-sm text-red-600 min-h-[1rem] mt-1'>{errors.password?.message}</div>
                </div>
                <div className='mt-6'>
                  <Button
                    isLoading={loginMutation.isPending}
                    disabled={loginMutation.isPending}
                    className='py-4 px-2 w-full bg-red-600 text-white hover:shadow-lg flex items-center justify-center uppercase '
                  >
                    Đăng nhập
                  </Button>
                </div>
                <div className='mt-8 flex items-center justify-center'>
                  <span className='text-slate-400'>Bạn chưa có có tài khoản?</span>
                  <Link to={'/register'} className='text-orange ml-1'>
                    Đăng ký
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
