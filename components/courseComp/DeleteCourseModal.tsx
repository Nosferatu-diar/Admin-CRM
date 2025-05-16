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
import { useDeleteCourse } from "@/request/mutation";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  courseId: string;
}

const DeleteCourseModal = ({ open, setOpen, courseId }: Props) => {
  const { mutate, isPending } = useDeleteCourse();

  const handleDelete = () => {
    mutate(courseId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ishonchingiz komilmi?</DialogTitle>
        </DialogHeader>
        <div className="text-muted-foreground">
          Bu amalni qaytarib bo‘lmaydi. Kurs butunlay o‘chiriladi.
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
            {isPending ? "Kurs o‘chirilmoqda..." : "O‘chirish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseModal;
