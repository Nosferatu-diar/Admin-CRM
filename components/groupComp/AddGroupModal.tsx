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
import { useCreateGroup } from "@/request/mutation";
import { Label } from "../ui/label";

export interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  admin: {
    name: string;
    teacher: string;
    started_group: Date;
    description: string;
  };
}

const AddGroupModal: React.FC<Props> = ({ open, setOpen }) => {
  const [form, setForm] = useState({
    name: "",
    teacher: "",
    description: "",
    started_group: new Date(),
  });

  const { mutate, isPending } = useCreateGroup();

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
          <DialogTitle>Yangi Guruh Qo&#39;shish</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="name">Name</Label>
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Label htmlFor="teacher">Ustoz</Label>
          <Input
            placeholder="Ustoz"
            value={form.teacher}
            onChange={(e) => setForm({ ...form, teacher: e.target.value })}
          />
          <Label htmlFor="work_date">Boshlangan vohti </Label>
          <Input
            type="date"
            value={form.started_group.toISOString().split("T")[0]}
            onChange={(e) =>
              setForm({ ...form, started_group: new Date(e.target.value) })
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

export default AddGroupModal;
