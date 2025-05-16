"use client";
import React, { useState } from "react";
import { request } from "@/request";
import { useQuery } from "@tanstack/react-query";
import { Loader, MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
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
import InfoManagerModal from "./ManagerInfoModal";
import { useInfoManager } from "@/request/mutation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import DeleteManagerModal from "./DeleteManagerModal";
import EditManagerModal from "./EditManagerModal";

const ManagerTable = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["managers", debouncedSearch],
    queryFn: () =>
      request
        .get("/api/staff/all-managers", {
          params: { search: debouncedSearch },
        })
        .then((res) => res.data.data),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openInfo, setOpenInfo] = useState(false);
  const { data: infoManager, isLoading: isInfoPending } = useInfoManager(
    selectedId || ""
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Menejerlar</h1>
        <Input
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={() => {
            setSelectedAdmin(null);
            setOpenEdit(true);
          }}
        >
          Menejer yaratish
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[60px]">Rasm</TableHead>
              <TableHead>Ism</TableHead>
              <TableHead>Familiya</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Holati</TableHead>
              <TableHead>Ohirgi faollik</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((manager: ManagersType, index: number) => (
              <TableRow key={manager._id} className="hover:bg-muted/50 ">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-full relative flex items-center justify-center font-bold text-white dark:text-black">
                    {manager?.image ? (
                      <Image
                        src={manager.image}
                        alt={manager.first_name || "manager avatar"}
                        fill
                        sizes="40px"
                        className="rounded-full object-cover"
                      />
                    ) : (
                      manager?.first_name?.slice(0, 1)
                    )}
                  </div>
                </TableCell>
                <TableCell>{manager.first_name}</TableCell>
                <TableCell>{manager.last_name}</TableCell>
                <TableCell className="truncate max-w-[150px]">
                  {manager.email}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {manager.createdAt &&
                  !isNaN(new Date(manager.createdAt).getTime())
                    ? format(new Date(manager.createdAt), "yyyy-MM-dd")
                    : "Noma'lum"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
                        Ishdan bo&apos;shatish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedId(manager._id);
                          setOpenInfo(true);
                        }}
                        className="text-green-500 cursor-pointer"
                      >
                        Ma&apos;lumotlari
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty state */}
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
          <p className="text-muted-foreground">Menejerlar topilmadi</p>
        </div>
      )}

      {/* Modal windows */}
      {selectedAdmin && openEdit && (
        <EditManagerModal
          open={openEdit}
          setOpen={setOpenEdit}
          admin={selectedAdmin}
        />
      )}

      {selectedAdminId && openDelete && (
        <DeleteManagerModal
          open={openDelete}
          setOpen={setOpenDelete}
          adminId={selectedAdminId}
        />
      )}

      {selectedId && infoManager && openInfo && (
        <InfoManagerModal
          open={openInfo}
          setOpen={setOpenInfo}
          data={infoManager}
          isPending={isInfoPending}
        />
      )}
    </div>
  );
};

export default ManagerTable;
