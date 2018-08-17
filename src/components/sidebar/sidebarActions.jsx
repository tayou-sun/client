import { SIDEBAR__SHOW, SIDEBAR__HIDE } from "./sidebarConstants";

export function showSidebar() {
  return { type: SIDEBAR__SHOW };
}
export function hideSidebar() {
  return { type: SIDEBAR__HIDE };
}
