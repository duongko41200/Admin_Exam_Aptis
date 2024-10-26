import { useRecordContext } from 'react-admin'

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
  isShowCheckDelete?: boolean
}

/**
 *
 * @param children - JSX.Element | JSX.Element[]
 * @param condition - condition to match
 * @param source - source to match
 * @returns
 */
export const CustomButtonByRoleEdit = ({
  children,

}: CustomButtonByRoleProps) => {
  const record = useRecordContext()

  const defaultCondition = true
  const check = true

  // if (
  //   record[source] === ROLE_ACCOUNT['admin'] &&
  //   userLogin &&
  //   userLogin?.role !== ROLE_ACCOUNT['admin']
  // ) {
  //   defaultCondition = false;
  // }
  // console.log({ defaultCondition });

  // return <>{check && defaultCondition && children && <div>{children}</div>}</>;

  return <>{children}</>
}
