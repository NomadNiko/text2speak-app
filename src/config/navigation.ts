// src/config/navigation.ts
import { RoleEnum } from "@/services/api/types/role";

export interface NavigationItem {
  label: string;
  path: string;
  roles?: number[];
  mobileOnly?: boolean;
  desktopOnly?: boolean;
  children?: NavigationItem[];
}

const createNavigationConfig = (): NavigationItem[] => [
  {
    label: "common:navigation.home",
    path: "/",
  },
  {
    label: "common:navigation.tts",
    path: "/text-to-speech",
  },
  {
    label: "common:navigation.users",
    path: "/admin-panel/users",
    roles: [RoleEnum.ADMIN],
  },
];

export const getNavigationConfig = () => createNavigationConfig();
