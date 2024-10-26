// import { hashPassword } from '../utils/password'
import { RoleSelectInput, UserPostIF } from '../types/user'
// import countries from '@repo/assets/json/countries.json';
import { RecordValue } from '../types/general'

const defaultUsers: UserPostIF[] = [
  {
    userName: 'superadmin@miraiplay.com',
    name: 'superadmin',
    role: 1,
    password: 'Superadmin@12345',
    updateAt: new Date(),
    isDeleted: false,
    createBy: 1,
    updateBy: 1
  },
  {
    userName: 'trungpham@miraiplay.com',
    name: 'Trung Pham',
    role: 2,
    password: 'Trungpham@12345',
    updateAt: new Date(),
    isDeleted: false,

    createBy: 1,
    updateBy: 1
  }
]

// const countryList: Country[] = countries;

const userRoles: RoleSelectInput[] = [
  { id: 0, name: '無効' },
  { id: 1, name: '管理' },
  { id: 2, name: '一般' },
  { id: 3, name: '閲覧' }
]

const ROLE_ACCOUNT: { [key: string]: number } = {
  admin: 1,
  edit: 2,
  view: 3
}
// interface TypeRole {
//   0?: string;
//   1?: string;
//   2?: string;
//   3?: string;
// }
const ROLE_ACCOUNT_TEXT: RecordValue = {
  0: '無効',
  1: '管理',
  2: '一般',
  3: '閲覧'
}

const userContentLength = {
  userName: {
    min: 10,
    max: 40
  },
  name: {
    min: 2,
    max: 20
  },
  password: {
    min: 8,
    max: 20
  },
  newPassword: {
    min: 0,
    max: 0
  }
}

export {
  defaultUsers,
  // countryList,
  userRoles,
  userContentLength,
  ROLE_ACCOUNT,
  ROLE_ACCOUNT_TEXT
}
