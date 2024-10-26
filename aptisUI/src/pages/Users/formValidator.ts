import { RecordValue } from '../../types/general'
import { userContentLength } from '../../consts/user'
import validateForm, { ValidationRule } from '../../utils/formValidator'
import { validatePassword } from '../../utils/password'

const editionRules: ValidationRule[] = [
  // {
  //   field: 'userName',
  //   required: true,
  //   minLength: userContentLength.userName.min,
  //   maxLength: userContentLength.userName.max,
  // },
  {
    field: 'newPassword',
    required: false,
    minLength: userContentLength.newPassword.min,
    maxLength: userContentLength.newPassword.max
  },
  {
    field: 'role',
    required: true
  }
]

const creationRules: ValidationRule[] = [
  {
    field: 'userName',
    required: true,
    minLength: userContentLength.userName.min,
    maxLength: userContentLength.userName.max
  },
  {
    field: 'name',
    required: true,
    minLength: userContentLength.name.min,
    maxLength: userContentLength.name.max
  },
  {
    field: 'role',
    required: true
  },
  {
    field: 'password',
    required: true,
    minLength: userContentLength.password.min,
    maxLength: userContentLength.password.max
  }
  // {
  //   field: 'confirmPassword',
  //   required: true,
  //   minLength: userContentLength.password.min,
  //   maxLength: userContentLength.password.max,
  //   match: 'password',
  //   unMatchMessage: 'Password does not match',
  // },
]

const validateUserCreation = (values: RecordValue): RecordValue => {
  const baseValidation = validateForm(values, creationRules)

  const validPassword = validatePassword(values.password)

  return validPassword
    ? baseValidation
    : {
        ...baseValidation,
        password:
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
      }
}

const validateUserEdition = (values: RecordValue): RecordValue => {
  const baseValidation = validateForm(values, editionRules)

  const validPassword =
    values.newPassword && values.confirmNewPassword ? validatePassword(values.newPassword) : true

  return validPassword
    ? baseValidation
    : {
        ...baseValidation,
        newPassword:
          'パスワードには少なくとも 1 つの大文字、1 つの小文字、1 つの数字が含まれている必要があります'
      }
}

export { validateUserCreation, validateUserEdition }
