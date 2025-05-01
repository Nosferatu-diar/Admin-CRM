"use client";
import React, { useState } from "react";

import { request } from "@/request";
import { useQuery } from "@tanstack/react-query";
import { Loader, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import { ManagersType, UserType } from "@/@types";
import Image from "next/image";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import EditAdminModal from "../adminTable/EditAdminModal";
import DeleteAdminModal from "../adminTable/DeleteAdminModal";

const ManagerTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["Managers"],
    queryFn: () =>
      request.get("/api/staff/all-managers").then((res) => res.data.data),
  });

  const [user, setUser] = React.useState<UserType | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<ManagersType | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  React.useEffect(() => {
    const updateUserFromCookie = () => {
      const cookieUser = Cookies.get("user");
      if (cookieUser) {
        try {
          setUser(JSON.parse(cookieUser));
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
    <div>
      <ScrollArea className="w-full">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-white border-b">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Img</th>
              <th className="px-4 py-3">First Name</th>
              <th className="px-4 py-3">Last Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((manager: ManagersType, index: number) => (
              <tr key={manager._id} className="border-b hover:bg-muted">
                <td className="px-4 py-3 font-semibold">{index + 1}</td>
                <td className="w-[40px] h-[40px] bg-black mt-0.5 dark:bg-white rounded-full relative flex items-center justify-center font-bold text-white dark:text-black">
                  {manager?.image ? (
                    <Image
                      src={manager.image}
                      alt={manager.first_name || "manager avatar"}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    manager?.first_name?.slice(0, 1)
                  )}
                </td>
                <td className="px-4 py-3">{manager.first_name}</td>
                <td className="px-4 py-3">{manager.last_name}</td>
                <td className="px-4 py-3">{manager.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      manager.status === "faol"
                        ? "default"
                        : manager.status === "ishdan bo'shatilgan"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {manager.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {manager.createdAt &&
                  !isNaN(new Date(manager.createdAt).getTime())
                    ? format(new Date(manager.createdAt), "yyyy-MM-dd")
                    : "Noma'lum"}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    {user?.role === "manager" ? (
                      <MoreHorizontal className="cursor-pointer " />
                    ) : (
                      <DropdownMenuTrigger className="flex w-full items-end justify-center">
                        <MoreHorizontal className="cursor-pointer " />
                      </DropdownMenuTrigger>
                    )}
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="cursor-pointer text-blue-400"
                        onClick={() => {
                          setSelectedAdmin(manager);
                          setOpenEdit(true);
                        }}
                      >
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAdminId(manager._id);
                          setOpenDelete(true);
                        }}
                        className="text-red-500 cursor-pointer"
                      >
                        Ishadn bo&apos;shatish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
            
      {/* Modal windows */}
      {selectedAdmin && openEdit && (
        <EditAdminModal
          open={openEdit}
          setOpen={setOpenEdit}
          admin={selectedAdmin}
        />
      )}

      {selectedAdminId && openDelete && (
        <DeleteAdminModal
          open={openDelete}
          setOpen={setOpenDelete}
          adminId={selectedAdminId}
        />
      )}
    </div>
  );
};

export default ManagerTable;
