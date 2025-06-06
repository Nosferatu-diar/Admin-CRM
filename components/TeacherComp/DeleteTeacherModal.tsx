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
import { useTeacherDelete } from "@/request/mutation";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  adminId: string;
}

const DeleteTeacherModal = ({ open, setOpen, adminId }: Props) => {
  const { mutate, isPending } = useTeacherDelete();

  const handleDelete = () => {
    mutate(adminId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>O&apos;chirishingizga ishonchingiz komilmi?</DialogTitle>
        </DialogHeader>
        <div className="text-muted-foreground">
          Ushbu amalni bajarish orqali ustoz o&apos;chiriladi va qayta
          tiklanmaydi.
        </div>
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "O'chirilmoqda..." : "O'chirish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTeacherModal;
