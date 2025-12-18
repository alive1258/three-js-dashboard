import { AiOutlineTransaction } from "react-icons/ai";

import { MdOutlineCategory, MdOutlineDashboard } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";

import { IconType } from "react-icons"; // Import IconType from react-icons

// Define types for sidebar items
export interface SidebarItem {
  id: number;
  name: string;
  module_id: number;
  path: string;
  Icon: IconType; // Use IconType instead of ReactElement
  sub?: SidebarItem[]; // Optional sub-items for nested menus
}

export const SidebarItemsData: SidebarItem[] = [
  {
    id: 1,
    name: "Dashboard",
    module_id: 1,
    path: "/",
    Icon: MdOutlineDashboard, // Pass the component reference, not JSX
  },
  {
    id: 2,
    name: "Three Js",
    module_id: 1,
    path: "", // Empty path = collapsible parent
    Icon: MdOutlineCategory,
    sub: [
      {
        id: 21,
        name: "Geometries",
        path: "", // Empty path = collapsible parent
        module_id: 1,
        Icon: AiOutlineTransaction,
        sub: [
          {
            id: 211,
            name: "Active Geometries",
            path: "/dashboard/geometries",
            module_id: 1,
            Icon: AiOutlineTransaction,
          },
          {
            id: 212,
            name: "Active Camera",
            path: "/dashboard/camera",
            module_id: 1,
            Icon: AiOutlineTransaction,
          },
        ],
      },
      {
        id: 22,
        name: "Materials",
        path: "", // Empty path = collapsible parent
        module_id: 1,
        Icon: AiOutlineTransaction,
        sub: [
          {
            id: 221,
            name: "All Materials",
            path: "/dashboard/materials",
            module_id: 1,
            Icon: AiOutlineTransaction,
          },
          {
            id: 222,
            name: "Common Materials",
            path: "/dashboard/common-materials",
            module_id: 1,
            Icon: AiOutlineTransaction,
          },
          {
            id: 223,
            name: "Lights",
            path: "/dashboard/lights",
            module_id: 1,
            Icon: AiOutlineTransaction,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Object3D",
    module_id: 1,
    path: "", // Empty path = collapsible parent
    Icon: AiOutlineTransaction,
    sub: [
      {
        id: 31,
        name: "All Object3D",
        path: "/dashboard/object-3d",
        module_id: 1,
        Icon: AiOutlineTransaction,
      },
      {
        id: 331,
        name: " Object 3D Hierarchy",
        path: "/dashboard/object-3d-hierarchy",
        module_id: 1,
        Icon: AiOutlineTransaction,
      },
      {
        id: 32,
        name: "Hierarchy",
        path: "",
        module_id: 1,
        Icon: AiOutlineTransaction,
        sub: [
          {
            id: 321,
            name: "Add Branch",
            path: "/branches/manage/add",
            module_id: 1,
            Icon: AiOutlineTransaction,
          },
          {
            id: 322,
            name: "Branch Settings",
            path: "/branches/manage/settings",
            module_id: 1,
            Icon: AiOutlineTransaction,
          },
        ],
      },
    ],
  },

  {
    id: 10,
    name: "EnvironmentMaps",
    module_id: 1,
    path: "/dashboard/environment-maps",
    Icon: PiStudentBold,
  },
  {
    id: 5,
    name: "Renderer",
    module_id: 1,
    path: "/dashboard/renderer",
    Icon: PiStudentBold,
  },
  {
    id: 9,
    name: "Shadows",
    module_id: 1,
    path: "/dashboard/shadows",
    Icon: PiStudentBold,
  },
];
