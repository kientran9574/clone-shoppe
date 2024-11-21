import { AuthResponse } from '../types/auth.type'
import http from '../utils/http'

export const URL_REFRESH_TOKEN = 'refresh-access-token'

export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)
export const login = (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)
export const logout = () => http.post('/logout')
