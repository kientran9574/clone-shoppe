import { useContext } from 'react'
import IconGlobal from '../icons/IconGlobal'
import IconChevron from '../icons/IconChevron'
import Popover from '../Popover/Popover'
import { AppContext } from '../../context/app.context'
import { Link } from 'react-router-dom'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { logout } from '../../apis/auth.api'
import { toast } from 'react-toastify'
import { purchaseStatus } from '../../constrants/purchase'
import { getUrlAvatar } from '../../utils/utils'
const NavHeader = () => {
  const queryClient = new QueryClient()
  const { isAuthenticated, profile, setIsAuthenticated, setProfile } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      toast.success('Đăng xuất thành công')
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchase', { status: purchaseStatus.inCart }] })
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }
  console.log('123', profile?.avatar)
  return (
    <div className='flex justify-end'>
      <Popover
        className='flex items-center py-1 hover:text-gray-300 hover:cursor-pointer'
        renderPopover={
          <>
            <div className='bg-white rounded w-full px-3 py-2 flex flex-col gap-4'>
              <button className='bg-transparent '>Tiếng việt</button>
              <button className='bg-transparent '>English</button>
            </div>
          </>
        }
      >
        <IconGlobal></IconGlobal>
        <span className='mx-1'>Tiếng việt</span>
        <IconChevron></IconChevron>
      </Popover>

      {isAuthenticated && (
        <Popover
          className='flex items-center py-1 hover:text-gray-300 hover:cursor-pointer ml-6'
          renderPopover={
            <>
              <div className='bg-white w-full h-full rounded-md px-3 py-1'>
                <Link to={'/'} className='font-bold text-sm block px-1 hover:text-black  hover:text-opacity-55'>
                  Tài khoản của tôi
                </Link>
                <Link to={'/'} className='font-bold py-2 text-sm block px-1 hover:text-black  hover:text-opacity-55'>
                  Đơn mua
                </Link>
                <button
                  onClick={() => handleLogout()}
                  className='font-bold text-sm block  px-1 hover:text-black hover:text-opacity-55 '
                >
                  Đăng xuất
                </button>
              </div>
            </>
          }
        >
          <div className='size-6 flex-shrink-0'>
            <img src={getUrlAvatar(profile?.avatar)} alt='' className='w-full h-full object-cover rounded-full ' />
          </div>
          <div className='ml-1'>{profile?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center ml-4 text-white '>
          <Link to={'/register'} className='block p-1 hover:text-white/80'>
            Đăng ký
          </Link>
          <div className='mx-1 block'>|</div>
          <Link to={'/login'} className='block p-1 hover:text-white/80'>
            Đăng nhập
          </Link>
        </div>
      )}
      {/* <div className=''>
    <div className='size-6 flex-shrink-0'>
      <img
        src='https://images.unsplash.com/photo-1721332150382-d4114ee27eff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D'
        alt=''
        className='w-full h-full object-cover rounded-full '
      />
    </div>
    <div className='ml-1'>Tran van kien</div>
  </div> */}
    </div>
  )
}

export default NavHeader
