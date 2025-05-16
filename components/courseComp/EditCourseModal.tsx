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
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useEditCourse } from "@/request/mutation";
import { EditeCourseType } from "@/@types";

interface EditCourseModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  course: EditeCourseType;
}

const EditCourseModal = ({ open, setOpen, course }: EditCourseModalProps) => {
  const { mutate, isPending } = useEditCourse();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    duration: course?.duration || "",
    price: +course?.price || 0,
  });

  const handleSubmit = () => {
    if (!course?.course_id) return;
    mutate(
      {
        course_id: course.course_id,
        duration: form.duration,
        price: form.price,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["course"] });
          setOpen(false);
        },
      }
    );
  };

  React.useEffect(() => {
    if (course) {
      setForm({
        duration: course.duration || "",
        price: +course.price || 0,
      });
    } else {
      setForm({
        duration: "",
        price: 0,
      });
    }
  }, [course]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {course?.course_id ? "Tahrirlash" : "Yangi kurs yaratish"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* Editable fields */}
          <div className="space-y-2">
            <Label htmlFor="duration">Davomiyligi</Label>
            <Input
              id="duration"
              placeholder="Masalan: 3 oy"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Narxi (UZS)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Kurs narxi"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseModal;
