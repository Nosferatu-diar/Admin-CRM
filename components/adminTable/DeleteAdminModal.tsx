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
import { useDeletedAdmin } from "@/request/mutation";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  adminId: string;
}

const DeleteAdminModal = ({ open, setOpen, adminId }: Props) => {
  const { mutate, isPending } = useDeletedAdmin();

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
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="text-muted-foreground">
          This action cannot be undone. This will permanently delete this admin.
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
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAdminModal;
