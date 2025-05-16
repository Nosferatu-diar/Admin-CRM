"use client";
import React, { useState } from "react";
import { request } from "@/request";
import { useQuery } from "@tanstack/react-query";
import { Loader, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { CourseType, EditeCourseType, UserType } from "@/@types";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteCourseModal from "./DeleteCourseModal";
import EditCourseModal from "./EditCourseModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFreezeCourse, useUnfreezeCourse } from "@/request/mutation";
import CreateCourseModal from "./CreateCourseModal";
import CreateCategoryModal from "./CreateCategoryModal";
import { toast } from "sonner";
import useDebounce from "@/request/mutation/useDebounce";

const CourseComp = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce({ value: search, delay: 500 });
  const [loadingCourseId, setLoadingCourseId] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["courses", debouncedSearch],
    queryFn: () =>
      request
        .get("/api/course/get-courses", {
          params: { search: debouncedSearch },
        })
        .then((res) => res.data.data),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = React.useState<UserType | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<EditeCourseType>();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [openCreateCourse, setOpenCreateCourse] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { mutate: freezeCourse } = useFreezeCourse();
  const { mutate: unfreezeCourse } = useUnfreezeCourse();

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

  const handleFreezeToggle = (course: CourseType) => {
    setLoadingCourseId(course._id);

    const onSettled = () => setLoadingCourseId("");

    if (course.is_freeze) {
      unfreezeCourse(course._id, { onSettled });
    } else {
      freezeCourse(course._id, { onSettled });
    }
  };

  const handleCreateCourseClick = () => {
    setOpenCreateCategory(true);
  };

  const handleCategoryCreated = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setOpenCreateCategory(false);
    setOpenCreateCourse(true);
    toast.success("Kategoriya muvaffaqiyatli yaratildi");
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
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Kurslar</CardTitle>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleCreateCourseClick}>Kurs yaratish</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Tavsifi</TableHead>
                  <TableHead>Davomiyligi</TableHead>
                  <TableHead>Holati</TableHead>
                  <TableHead>Narxi</TableHead>
                  <TableHead>Yaratilgan sana</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((course: CourseType, index: number) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {course.name.name}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {course.description}
                    </TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {loadingCourseId === course._id ? (
                          <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Switch
                            id={`freeze-${course._id}`}
                            checked={!course.is_freeze}
                            onCheckedChange={() => handleFreezeToggle(course)}
                          />
                        )}
                        <Label htmlFor={`freeze-${course._id}`}>
                          {course.is_freeze ? (
                            <Badge variant="destructive">Muzlatilgan</Badge>
                          ) : (
                            <Badge variant="default">Faol</Badge>
                          )}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.price.toLocaleString("uz-UZ", {
                        style: "currency",
                        currency: "UZS",
                      })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(course.createdAt), "yyyy-MM-dd")}
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
                            onClick={() => {
                              setSelectedCourse({
                                course_id: course._id,
                                duration: course.duration,
                                price: course.price,
                              });
                              setOpenEdit(true);
                            }}
                          >
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCourseId(course._id);
                              setOpenDelete(true);
                            }}
                            className="text-red-500"
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

          {data?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-muted-foreground">Kurslar topilmadi</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateCategoryModal
        open={openCreateCategory}
        setOpen={setOpenCreateCategory}
        onCategoryCreated={handleCategoryCreated}
      />

      <CreateCourseModal
        open={openCreateCourse}
        setOpen={setOpenCreateCourse}
        initialCategory={selectedCategory}
      />

      <EditCourseModal
        open={openEdit}
        setOpen={setOpenEdit}
        course={selectedCourse!}
      />

      <DeleteCourseModal
        open={openDelete}
        setOpen={setOpenDelete}
        courseId={selectedCourseId}
      />
    </div>
  );
};

export default CourseComp;
