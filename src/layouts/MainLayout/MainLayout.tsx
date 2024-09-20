import { ReactNode } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
