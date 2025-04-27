"use client";
import React from "react";
import { request } from "@/request";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import { ManagersType } from "@/@types";

const ManagerTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["Managers"],
    queryFn: () =>
      request.get("/api/staff/all-managers").then((res) => res.data.data),
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <ScrollArea className="w-full">
      <table className="min-w-full text-sm text-left table-auto">
        <thead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-white border-b">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">First Name</th>
            <th className="px-4 py-3">Last Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((manager: ManagersType, index: number) => (
            <tr key={manager._id} className="border-b hover:bg-muted">
              <td className="px-4 py-2 font-semibold">{index + 1}</td>
              <td className="px-4 py-2">{manager.first_name}</td>
              <td className="px-4 py-2">{manager.last_name}</td>
              <td className="px-4 py-2">{manager.email}</td>
              <td className="px-4 py-2">
                <Badge
                  variant={manager.status === "faol" ? "default" : "secondary"}
                >
                  {manager.status}
                </Badge>
              </td>
              <td className="px-4 py-2">
                {manager.createdAt &&
                !isNaN(new Date(manager.createdAt).getTime())
                  ? format(new Date(manager.createdAt), "yyyy-MM-dd")
                  : "Noma'lum"}
              </td>
              <td className="px-4 py-2">
                {manager.last_active_date &&
                !isNaN(new Date(manager.last_active_date).getTime())
                  ? format(
                      new Date(manager.last_active_date),
                      "yyyy-MM-dd HH:mm"
                    )
                  : "Noma'lum"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
};

export default ManagerTable;
