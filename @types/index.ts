import React from "react";

export interface ChildrenType {
  children: React.ReactNode;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
}
