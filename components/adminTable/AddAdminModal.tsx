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
import { useCreatedAdmin } from "@/request/mutation";
import { Label } from "../ui/label";

export interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  admin: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
  };
}

const AddAdminModal: React.FC<Props> = ({ open, setOpen }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "admin",
    work_date: new Date(),
  });

  const { mutate, isPending } = useCreatedAdmin();

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
          <DialogTitle>Yangi Admin Qo&#39;shish</DialogTitle>
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
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Label htmlFor="work_date">Work Date</Label>
          <Input
            type="date"
            value={form.work_date.toISOString().split("T")[0]}
            onChange={(e) =>
              setForm({ ...form, work_date: new Date(e.target.value) })
            }
          />
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saqlanmoqda..." : "Admin Qo'shish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminModal;
