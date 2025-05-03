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
import { useCreateTeacher } from "@/request/mutation";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  admin: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    status: string;
    field: string;
  };
}

const AddTeacherModal: React.FC<Props> = ({ open, setOpen }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    field: "",
  });

  const { mutate, isPending } = useCreateTeacher();

  const handleSubmit = () => {
    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.field
    ) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

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
          <DialogTitle>Yangi Ustoz Qo&#39;shish</DialogTitle>
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
          <Label htmlFor="phone">Phone</Label>
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Label htmlFor="field">Yo‘nalish</Label>
          <Select
            value={form.field}
            onValueChange={(value) => setForm({ ...form, field: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Yo‘nalishni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Flutter">Flutter</SelectItem>
              <SelectItem value="FullStack">FullStack</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saqlanmoqda..." : "Ustoz Qo'shish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherModal;
