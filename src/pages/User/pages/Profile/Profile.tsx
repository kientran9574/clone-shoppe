/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Button from '../../../../components/Button/Button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { userApi } from '../../../../apis/user.api'
import { Controller, useForm } from 'react-hook-form'
import { UserSchema, userSchema } from '../../../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import InputNumber from '../../../../components/InputNumber'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from '../../../../context/app.context'
import { setProfileToLS } from '../../../../utils/auth'
import { getUrlAvatar } from '../../../../utils/utils'
import config from '../../../../constrants/config'
type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])
const Profile = () => {
  const { profile } = useContext(AppContext)
  const inputUploadRef = useRef<HTMLInputElement>(null)
  // Tạo state để lưu file để mình upload ảnh
  const [file, setFile] = useState<File>()
  // show ảnh mà mình upload
  const previewUpload = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const { setProfile } = useContext(AppContext)
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    control
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadFile
  })
  const profileUser = profileData?.data.data
  useEffect(() => {
    if (profileUser) {
      setValue('name', profileUser.name)
      setValue('phone', profileUser.phone)
      setValue('address', profileUser.address)
      setValue('avatar', profileUser.avatar)
      setValue('date_of_birth', profileUser.date_of_birth ? new Date(profileUser.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profileUser, setValue])
  const avatar = watch('avatar')
  const onSubmit = handleSubmit(async (data) => {
    // call 2 api data và hình ảnh
    try {
      // Sử dụng biến let để cho avatarName này nó được thoát khỏi scope chứ sử dụng const thì nó chỉ thực hiện ở trong này thôi
      let avatarName = avatar
      // nếu như người dùng có thay đổi (chọn) tấm ảnh thì chúng ta thực hiện upload
      if (file) {
        // Nhớ là thực hiện upfile thì sử dụng formdata
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        // set vào trong cái Form cho nó đồng bộ
        setValue('avatar', avatarName)
        // Sử dụng biến let để cho avatarName này nó được thoát khỏi scope chứ sử dụng const thì nó chỉ thực hiện ở trong này thôi
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      toast.success(res.data.message)
      refetch()
    } catch (error) {
      console.log(error)
    }
  })
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lấy file
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error(
        `Dụng lượng file tối đa 1 MB
      Định dạng:.JPEG, .PNG`,
        {
          position: 'top-center'
        }
      )
    } else {
      setFile(fileFromLocal)
    }
  }
  const handleUpload = () => {
    inputUploadRef.current?.click()
  }
  return (
    <div className='rounded-sm bg-white px-2 pb-10  shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900 '>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-center' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              {/* <div className='pt-3 text-gray-700'>{profileUser?.email}</div> */}
            </div>
          </div>
          <div className='flex flex-col mt-6 flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                {...register('name')}
              />
              <div className='h-[1rem] text-red-500 mt-1'>{errors.name?.message}</div>
            </div>
          </div>
          <div className='flex flex-col mt-4 flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => {
                  return (
                    <>
                      <InputNumber
                        // className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                        {...field}
                        onChange={field.onChange}
                      />
                      <div className='h-[1rem] text-red-500 mt-1'>{errors.phone?.message}</div>
                    </>
                  )
                }}
              ></Controller>
            </div>
          </div>
          <div className='flex flex-col mt-4 flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ </div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                {...register('address')}
              />
              <div className='h-[1rem] text-red-500 mt-1'>{errors.address?.message}</div>
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => {
              return (
                <DateSelect
                  value={field.value}
                  onChange={field.onChange}
                  errorsMessage={errors.date_of_birth?.message}
                ></DateSelect>
              )
            }}
          ></Controller>

          <div className='flex flex-col mt-2 flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5 text-right'>
              <Button type='submit' className='bg-orange rounded w-12 h-10 text-white '>
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src={previewUpload || getUrlAvatar(profile?.avatar)}
                alt=''
                className='w-full h-full rounded-full object-cover'
              />
            </div>
            <input
              className='hidden'
              type='file'
              accept='.jpg,.jpeg,.png'
              ref={inputUploadRef}
              onChange={onFileChange}
              onClick={(event) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(event.target as any).value = null
              }}
            />
            <button
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
              type='button'
              onClick={handleUpload}
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Profile
