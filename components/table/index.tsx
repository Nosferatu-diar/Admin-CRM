"use client";   
import { request } from "@/request";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Table = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["Managers"],
    queryFn: () =>
      request.get("/api/staff/all-managers").then((res) => res.data.data),
  });
  return <pre>{isLoading ? "loading" : JSON.stringify(data, null , 4)}</pre>;
};

export default Table;
