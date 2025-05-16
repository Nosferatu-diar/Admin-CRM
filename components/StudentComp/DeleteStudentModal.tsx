"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteStudent } from "@/request/mutation";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  studentId: string;
  admin?: {
    _id: string;
    first_name?: string;
    last_name?: string;
  };
}

const DeleteStudentModal = ({ open, setOpen, studentId, admin }: Props) => {
  const { mutate, isPending } = useDeleteStudent();
  const queryClient = useQueryClient();
  const handleDelete = () => {
    mutate(studentId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["students", "all"],
        });
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {admin?.first_name} {admin?.last_name} ustozni o‘chirishni
            xohlaysizmi?
          </DialogTitle>
        </DialogHeader>
        <div className="text-muted-foreground">
          <p className="text-sm">
            Ushbu amalni bajarish orqali siz ushbu ustozni o‘chirasiz rozilk
            berasizmi?
          </p>
        </div>
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "O'chirimoqda..." : "O'chirish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudentModal;
