"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/request";
import { Loader, MoreHorizontal } from "lucide-react";
import { TeacherType, UserType } from "@/@types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "use-debounce";
import EditTeacherModal from "./EditTeacherModal";
import DeleteTeacherModal from "./DeleteTeacherModal";
import AddTeacherModal from "./AddTeacherModal";

type Params = {
  status?: string;
  search?: string;
};

const TeacherComp = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<TeacherType | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [debouncedSearch] = useDebounce(search, 1000);

  const params: Params = {};
  if (status !== "all") params.status = status;
  if (search.trim()) params.search = search.trim();

  const { data, isLoading } = useQuery({
    queryKey: ["admins", status, debouncedSearch],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (status !== "all") queryParams.status = status;
      if (debouncedSearch.trim()) queryParams.search = debouncedSearch.trim();

      const res = await request.get("/api/teacher/get-all-teachers", {
        params: queryParams,
      });
      return res.data.data;
    },
  });

  useEffect(() => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Ustozlar</h1>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism bo‘yicha qidirish..."
            className="w-[200px]"
          />
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="faol">Faol</SelectItem>
              <SelectItem value="ta'tilda">Tatilda</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setOpenAdd(true)}>
            Ustoz Qo‘shish
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <ScrollArea>
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-white border-b">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Rasm</th>
                <th className="px-4 py-3">Ism</th>
                <th className="px-4 py-3">Familiya</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Holati</th>
                <th className="px-4 py-3">Oxirgi faollik</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((manager: TeacherType, index: number) => (
                <tr key={manager._id} className="border-b hover:bg-muted">
                  <td className="px-4 py-3 font-semibold">{index + 1}</td>
                  <td className="w-[40px] h-[40px] bg-black dark:bg-white rounded-full relative flex items-center justify-center font-bold text-white dark:text-black">
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
                    {manager.createdAt
                      ? format(new Date(manager.createdAt), "yyyy-MM-dd")
                      : "Noma'lum"}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      {user?.role === "admin" || "manager" ? (
                        <DropdownMenuTrigger className="flex w-full items-end justify-center">
                          <MoreHorizontal className="cursor-pointer " />
                        </DropdownMenuTrigger>
                      ) : (
                        <MoreHorizontal className="cursor-pointer " />
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
                          Ishdan bo‘shatish
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
          <EditTeacherModal
            open={openEdit}
            setOpen={setOpenEdit}
            admin={selectedAdmin}
          />
        )}
        {selectedAdminId && openDelete && (
          <DeleteTeacherModal
            open={openDelete}
            setOpen={setOpenDelete}
            adminId={selectedAdminId}
          />
        )}
        {openAdd && (
          <AddTeacherModal
            open={openAdd}
            setOpen={setOpenAdd}
            admin={{
              _id: "",
              first_name: "",
              last_name: "",
              email: "",
              status: "faol",
              phone: "",
              password: "",
              field: "",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherComp;
