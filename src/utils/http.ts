/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosInstance } from 'axios'
import HttpStatusCode from '../types/httpStatus.enum'
import { toast } from 'react-toastify'
import {
  clearToLS,
  getAccessTokenToLS,
  getRefreshTokenToLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth'
import { AuthResponse, RefreshTokenResponse } from '../types/auth.type'
import { URL_REFRESH_TOKEN } from '../apis/auth.api'
import { isAxiosExpiredEntityError, isAxiosUnauthorizedEntityError } from './utils'
import { ErrorResponseApi } from '../types/utils.type'
class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  // handle việc refreshToken nó bị gọi liên tục
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenToLS()
    this.refreshToken = getRefreshTokenToLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: `https://api-ecom.duthanhduoc.com`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 5, // 10 giây
        'expire-refresh-token': 60 * 60 // 1 giờ
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        console.log(url)
        if (url === '/login' || url === '/register') {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS(data.data.user)
        } else if (url === '/logout') {
          this.accessToken = ''
          this.refreshToken = ''
          clearToLS()
        }
        return response
      },
      async (error: AxiosError) => {
        // Chỉ toast khi không phải là 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn*

        // Nếu là lỗi 401
        if (isAxiosUnauthorizedEntityError<ErrorResponseApi<{ name: string; message: string }>>(error)) {
          const config: any = error.response?.config || {}
          const { url }: any = config

          // Nếu token hết hạn và url không phải là refresh token
          if (isAxiosExpiredEntityError(error) && url !== URL_REFRESH_TOKEN) {
            // Gọi lại refresh token
            // Hạn chế gọi 2 lần handleRefreshToken
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshTokeb().finally(() => {
                  // cái ông này refreshTokenRequest lần trước đó đã thực hiện xong rồi , xong ổng set lại null chỗ này mất do ổng xong sớm quá trước thằng api nó chạy sau
                  return (this.refreshTokenRequest = null)
                })
            return this.refreshTokenRequest.then((access_token) => {
              // set lại access_token mới cho authorization && // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instance({ ...config, headers: { ...config?.headers }, authorization: access_token })
            })
          }
          // Còn những trường hợp như token không đúng
          // không truyền token,
          // token hết hạn nhưng gọi refresh token bị fail
          // thì tiến hành xóa local storage và toast message

          toast.error(error.response?.data.data?.message)
          clearToLS()
          this.accessToken = ''
          this.refreshToken = ''
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshTokeb() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearToLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}
const http = new Http().instance
export default http
