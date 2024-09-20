/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import { useContext, lazy, Suspense } from 'react'
import { AppContext } from './context/app.context'
// import ProductDetails from './pages/ProductList/ProductDetail'
// import Cart from './pages/Cart'
import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
// import ChangePassword from './pages/User/pages/ChangePassword'
// import Profile from './pages/User/pages/Profile'
// import History from './pages/User/pages/History'

// const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const ProductDetails = lazy(() => import('./pages/ProductList/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const History = lazy(() => import('./pages/User/pages/History'))
// const NotFound = lazy(() => import('./pages/NotFound'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet></Outlet> : <Navigate to={'/login'}></Navigate>
}
// Khi đã đăng nhập rồi
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet></Outlet> : <Navigate to={'/'}></Navigate>
}

const useRouterElement = () => {
  const routerElement = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList></ProductList>
        </MainLayout>
      )
    },
    {
      path: ':nameId',
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetails></ProductDetails>
          </Suspense>
        </MainLayout>
      )
    },
    // nested route
    {
      path: '',
      element: <ProtectedRoute></ProtectedRoute>,
      children: [
        {
          path: '/user',
          element: (
            <MainLayout>
              <UserLayout></UserLayout>
            </MainLayout>
          ),
          children: [
            {
              path: '/user/profile',
              element: (
                <Suspense>
                  <Profile></Profile>
                </Suspense>
              )
            },
            {
              path: '/user/change-password',
              element: (
                <Suspense>
                  <ChangePassword></ChangePassword>
                </Suspense>
              )
            },
            {
              path: '/user/history',
              element: (
                <Suspense>
                  <History></History>
                </Suspense>
              )
            }
          ]
        },
        {
          path: '/cart',
          element: (
            <CartLayout>
              <Suspense>
                <Cart></Cart>
              </Suspense>
            </CartLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute></RejectedRoute>,
      children: [
        {
          path: 'login',
          element: (
            <RegisterLayout>
              <Login></Login>
            </RegisterLayout>
          )
        },
        {
          path: 'register',
          element: (
            <RegisterLayout>
              <Register></Register>
            </RegisterLayout>
          )
        }
      ]
    }
  ])
  return routerElement
}

export default useRouterElement
