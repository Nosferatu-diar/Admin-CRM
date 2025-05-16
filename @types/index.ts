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
  createdAt?: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string | null;
  role: string;
  status: string;
  updatedAt?: string;
  work_date?: string;
  _id: string;
  leave_history: {
    end_date?: string;
    reason?: string;
    start_date?: string;
    _id: string;
  }[];
}

export interface ManagerEditType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export interface TeacherType {
  createdAt?: string;
  email: string;
  field: string;
  first_name: string;
  groups: [
    {
      course: string;
      createdAt: string;
      disable: false;
      end_group: string;
      is_deleted: true;
      name: string;
      price: number;
      started_group: string;
      students: StudentType;
      teacher: string;
      updatedAt: string;
      _id: string;
    }
  ];
  image?: string | null;
  last_name: string;
  phone: string;
  salary: number;
  status: string;
  updatedAt: string;
  work_date?: string;
  work_end?: string | null;
  role: string;
  _id: string;
}

export interface StudentType {
  _id: string;
  last_name: string;
  first_name: string;
  status: string;
  phone?: string | null;
  createdAt: string;
  leave_history: string[];
  updatedAt: string;
  groups: string[];
  image?: string | null;
}

export interface Student {
  first_name: string;
  last_name: string;
  phone: string;
  groups: [
    {
      group: string;
    }
  ];
}

export interface GroupType {
  _id: string;
  course: string;
  createdAt: string;
  end_group: string;
  name: string;
  students_count?: number;
  started_group: string | Date;
  updatedAt: string | Date;
  teacher: TeacherType;
  student: StudentType;
}

export interface CourseType {
  createdAt: string;
  description: string;
  duration: string;
  is_freeze: boolean;
  price: number;
  updatedAt: string;
  _id: string;
  name: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface EditeCourseType {
  course_id: string;
  duration: string;
  price: string | number;
}
