import { ReactNode } from 'react'
import Footer from '../../components/Footer'
import CartHeader from '../../components/CartHeader'

const CartLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <CartHeader></CartHeader>
      {children}
      <Footer></Footer>
    </div>
  )
}

export default CartLayout
