"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateCategoryCourse } from "@/request/mutation";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCategoryCreated: (categoryName: string) => void;
}

const CreateCategoryModal: React.FC<Props> = ({
  open,
  setOpen,
  onCategoryCreated,
}) => {
  const [categoryName, setCategoryName] = React.useState("");
  const { mutate, isPending } = useCreateCategoryCourse();

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      toast.error("Kategoriya nomi kiritilishi shart");
      return;
    }

    mutate(
      { name: categoryName.trim() },
      {
        onSuccess: () => {
          toast.success("Kategoriya muvaffaqiyatli yaratildi");
          onCategoryCreated(categoryName.trim());
          setOpen(false);
          setCategoryName("");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi Kategoriya Qo&#39;shish</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Kategoriya nomi</Label>
            <Input
              id="categoryName"
              placeholder="Masalan: Dasturlash"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saqlanmoqda..." : "Kategoriyani qo'shish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
