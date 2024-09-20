/* eslint-disable import/no-unresolved */
import * as yup from 'yup'
// type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }
// export const rules: Rules = {
//   email: {
//     required: {
//       value: true,
//       message: 'Email bắt buộc'
//     },
//     pattern: {
//       value: /^\S+@\S+\.\S+$/,
//       message: 'Email không đúng định dạng'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Độ dài là từ 6-160 ký tự'
//     },
//     minLength: {
//       value: 6,
//       message: 'Độ dài là từ 6-160 ký tự'
//     }
//   },
//   password: {
//     required: {
//       value: true,
//       message: 'Password là bắt buộc'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Độ dài là từ 6-160 ký tự'
//     },
//     minLength: {
//       value: 6,
//       message: 'Độ dài là từ 6-160 ký tự'
//     }
//   },
//   confirm_password: {
//     required: {
//       value: true,
//       message: 'Confirm password là bắt buộc'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Độ dài là từ 6-160 ký tự'
//     },
//     minLength: {
//       value: 6,
//       message: 'Độ dài là từ 6-160 ký tự'
//     }
//   }
// }
// function testPriceMinMax(this: yup.TestContext<AnyObject>) {
//   const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
//   if (price_min !== '' && price_max !== '') {
//     return Number(price_max) >= Number(price_min)
//   }
//   return price_min !== '' || price_max !== ''
// }

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent
  if (price_max !== '' || price_min !== '') {
    return price_max >= price_min
  }
  return price_min !== '' || price_max !== ''
}
export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email Không đúng định dạng')
    .min(6, 'Độ dài là từ 6-160 ký tự')
    .max(160, 'Độ dài là từ 6-160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài là từ 6-160 ký tự')
    .max(160, 'Độ dài là từ 6-160 ký tự'),
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Gía không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Gía không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required()
})
export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  phone: yup.string().max(20, 'Độ dài kí tự là 20 kí tự'),
  address: yup.string().max(160, 'Độ dài kí tự là 160 kí tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: handleConfirmPasswordYup('new_password'),
  avatar: yup.string().max(1000, 'Độ dài kí tự là 1000')
})

export type UserSchema = yup.InferType<typeof userSchema>

export const loginSchema = schema.pick(['email', 'password'])
export const registerSchema = schema.pick(['email', 'password', 'confirm_password'])
export type loginFormData = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
