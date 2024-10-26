import { Permission, RolesIF } from '@/types/roles'
import { AuthProvider, DataProvider } from 'react-admin'

export type ReactComponent = ComponentType<any> | ReactElement | undefined

export type ModelDeligate = UserDeligate | MemoDeligate | ProductDeligate | ProductDetailDeligate

export interface ResourceIF {
  list?: ReactComponent
  show?: ReactComponent
  edit?: ReactComponent
  create?: ReactComponent
  icon?: ReactComponent
  resource: string
  defaultProp?: boolean
  name?: string
  label?: string
}

export interface ResourceMapIF {
  [key: string]: ResourceIF
}

type RecordValue = Record<string, any>

export interface BaseComponentProps extends RolesIF {
  dataProvider: DataProvider
  authProvider?: AuthProvider
}
