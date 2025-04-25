"use client";
import { useMutation } from "@tanstack/react-query";
import { request } from "..";
import type { UserType } from "@/@types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { notificationApi } from "@/generics/nitification";

export const useLoginMutation = () => {
  const router = useRouter();
  const notify = notificationApi();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: object) =>
      request.post("/api/auth/sign-in", data).then((res) => res.data.data),
    onSuccess: async (data: UserType) => {
      const token = data.token;
      Cookies.set("user", JSON.stringify(data), { expires: 1 / 24 });
      Cookies.set("token", token, { expires: 1 / 24 });
      notify("login");
      router.push("/");
      console.log(token);
    },
    onError: (error: { status: number }) => {
      if (error.status === 400) {
        return notify("wrong_login");
      }
      if (error.status === 500) {
        return notify(500);
      }
    },
  });
};
