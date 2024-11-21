import { User } from '../types/user.type'

/* eslint-disable @typescript-eslint/no-unused-vars */

export const LocalStorageEventTarget = new EventTarget()
const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
const getAccessTokenToLS = () => {
  return localStorage.getItem('access_token') || ''
}
const getRefreshTokenToLS = () => {
  return localStorage.getItem('refresh_token') || ''
}
const clearToLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearToLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
const getProfile = () => {
  const data = localStorage.getItem('profile')
  return data ? JSON.parse(data) : null
}
const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export { setAccessTokenToLS, getAccessTokenToLS, clearToLS, getProfile, setProfileToLS, getRefreshTokenToLS }
