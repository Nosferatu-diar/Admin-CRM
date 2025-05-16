"use client";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/request";
import { Loader, MoreHorizontal } from "lucide-react";
import { ManagersType, UserType } from "@/@types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditAdminModal from "./EditAdminModal";
import DeleteAdminModal from "./DeleteAdminModal";
import { Button } from "../ui/button";
import AddAdminModal from "./AddAdminModal";
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
import InfoAdminModal from "./AdminInfoModal";
import { useInfoManager } from "@/request/mutation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Params = {
  status?: string;
  search?: string;
};

const AdminTable = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openInfo, setOpenInfo] = useState(false);
  const { data: infoManager, isLoading: isInfoPending } = useInfoManager(
    selectedId || ""
  );
  const [selectedAdmin, setSelectedAdmin] = useState<ManagersType | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      const res = await request.get("/api/staff/all-admins", {
        params: queryParams,
      });
      return res.data.data;
    },
  });

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold">Adminlar</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism bo'yicha qidirish..."
            className="w-full md:w-[200px]"
          />
          <div className="flex gap-2">
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="faol">Faol</SelectItem>
                <SelectItem value="ta'tilda">Tatilda</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setOpenAdd(true)}
              className="w-full md:w-auto"
            >
              Admin Qo&apos;shish
            </Button>
          </div>
        </div>
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
              <TableHead>Status</TableHead>
              <TableHead>Ohirgi faollik</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((manager: ManagersType, index: number) => (
              <TableRow
                key={manager._id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  setSelectedId(manager._id);
                  setOpenInfo(true);
                }}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-full relative flex items-center justify-center font-bold text-white dark:text-black">
                    {manager?.image ? (
                      <Image
                        src={manager.image}
                        alt={manager.first_name || "admin avatar"}
                        fill
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
                    className="whitespace-nowrap"
                  >
                    {manager.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {manager.createdAt
                    ? format(new Date(manager.createdAt), "yyyy-MM-dd")
                    : "Noma'lum"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer text-blue-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAdmin(manager);
                          setOpenEdit(true);
                        }}
                      >
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAdminId(manager._id);
                          setOpenDelete(true);
                        }}
                        className="text-red-500 cursor-pointer"
                      >
                        Ishdan bo&apos;shatish
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
          <p className="text-muted-foreground">Adminlar topilmadi</p>
          <Button variant="outline" onClick={() => setOpenAdd(true)}>
            Yangi admin qo&apos;shish
          </Button>
        </div>
      )}

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
      {openAdd && (
        <AddAdminModal
          open={openAdd}
          setOpen={setOpenAdd}
          admin={{
            _id: "",
            first_name: "",
            last_name: "",
            email: "",
            status: "faol",
          }}
        />
      )}
      {selectedId && infoManager && openInfo && (
        <InfoAdminModal
          open={openInfo}
          setOpen={setOpenInfo}
          data={infoManager}
          isPending={isInfoPending}
        />
      )}
    </div>
  );
};

export default AdminTable;
