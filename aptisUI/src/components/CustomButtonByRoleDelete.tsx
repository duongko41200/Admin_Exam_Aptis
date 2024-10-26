import { useRecordContext } from 'react-admin'
import { ROLE_ACCOUNT } from '../consts/user'

interface userLoginType {
  id?: number
  role?: number
}

interface CustomButtonByRoleProps {
  children: JSX.Element | JSX.Element[]
  condition?: any
  source: string
  label?: string
  userLogin?: userLoginType
}

/**
 *
 * @param children - JSX.Element | JSX.Element[]
 * @param condition - condition to match
 * @param source - source to match
 * @returns
 */
export const CustomButtonByRoleDelete = ({
  children,

}: CustomButtonByRoleProps) => {
  const record = useRecordContext()

  // let defaultCondition = true
  // let check = true

  // if (userLogin?.role !== ROLE_ACCOUNT['admin']) {
  //   defaultCondition = false
  // }
  // if (record && record['id'] === userLogin?.id) {
  //   check = false
  // }

  // return <>{check && defaultCondition && children && <div>{children}</div>}</>

  return <>{children}</>
}
