import { Breadcrmb_menuMenuType, SidebarMenuType } from "@/@types";
import {
  Boxes,
  CircleUserRound,
  ContactRound,
  HomeIcon,
  Settings,
  ShieldUser,
  UserRoundPen,
  Users,
} from "lucide-react";

export const sidebar_menu: SidebarMenuType[] = [
  {
    id: 1,
    title: "Asosiy",
    path: "/",
    Icon: HomeIcon,
  },
  {
    id: 2,
    title: "Menejerlar",
    path: "/managers",
    Icon: ShieldUser,
  },
  {
    id: 3,
    title: "Adminlar",
    path: "/admins",
    Icon: ContactRound,
  },
  {
    id: 4,
    title: "Ustozlar",
    path: "/teachers",
    Icon: UserRoundPen,
  },
  {
    id: 5,
    title: "O'quvchilar",
    path: "/students",
    Icon: Users,
  },
  {
    id: 6,
    title: "Guruhlar",
    path: "/groups",
    Icon: Boxes,
  },
];

export const others_menu: SidebarMenuType[] = [
  {
    id: 1,
    title: "Sozlamalar",
    path: "/settings",
    Icon: Settings,
  },
  {
    id: 2,
    title: "Profil",
    path: "/profile",
    Icon: CircleUserRound,
  },
];

export const breadcrmb_menu: Breadcrmb_menuMenuType[] = [
  {
    id: 1,
    title: "Asosiy",
    path: "/",
  },
  {
    id: 2,
    title: "Menejerlar",
    path: "/managers",
  },
  {
    id: 3,
    title: "Adminlar",
    path: "/admins",
  },
  {
    id: 4,
    title: "Ustozlar",
    path: "/teachers",
  },
  {
    id: 5,
    title: "O'quvchilar",
    path: "/students",
  },
  {
    id: 6,
    title: "Guruhlar",
    path: "/groups",
  },
  {
    id: 7,
    title: "Sozlamalar",
    path: "/settings",
  },
  {
    id: 8,
    title: "Profil",
    path: "/profile",
  },
];
