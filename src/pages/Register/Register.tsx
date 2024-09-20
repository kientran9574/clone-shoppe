/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Schema, registerSchema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { registerAccount } from '../../apis/auth.api'
import {  pick } from 'lodash'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ErrorResponseApi } from '../../types/utils.type'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import Button from '../../components/Button/Button'
type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const Register = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigation = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })
  const onSubmit = handleSubmit((data) => {
    const body = pick(data, 'email', 'password')
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success('Đăng ký thành công')
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigation('/')
        reset()
        console.log(data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
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
              <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit}>
                <div className='text-2xl'>Đăng ký</div>
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
                  <input
                    type='password'
                    autoComplete='on'
                    className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='Confirm Password'
                    // {...register('confirm_password', {
                    //   ...(rules?.confirm_password as RegisterOptions<FormErrorProps, 'confirm_password'>),
                    //   validate: (value) => value === getValues('password') || 'Nhập lại password không khớp'
                    // })}
                    {...register('confirm_password')}
                  />
                  <div className='text-sm text-red-600 min-h-[1rem] mt-1'>{errors.confirm_password?.message}</div>
                </div>
                <div className='mt-6'>
                  <Button
                    type='submit'
                    isLoading={registerAccountMutation.isPending}
                    disabled={registerAccountMutation.isPending}
                    className='py-4 px-2 w-full bg-red-600 text-white hover:shadow-lg flex items-center justify-center uppercase'
                  >
                    Đăng ký
                  </Button>
                </div>
                <div className='mt-8 flex items-center justify-center'>
                  <span className='text-slate-400'>Bạn đã có tài khoản?</span>
                  <Link to={'/login'} className='text-orange ml-1'>
                    Đăng nhập
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

export default Register
