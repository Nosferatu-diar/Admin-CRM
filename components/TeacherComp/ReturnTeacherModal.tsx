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
import { useReturnTeacher } from "@/request/mutation";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  admin?: {
    _id: string;
    first_name?: string;
    last_name?: string;
  };
}

const ReturnTeacherModal = ({ open, setOpen, admin }: Props) => {
  const { mutate, isPending } = useReturnTeacher();

  const handleReturn = () => {
    if (!admin?._id) return;
    mutate(admin._id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {admin?.first_name} {admin?.last_name} ustozni ishga qaytarilsinmi?
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Bu amalni bajarish orqali ustoz yana faol holatga qaytadi.
        </div>
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button variant="default" onClick={handleReturn} disabled={isPending}>
            {isPending ? "Qaytarilyapti..." : "Ishga qaytarish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnTeacherModal;
