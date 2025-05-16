"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateCourse } from "@/request/mutation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const courseFormSchema = z.object({
  name: z.string().min(1, "Kurs nomi kiritilishi shart"),
  description: z.string().min(1, "Tavsif kiritilishi shart"),
  duration: z.string().min(1, "Davomiylik kiritilishi shart"),
  price: z.number().min(1, "Narx 0 dan katta bo'lishi kerak"),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialCategory?: string;
}

const CreateCourseModal: React.FC<Props> = ({
  open,
  setOpen,
  initialCategory,
}) => {
  const { mutate, isPending } = useCreateCourse();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: initialCategory || "",
      description: "",
      duration: "",
      price: undefined,
    },
  });

  React.useEffect(() => {
    if (initialCategory) {
      form.setValue("name", initialCategory);
    }
  }, [initialCategory, form]);

  const handleSubmit = (data: CourseFormValues) => {
    setServerError(null);
    mutate(data, {
      onSuccess: () => {
        toast.success("Kurs muvaffaqiyatli yaratildi");
        setOpen(false);
        form.reset({
          name: "",
          description: "",
          duration: "",
          price: undefined, // Reset to undefined instead of 0
        });
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Xatolik yuz berdi";
        if (error.response?.status === 400) {
          setServerError(errorMessage);
          toast.error(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi Kurs Qo&#39;shish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {serverError && (
              <div className="text-red-500 text-sm text-center">
                {serverError}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kurs nomi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masalan: Backend Dasturlash"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsif</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masalan: Yangi kurs haqida qisqacha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Davomiyligi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: 2 yil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Narxi (UZS)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masalan: 1000000"
                      type="number"
                      value={field.value || ""} // Show empty string instead of 0
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only update if there's a value or when clearing
                        if (value === "" || !isNaN(Number(value))) {
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Saqlanmoqda..." : "Kursni qo'shish"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
