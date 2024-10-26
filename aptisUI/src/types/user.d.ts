type Role = 0 | 1 | 2 | 3
type UseFlag = 1 | 0

export interface UserIF {
  id?: number
  userName: string
  name: string
  role: Role
  password: string
  newPassword?: string
  isDeleted?: boolean
  createAt?: Date
  updateAt?: Date
  createBy: number
  updateBy: number
}

export interface UserPostIF {
  userName: string
  name: string
  role: Role
  password: string
  newPassword?: string
  updateAt?: Date
  isDeleted: boolean
  createBy?: number
  updateBy?: number
}

export interface Country {
  name: string
  code: string
}

export interface RoleSelectInput {
  id: string | number
  name: string
}
