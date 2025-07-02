import { ReactComponent } from "@/types/general";
import { Actions, Permission, RoleCheckingProps } from "@/types/roles";
import { createElement, FunctionComponent } from "react";

const ADMIN: Permission = {
  users: "*",
  readings: "*",
  "test-banks": "*",
  writings: "*",
  speakings: "*",
  listenings: "*",
  courses: "*",
  lectures: "*",
  assignments: "*",
};
const EDIT: Permission = {
  users: ["list", "show", "edit"],
  readings: ["list", "show", "edit", "delete"],
  "test-banks": ["list", "show", "edit", "delete"],
  writings: ["list", "show", "edit", "delete"],
  speakings: ["list", "show", "edit", "delete"],
  listenings: ["list", "show", "edit", "delete"],
  courses: ["list", "show", "edit", "delete"],
  lectures: ["list", "show", "edit", "delete"],
  assignments: ["list", "show", "edit", "delete"],
};
const VIEW: Permission = {
  users: ["list", "show", "edit"],

  readings: ["list", "show"],
  "test-banks": ["list", "show"],
  writings: ["list", "show"],
  speakings: ["list", "show"],
  listenings: ["list", "show"],
  courses: ["list", "show"],
  lectures: ["list", "show"],
  assignments: ["list", "show"],
};

const ROLES_MAP: {
  [key: string]: Permission;
} = {
  1: ADMIN,
  2: EDIT,
  3: VIEW,
};

/**
 *
 * @param role role to check
 * @returns actions of pemission
 */
const generateRole = (role: number) => {
  return ROLES_MAP[role];
};

/**
 *
 * @param role role to check
 * @param actions actions of pemission to check
 * @returns boolean role is valid or not
 */
const validRole = (role: string, actions: Actions): boolean => {
  return actions === "*" || actions.includes(role);
};

/**
 *
 * @param actions actions of pemission to check
 * @param action action of screen to check
 * @param component component to render
 * @param props props to pass to component
 * @returns
 */
const checkRole = ({
  actions,
  action,
  component,
  props,
}: RoleCheckingProps): ReactComponent => {
  if (!component) return undefined;

  const resComponent = props
    ? createElement(component as FunctionComponent, props)
    : component;

  const isRender = validRole(action, actions);

  return isRender ? resComponent : undefined;
};

export { checkRole, generateRole, validRole };
