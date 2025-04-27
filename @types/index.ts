import React from "react";

export interface ChildrenType {
  children: React.ReactNode;
}

export interface UserType {
  id: string;
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  image: string;
  role: string;
  work_date: string;
  work_end: string | null;
  createdAt: string;
  updatedAt: string;
  token: string;
  status: string;
  active: boolean;
}

export interface ManagersType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  createdAt?: string;
  last_active_date?: string;
}

export interface SidebarMenuType {
  id: number;
  title: string;
  path: string;
  Icon: React.ElementType;
}

export interface Breadcrmb_menuMenuType {
  id: number;
  title: string;
  path: string;
}
