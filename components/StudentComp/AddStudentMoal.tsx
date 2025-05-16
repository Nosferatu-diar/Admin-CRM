"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateStudent } from "@/request/mutation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchGroups } from "./useSearchGroup";
import { GroupType, Student } from "@/@types";
import { cn } from "@/lib/utils";
import { studentSchema } from "@/validation/student.schema";
import { z } from "zod";

const AddStudentModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  admin: Student;
}) => {
  const { mutate, isPending } = useCreateStudent();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [search, setSearch] = useState("");
  const { data: groups } = useSearchGroups(search);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof studentSchema>, string>>
  >({});

  const validate = () => {
    const result = studentSchema.safeParse({ ...form, group: selectedGroupId });
    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof z.infer<typeof studentSchema>, string>
      > = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      ...form,
      groups: [{ group: selectedGroupId }] as [{ group: string }],
    };

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["student"] });
        setOpen(false);
        setForm({ first_name: "", last_name: "", phone: "" });
        setSelectedGroupId("");
        setSearch("");
        setErrors({});
      },
    });
  };

  const handleGroupSelect = (groupId: string, groupName: string) => {
    setSelectedGroupId(groupId);
    setSearch(groupName);
    setErrors((prev) => ({ ...prev, group: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi O‘quvchi Qo‘shish</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Ism</Label>
            <Input
              placeholder="Ism"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className={cn(errors.first_name && "border-red-500")}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>

          <div>
            <Label>Familiya</Label>
            <Input
              placeholder="Familiya"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className={cn(errors.last_name && "border-red-500")}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>

          <div>
            <Label>Telefon</Label>
            <Input
              placeholder="Telefon"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={cn(errors.phone && "border-red-500")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label>Guruhni tanlang</Label>
            <Input
              placeholder="Guruh nomini qidiring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(errors.group && "border-red-500")}
            />
            {errors.group && (
              <p className="text-red-500 text-sm mt-1">{errors.group}</p>
            )}
          </div>

          {groups?.length > 0 && (
            <div className="border rounded p-2 max-h-40 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guruh nomi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group: GroupType) => (
                    <TableRow
                      key={group._id}
                      onClick={() => handleGroupSelect(group._id, group.name)}
                      className="cursor-pointer hover:bg-muted"
                    >
                      <TableCell>{group.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Qo'shilmoqda..." : "Qo‘shish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;
