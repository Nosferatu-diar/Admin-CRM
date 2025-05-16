"use client";
import React, { useEffect, useState } from "react";
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
import EditTeacherModal from "./ReturnTeacherModal";
import DeleteTeacherModal from "./DeleteTeacherModal";
import AddTeacherModal from "./AddTeacherModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InfoTeacherModal from "./InfoTeacherModal";

const TeacherComp = () => {
  const [openInfo, setOpenInfo] = useState(false);
  const [teacherData, setTeacherData] = useState<TeacherType | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const [selectedAdmin, setSelectedAdmin] = useState<TeacherType | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", status, debouncedSearch],
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

  const handleRowClick = (teacher: TeacherType) => {
    setTeacherData(teacher);
    setSelectedTeacherId(teacher._id);
    setOpenInfo(true);
  };

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
        <h1 className="text-xl font-bold">Ustozlar</h1>
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
                <SelectItem value="ishdan bo'shatilgan">
                  Ishdan bo&#39;shatilgan
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setOpenAdd(true)}
              className="w-full md:w-auto"
            >
              Ustoz Qo&#39;shish
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
              <TableHead>Holati</TableHead>
              <TableHead>Oxirgi faollik</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((teacher: TeacherType, index: number) => (
              <TableRow
                key={teacher._id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => handleRowClick(teacher)}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-full relative flex items-center justify-center font-bold text-white dark:text-black">
                    {teacher?.image ? (
                      <Image
                        src={teacher.image}
                        alt={teacher.first_name || "teacher avatar"}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      teacher?.first_name?.slice(0, 1)
                    )}
                  </div>
                </TableCell>
                <TableCell>{teacher.first_name}</TableCell>
                <TableCell>{teacher.last_name}</TableCell>
                <TableCell className="truncate max-w-[150px]">
                  {teacher.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      teacher.status === "faol"
                        ? "default"
                        : teacher.status === "ishdan bo'shatilgan"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {teacher.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {teacher.createdAt
                    ? format(new Date(teacher.createdAt), "yyyy-MM-dd")
                    : "Noma'lum"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {teacher.status === "faol" ? (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAdminId(teacher._id);
                            setOpenDelete(true);
                          }}
                          className="text-red-500 cursor-pointer"
                        >
                          Ishdan bo&#39;shatish
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="cursor-pointer text-blue-400"
                          onClick={() => {
                            setSelectedAdmin(teacher);
                            setOpenEdit(true);
                          }}
                        >
                          Ishga qaytarish
                        </DropdownMenuItem>
                      )}
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
          <p className="text-muted-foreground">Ustozlar topilmadi</p>
          <Button variant="outline" onClick={() => setOpenAdd(true)}>
            Yangi ustoz qo&#39;shish
          </Button>
        </div>
      )}

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

      {selectedTeacherId && openInfo && teacherData && (
        <InfoTeacherModal
          open={openInfo}
          setOpen={setOpenInfo}
          data={teacherData}
          isPending={false}
        />
      )}
    </div>
  );
};

export default TeacherComp;
