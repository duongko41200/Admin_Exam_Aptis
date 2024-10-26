// import * as crypto from 'crypto'

// export const hashPassword = (password: string) => {
//   // return crypto.createHash('sha256').update(password).digest('hex');

//   return
// }

export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return regex.test(password)
}
