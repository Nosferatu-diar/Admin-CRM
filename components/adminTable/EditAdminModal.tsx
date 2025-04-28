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
import { useEditedAdmin } from "@/request/mutation";
import { Label } from "../ui/label";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  admin: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
  };
}

const EditAdminModal = ({ open, setOpen, admin }: Props) => {
  const [form, setForm] = useState({
    _id: admin._id,
    first_name: admin.first_name,
    last_name: admin.last_name,
    email: admin.email,
    status: admin.status,
  });

  const { mutate, isPending } = useEditedAdmin();

  const handleSubmit = () => {
    mutate(form, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Label htmlFor="status">Status</Label>
          <Input
            placeholder="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saqlanmoqda..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminModal;
