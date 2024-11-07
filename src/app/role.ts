export const MOUSE_BUTTONS = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};
export enum ContextMenuItems {
  AddRole = 'Add Role',
  AddUser = 'Add User',
  EditRole = 'Edit Role',
  RemoveRole = 'Remove Role',
  RemoveUser = 'Remove User',
  CollapseRole = 'Collapse Role',
  CollapseAll = 'Collapse All',
  ShowHideUsers = 'Show/Hide Users',
  ShowHideUser = 'Show/Hide User',
  ShowHideRole = 'Show/Hide Role',
}
export const CONTEXT_MENU_ITEMS = [
  { text: ContextMenuItems.AddRole },
  { text: ContextMenuItems.AddUser },
  { text: ContextMenuItems.ShowHideUsers },
  { text: ContextMenuItems.RemoveRole },
  { text: ContextMenuItems.RemoveUser },
]
export type OrganizationChartEvent = ContextMenuItems;
export interface OrganizationChartEventArgs {
  data: ChartDataType,
  eventType: OrganizationChartEvent;
}
export interface ToggleItem{
  pid?:string;
  id: string;
  showData: boolean;
}
export type ChartDataType =
  | { type: 'organization'; data: OrganizationRole }
  | { type: 'toggle'; data: ToggleItem };

export interface OrganizationRole {
  id: string;
  pid?:string;
  name: string;
  hasChild?: boolean;
  expanded?: boolean;
  isRole: boolean;
  hidden?: boolean;
  userHidden?: boolean;
  users?: EntityRef[];
  [key: string]: unknown;
}
export declare class EntityRef {
  id: string;
  name: string;
  hidden?: boolean;
}

