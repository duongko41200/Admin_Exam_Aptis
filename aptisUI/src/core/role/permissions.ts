import { ReactComponent } from '@/types/general'
import { Actions, Permission, RoleCheckingProps } from '@/types/roles'
import { createElement, FunctionComponent } from 'react'

const ADMIN: Permission = {
  users: '*',
  products: '*',
  'product-inspection': '*',
  'product-logs': '*',
  text: '*',
  video: '*',
  speak: '*',
  writting: '*',
  calendar: '*',
  'flash-card': '*'
}
const EDIT: Permission = {
  users: ['list', 'show', 'edit'],
  products: ['create', 'list', 'show', 'edit', 'delete'],
  'product-inspection': ['create', 'list', 'show', 'edit', 'delete'],
  'product-logs': ['list', 'show', 'edit', 'delete'],
  text: ['list', 'show', 'edit', 'delete'],
  video: ['list', 'show', 'edit', 'delete'],
  speak: ['list', 'show', 'edit', 'delete'],
  writting: ['list', 'show', 'edit', 'delete'],
  calendar: ['list', 'show', 'edit', 'delete'],
  'flash-card': ['list', 'show', 'edit', 'delete']
}
const VIEW: Permission = {
  users: ['list', 'show', 'edit'],
  products: ['list', 'show'],
  'product-inspection': ['list', 'show'],
  'product-logs': ['list', 'show'],
  text: ['list', 'show'],
  video: ['list', 'show'],
  speak: ['list', 'show'],
  writting: ['list', 'show'],
  calendar: ['list', 'show'],
  'flash-card': ['list', 'show']
}

const ROLES_MAP: {
  [key: string]: Permission
} = {
  1: ADMIN,
  2: EDIT,
  3: VIEW
}

/**
 *
 * @param role role to check
 * @returns actions of pemission
 */
const generateRole = (role: number) => {
  return ROLES_MAP[role]
}

/**
 *
 * @param role role to check
 * @param actions actions of pemission to check
 * @returns boolean role is valid or not
 */
const validRole = (role: string, actions: Actions): boolean => {
  return actions === '*' || actions.includes(role)
}

/**
 *
 * @param actions actions of pemission to check
 * @param action action of screen to check
 * @param component component to render
 * @param props props to pass to component
 * @returns
 */
const checkRole = ({ actions, action, component, props }: RoleCheckingProps): ReactComponent => {
  if (!component) return undefined

  const resComponent = props ? createElement(component as FunctionComponent, props) : component

  const isRender = validRole(action, actions)

  return isRender ? resComponent : undefined
}

export { checkRole, generateRole, validRole }
