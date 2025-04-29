"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "..";
import type { UserType } from "@/@types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { notificationApi } from "@/generics/nitification";
type ProfileUpdatePayload = {
  email: string;
  first_name: string;
  last_name: string;
  image?: string | File;
};

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

const useEditedCacheAdmin = () => {
  const queryClient = useQueryClient();

  return (data: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
  }) => {
    return queryClient.setQueryData(
      ["admins"],
      (
        oldData:
          | { _id: string; name?: string; email?: string; role?: string }[]
          | undefined
      ) => {
        if (!oldData) return oldData;

        return oldData.map(
          (value: {
            _id: string;
            name?: string;
            email?: string;
            role?: string;
          }) => (value._id === data._id ? { ...value, ...data } : value)
        );
      }
    );
  };
};

export const useEditedAdmin = () => {
  const notify = notificationApi();
  const editedAdmin = useEditedCacheAdmin();
  return useMutation({
    mutationKey: ["edit admin"],
    mutationFn: (data: {
      _id: string;
      name?: string;
      email?: string;
      role?: string;
    }) => {
      editedAdmin(data);
      return request.post("/api/staff/edited-admin", data);
    },
    onSuccess: () => {
      notify("edit_admin");
    },
  });
};

export const useDeletedAdmin = () => {
  const queryClient = useQueryClient();
  const notify = notificationApi();

  return useMutation({
    mutationFn: (_id: string) =>
      request.delete(`/api/staff/deleted-admin`, { data: { _id } }),
    mutationKey: ["delete admin"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      notify("delete_admin");
    },
  });
};

export const useCreatedAdmin = () => {
  const queryClient = useQueryClient();
  const notify = notificationApi();

  return useMutation({
    mutationFn: (data: object) => request.post("api/staff/create-admin", data),
    mutationKey: ["create admin"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      notify("created_admin");
    },
  });
};

export const useEditProfile = () => {
  const notify = notificationApi();
  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (data: ProfileUpdatePayload) =>
      request.post("/api/auth/edit-profile", data, {}),
    onSuccess(data) {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        const user = JSON.parse(userCookie);
        const updatedUser = { ...user, ...data };
        Cookies.set("user", JSON.stringify(updatedUser));
      }
      notify("edit_profile");
    },
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const notify = notificationApi();
  return useMutation({
    mutationKey: ["upload-img"],

    mutationFn: (data: FormData) =>
      request.post("/api/auth/edit-profile-img", data),

    onSuccess(data) {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        const user = JSON.parse(userCookie);
        const updatedUser = { ...user, image: data?.data?.data?.image };
        Cookies.set("user", JSON.stringify(updatedUser));
      }
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      notify("upload_image");
    },
    onError(err) {
      console.error(err);
    },
  });
};
