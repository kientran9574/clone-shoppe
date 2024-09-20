import UserSideNav from '../../components/UserSideNav'
import { Outlet } from 'react-router-dom'
// nested route
const UserLayout = () => {
  return (
    <div className='bg-neutral-100 py-16 text-sm text-gray-600'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='md:col-span-3 lg:col-span-2'>
            <UserSideNav></UserSideNav>
          </div>
          <div className='md:col-span-9 lg:col-span-10'>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLayout
