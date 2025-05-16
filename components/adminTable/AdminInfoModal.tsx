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
import { ManagersType } from "@/@types";
import {
  Loader,
  Mail,
  Calendar,
  Briefcase,
  User,
  Edit,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  isPending?: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  data: ManagersType | null;
};

const InfoAdminModal = ({ open, setOpen, data, isPending }: Props) => {
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
                  Menejer Profili
                </DialogTitle>
              </DialogHeader>

              {data ? (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      {data.image ? (
                        <Image
                          src={data.image}
                          alt="Admin"
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
                        {data.role}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{data.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Briefcase className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Lavozim
                        </p>
                        <p className="font-medium">{data.role}</p>
                      </div>
                    </div>

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

                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Edit className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Oxirgi o&#39;zgartirish
                        </p>
                        <p className="font-medium">
                          {data.updatedAt
                            ? format(new Date(data.updatedAt), "dd MMMM, yyyy")
                            : "Nomaʼlum"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Leave History Section */}
                  {data.leave_history && data.leave_history.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                          Ta&#39;til tarixi
                        </h3>

                        <div className="space-y-3">
                          {data.leave_history.map((leave, index) => (
                            <div
                              key={leave._id}
                              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">
                                    {leave.start_date && leave.end_date ? (
                                      <>
                                        {format(
                                          new Date(leave.start_date),
                                          "dd MMM yyyy"
                                        )}{" "}
                                        -{" "}
                                        {format(
                                          new Date(leave.end_date),
                                          "dd MMM yyyy"
                                        )}
                                      </>
                                    ) : (
                                      "Sana ko'rsatilmagan"
                                    )}
                                  </p>
                                  {leave.reason && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {leave.reason}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="outline" className="ml-2">
                                  #{index + 1}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Empty Leave History State */}
                  {(!data.leave_history ||
                    data.leave_history.length === null) && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg text-center">
                        <AlertCircle className="w-8 h-8 text-gray-400 mb-3" />
                        <h4 className="font-medium text-gray-600 dark:text-gray-400">
                          Ta&#39;til tarixi mavjud emas
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Ushbu xodim hali ta&#39;tilga chiqmagan
                        </p>
                      </div>
                    </>
                  )}

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

export default InfoAdminModal;
