"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { TeacherType } from "@/@types";
import { Loader, Mail, Phone, Calendar, User, Edit, Code } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  isPending?: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  data: TeacherType | null;
};

const InfoTeacherModal = ({ open, setOpen, data, isPending }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl rounded-lg">
        {isPending ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="max-h-[80vh]">
            <div className="pr-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                  Ustoz Profili
                </DialogTitle>
              </DialogHeader>

              {data ? (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="relative">
                      {data.image ? (
                        <Image
                          src={data.image}
                          alt="teacher"
                          width={100}
                          height={100}
                          className="rounded-full object-cover border-4 border-primary/20"
                        />
                      ) : (
                        <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                          {data.first_name[0]}
                        </div>
                      )}
                      <Badge
                        variant={
                          data.status === "faol"
                            ? "default"
                            : data.status === "ishdan bo'shatilgan"
                            ? "destructive"
                            : "secondary"
                        }
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1"
                      >
                        {data.status}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {data.first_name} {data.last_name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {data.field}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{data.email}</span>
                        </div>
                        {data.phone && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{data.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* field */}
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Code className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Mutaxassislik
                        </p>
                        <p className="font-medium">
                          {data.field || "Noma'lum"}
                        </p>
                      </div>
                    </div>
                    {/* salary */}
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <User className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Maosh
                        </p>
                        <p className="font-medium">{data.salary} so&apos;m</p>
                      </div>
                    </div>
                    {/* createdAt */}
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <User className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Yaratilgan
                        </p>
                        <p className="font-medium">
                          {data.createdAt
                            ? format(new Date(data.createdAt), "dd MMMM, yyyy")
                            : "Nomaʼlum"}
                        </p>
                      </div>
                    </div>
                    {/* updatedAt */}
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <User className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Yangilangan
                        </p>
                        <p className="font-medium">
                          {data.updatedAt
                            ? format(new Date(data.updatedAt), "dd MMMM, yyyy")
                            : "Nomaʼlum"}
                        </p>
                      </div>
                    </div>
                    {/* work_date */}
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ishga kirgan sana
                        </p>
                        <p className="font-medium">
                          {data.work_date
                            ? format(new Date(data.work_date), "dd MMMM, yyyy")
                            : "Nomaʼlum"}
                        </p>
                      </div>
                    </div>
                    {/* work_end */}
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <User className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ishdan chiqqan sana
                        </p>
                        <p className="font-medium">
                          {data.work_end
                            ? format(new Date(data.work_end), "dd MMMM, yyyy")
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Guruhlar:</h3>
                    {data.groups.map((group) => (
                      <div
                        key={group._id}
                        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm"
                      >
                        <p>
                          <strong>Guruh nomi:</strong> {group.name}
                        </p>
                        <p>
                          <strong>Kurs:</strong> {group.course}
                        </p>
                        <p>
                          <strong>Boshlangan:</strong>{" "}
                          {format(new Date(group.started_group), "dd MMM yyyy")}
                        </p>
                        <p>
                          <strong>Tugagan:</strong>{" "}
                          {format(new Date(group.end_group), "dd MMM yyyy")}
                        </p>
                        <p>
                          <strong>Narx:</strong> {group.price} so&apos;m
                        </p>
                        <p>
                          <strong>Holat:</strong>{" "}
                          {group.disable ? "Faol emas" : "Faol"}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6 pb-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Yopish
                    </Button>
                    <Button variant="default">
                      <Edit className="w-4 h-4 mr-2" />
                      Tahrirlash
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Maʼlumotlar topilmadi</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InfoTeacherModal;
