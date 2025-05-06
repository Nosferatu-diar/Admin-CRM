import React from "react";

export interface ChildrenType {
  children: React.ReactNode;
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
export interface UserType {
  id?: string;
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  image?: string;
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
  image?: string | null;
  role?: string;
}

export interface TeacherType {
  _id: string;
  first_name: string;
  last_name: string;
  createdAt?: string;
  email: string;
  status: string;
  image?: string | null;
  phone?: string | null;
  passwoed?: string | null;
  last_active_date?: string;
  field: string | null;
  role?: string;
}

export interface Teacher {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface Student {
  _id: string;
  first_name: string;
  email: string;
  status: string;
  password: string;
  last_name: string;
  phohe: string;
  groups: string[];
}

export interface GroupType {
  _id: string;
  name: string;
  teacher: string | Teacher;
  students_count?: number;
  started_group: string | Date;
  end_group: string | Date;
  disable: boolean;
  is_deleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
