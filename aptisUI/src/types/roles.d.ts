import { ComponentType, ReactElement } from 'react'
import { ReactComponent } from '@repo/types/general'

export type Actions = string | string[]
export interface RolesIF {
  actions: Actions
  resource: string
}

export interface Permission {
  [key: string]: Actions
}

export interface PermissionProps {
  actions: Actions
  resource: string
  props: RecordValue
}

export interface RoleCheckingProps {
  actions: Actions
  action: string
  component: ReactComponent
  props: RecordValue
}
