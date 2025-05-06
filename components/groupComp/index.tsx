"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
// import { Badge } from "../ui/badge";
// import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/request";
import { Loader, MoreHorizontal } from "lucide-react";
import { GroupType } from "@/@types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import Cookies from "js-cookie";

import AddGroupModal from "./AddGroupModal";

const GroupComp = () => {
  const [openAdd, setOpenAdd] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      const res = await request.get("/api/group/get-all-group", {
        params: queryParams,
      });
      return res.data.data;
    },
  });
  console.log(data);
  useEffect(() => {
    const updateUserFromCookie = () => {
      const cookieUser = Cookies.get("user");
      if (cookieUser) {
        try {
          //   setUser(JSON.parse(cookieUser));
        } catch (error) {
          console.error("Cookie parsing error:", error);
        }
      }
    };

    updateUserFromCookie();
    window.addEventListener("user-updated", updateUserFromCookie);
    return () =>
      window.removeEventListener("user-updated", updateUserFromCookie);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Guruhlar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setOpenAdd(true)}>
            Guruh Qo‘shish
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <ScrollArea>
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-white border-b">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Guruh nomi</th>
                <th className="px-4 py-3">Ustozlar</th>
                <th className="px-4 py-3">Oquvchilar soni</th>
                <th className="px-4 py-3">Boshlangan vaqti</th>
                <th className="px-4 py-3">Tugagan vaqti</th>
                <th className="px-4 py-3">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((group: GroupType, index: number) => (
                <tr key={group._id} className="border-b hover:bg-muted">
                  <td className="px-4 py-3 font-semibold">{index + 1}</td>
                  <td className="px-4 py-3">{group.name}</td>
                  <td className="px-4 py-3">
                    {typeof group.teacher === "object"
                      ? `${group.teacher.first_name} ${group.teacher.last_name}`
                      : group.teacher}
                  </td>
                  <td className="px-4 py-3">{group.students_count ?? 0}</td>
                  <td className="px-4 py-3">
                    {group.started_group
                      ? new Date(group.started_group).toLocaleDateString()
                      : "Nomaʼlum"}
                  </td>
                  <td className="px-4 py-3">
                    {group.end_group
                      ? new Date(group.end_group).toLocaleDateString()
                      : "Nomaʼlum"}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-full items-end justify-center">
                        <MoreHorizontal className="cursor-pointer" />
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>

        {openAdd && (
          <AddGroupModal
            open={openAdd}
            setOpen={setOpenAdd}
            admin={{
              name: "",
              teacher: "",
              description: "",
              started_group: new Date(),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GroupComp;
