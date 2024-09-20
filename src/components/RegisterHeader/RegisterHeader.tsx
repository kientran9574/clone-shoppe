import { Link } from 'react-router-dom'
import IconShoppe from '../icons/IconShoppe'

const RegisterHeader = () => {
  return (
    <header className='py-5'>
      <div className='max-w-7xl mx-auto px-4'>
        <nav className='flex items-end'>
          <Link to={'/'} className='inline-block'>
            <IconShoppe></IconShoppe>
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>Đăng ký</div>
        </nav>
      </div>
    </header>
  )
}

export default RegisterHeader
