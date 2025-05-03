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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQueryClient } from "@tanstack/react-query";

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

const EditTeacherModal = ({ open, setOpen, admin }: Props) => {
  const { mutate, isPending } = useEditedAdmin();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    _id: admin._id,
    first_name: admin.first_name,
    last_name: admin.last_name,
    email: admin.email,
    status: admin.status,
  });

  const handleSubmit = () => {
    mutate(form, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admins"] });
        setOpen(false);
      },
    });
  };

  React.useEffect(() => {
    setForm({
      _id: admin._id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      status: admin.status,
    });
  }, [admin]);

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
          {/* select */}
          <Select
            value={form.status}
            onValueChange={(val) => setForm({ ...form, status: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Statusni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="faol">Faol</SelectItem>
              <SelectItem value="ta'tilda">Tatilda</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saqlanmoqda..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherModal;
