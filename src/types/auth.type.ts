import { User } from './user.type'
import { SuccessResponseApi } from './utils.type'

export type AuthResponse = SuccessResponseApi<{
  access_token: string
  // khai báo thêm trường cho đầy đủ
  refresh_token: string
  expires_refresh_token: number
  expires: number
  user: User
}>
export type RefreshTokenResponse = SuccessResponseApi<{
  // khi thành công thằng này sẽ trả ra access_token mới
  access_token: string
}>
