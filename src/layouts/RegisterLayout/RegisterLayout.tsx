import { ReactNode } from 'react'
import RegisterHeader from '../../components/RegisterHeader'
import Footer from '../../components/Footer'

const RegisterLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <RegisterHeader></RegisterHeader>
      {children}
      <Footer></Footer>
    </div>
  )
}

export default RegisterLayout
