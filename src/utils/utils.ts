import userImage from 'src/assets/images/user.svg'
/* eslint-disable import/export */

import axios, { AxiosError } from 'axios'
import HttpStatusCode from '../types/httpStatus.enum'
import config from '../constrants/config'
import { ErrorResponseApi } from '../types/utils.type'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  /* eslint-disable import/no-named-as-default-member */
  return axios.isAxiosError(error)
}
// 422
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

// 401
export function isAxiosUnauthorizedEntityError<UnauthorizedEntity>(
  error: unknown
): error is AxiosError<UnauthorizedEntity> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

// token hết hạn
export function isAxiosExpiredEntityError<UnauthorizedEntity>(error: unknown): error is AxiosError<UnauthorizedEntity> {
  return (
    isAxiosUnauthorizedEntityError<ErrorResponseApi<{ name: string; message: string }>>(error) &&
    error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}
export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}
export const getUrlAvatar = (avatarName?: string) => {
  return avatarName ? `${config.baseUrl}images/${avatarName}` : userImage
}
