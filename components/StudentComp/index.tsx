"use client";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/request";
import { Loader, MoreHorizontal } from "lucide-react";
import { StudentType, UserType } from "@/@types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
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
import ReturnStudentModal from "./ReturnStudentModal";
import DeleteStudentModal from "./DeleteStudentModal";
import AddStudentModal from "./AddStudentMoal";
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

const StudentTable = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(
    null
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
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
    queryKey: ["students", status, debouncedSearch],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (status !== "all") queryParams.status = status;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const res = await request.get("/api/student/get-all-students", {
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
        <h1 className="text-xl font-bold">O&apos;quvchilar</h1>
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
                <SelectItem value="ta'tilda">Tatildagilar</SelectItem>
                <SelectItem value="yakunladi">Yakunlaganlar</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setOpenAdd(true)}
              className="w-full md:w-auto"
            >
              O&apos;quvchi Qo&apos;shish
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Ism</TableHead>
              <TableHead>Familiya</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Guruh soni</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((student: StudentType, index: number) => (
              <TableRow key={student._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{student.first_name}</TableCell>
                <TableCell>{student.last_name}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      student.status === "faol"
                        ? "default"
                        : student.status === "yakunladi"
                        ? "destructive"
                        : "secondary"
                    }
                    className="whitespace-nowrap"
                  >
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell>{student.groups.length}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {student.status === "faol" ? (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentId(student._id);
                            setOpenDelete(true);
                          }}
                          className="text-red-500 cursor-pointer"
                        >
                          Ishdan bo&apos;shatish
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentId(student._id);
                            setSelectedStudent(student);
                            setOpenEdit(true);
                          }}
                          className="cursor-pointer text-blue-400"
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
          <p className="text-muted-foreground">O&apos;quvchilar topilmadi</p>
          <Button variant="outline" onClick={() => setOpenAdd(true)}>
            Yangi o&apos;quvchi qo&apos;shish
          </Button>
        </div>
      )}

      {/* Modal windows */}
      {selectedStudent && openEdit && (
        <ReturnStudentModal
          open={openEdit}
          setOpen={setOpenEdit}
          admin={selectedStudent}
        />
      )}
      {selectedStudentId && openDelete && (
        <DeleteStudentModal
          open={openDelete}
          setOpen={setOpenDelete}
          studentId={selectedStudentId}
          admin={data?.find((s: StudentType) => s._id === selectedStudentId)}
        />
      )}
      {openAdd && (
        <AddStudentModal
          open={openAdd}
          setOpen={setOpenAdd}
          admin={{
            first_name: "",
            last_name: "",
            phone: "",
            groups: [{ group: "" }],
          }}
        />
      )}
    </div>
  );
};

export default StudentTable;
