"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/request";
import { Loader, MoreHorizontal } from "lucide-react";
import { GroupType } from "@/@types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import AddGroupModal from "./AddGroupModal";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GroupComp = () => {
  const [openAdd, setOpenAdd] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await request.get("/api/group/get-all-group");
      return res.data.data;
    },
  });

  React.useEffect(() => {
    const updateUserFromCookie = () => {
      const cookieUser = Cookies.get("user");
      if (cookieUser) {
        try {
          // setUser(JSON.parse(cookieUser));
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
        <h1 className="text-xl font-bold">Guruhlar</h1>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpenAdd(true)}>
            Guruh Qo&apos;shish
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Guruh nomi</TableHead>
              <TableHead>Ustoz</TableHead>
              <TableHead>O&apos;quvchilar soni</TableHead>
              <TableHead>Boshlanish vaqti</TableHead>
              <TableHead>Tugash vaqti</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((group: GroupType, index: number) => (
              <TableRow key={group._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>
                  {typeof group.teacher === "object"
                    ? `${group.teacher.first_name} ${group.teacher.last_name}`
                    : group.teacher}
                </TableCell>
                <TableCell>{group.students_count ?? 0}</TableCell>
                <TableCell>
                  {group.started_group
                    ? format(new Date(group.started_group), "yyyy-MM-dd")
                    : "Noma'lum"}
                </TableCell>
                <TableCell>
                  {group.end_group
                    ? format(new Date(group.end_group), "yyyy-MM-dd")
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
                          setSelectedGroup(group);
                          // Add edit functionality here
                        }}
                      >
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add delete functionality here
                        }}
                      >
                        O&apos;chirish
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
          <p className="text-muted-foreground">Guruhlar topilmadi</p>
          <Button variant="outline" onClick={() => setOpenAdd(true)}>
            Yangi guruh qo&apos;shish
          </Button>
        </div>
      )}

      {/* Modal windows */}
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
  );
};

export default GroupComp;
