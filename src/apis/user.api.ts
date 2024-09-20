import { User } from '../types/user.type'
import { SuccessResponseApi } from '../types/utils.type'
import http from '../utils/http'

interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: unknown
  new_password?: string | unknown
}
export const userApi = {
  getProfile() {
    return http.get<SuccessResponseApi<BodyUpdateProfile>>('me')
  },
  updateProfile: (body: BodyUpdateProfile) => http.put<SuccessResponseApi<User>>('user', body),
  uploadFile: (body: FormData) =>
    http.post('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}
