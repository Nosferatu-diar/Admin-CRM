"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { UserType } from "@/@types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { MailIcon, UserIcon } from "lucide-react";
import {
  useEditProfile,
  useUploadImage,
  useChangePassword,
} from "@/request/mutation";

const ProfileComponent = () => {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    image: "" as string | File,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
  });

  const { mutate: editProfile, isPending } = useEditProfile();
  const { mutate: uploadImage } = useUploadImage();
  const { mutate: changePassword, isPending: isPasswordPending } =
    useChangePassword();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setForm({
          email: parsedUser.email,
          first_name: parsedUser.first_name,
          last_name: parsedUser.last_name,
          image: parsedUser.image,
        });
      } catch (err) {
        console.error("Cookie parsing error", err);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSave = () => {
    let updatedImage = form.image;

    const updateProfileData = () => {
      const payload = {
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
      };

      editProfile(payload, {
        onSuccess: () => {
          const updatedUser: UserType = {
            ...(user as UserType),
            ...payload,
            image:
              updatedImage instanceof File
                ? user?.image || ""
                : updatedImage || "",
            _id: user?._id ?? "",
          };
          Cookies.set("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          setEdit(false);
          window.dispatchEvent(new Event("user-updated"));
        },
      });
    };

    if (form.image instanceof File) {
      const formData = new FormData();
      formData.append("image", form.image);

      uploadImage(formData, {
        onSuccess: (res: { data: { data: { image: string } } }) => {
          updatedImage = res.data.data.image;
          setForm((prev) => ({ ...prev, image: updatedImage }));
          updateProfileData();
        },
      });
    } else {
      updateProfileData();
    }
  };

  const handlePasswordChange = () => {
    changePassword(passwordForm, {
      onSuccess: () => {
        alert("Parol yangilandi");
        setPasswordForm({ current_password: "", new_password: "" });
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 mx-auto p-5">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Profilni Tahrirlash
      </h2>

      <form
        className=" gap-10 grid grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* First */}
        <div className="flex flex-col w-full mx-auto gap-4">
          <div className="flex flex-col items-center gap-5">
            <div className="w-[200px] h-[200px] bg-black dark:bg-white rounded-full relative flex items-center justify-center font-bold text-white dark:text-black">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.first_name || "user avatar"}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                user?.first_name?.slice(0, 1)
              )}
            </div>
            <Input
              id="image"
              type="file"
              onChange={handleImageChange}
              disabled={edit}
            />
          </div>

          <div className="relative">
            <MailIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <Input
              type="email"
              placeholder="Email"
              disabled={edit}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <UserIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <Input
              type="text"
              placeholder="Ism"
              disabled={edit}
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <UserIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <Input
              type="text"
              placeholder="Familiya"
              disabled={edit}
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="w-full cursor-pointer bg-blue-600 text-white "
          >
            {isPending ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>

        {/* Second */}
        <div className="flex flex-col gap-4">
          <h3 className="text-md font-semibold pt-6">Parolni Yangilash</h3>

          <Input
            type="password"
            placeholder="Joriy parol"
            value={passwordForm.current_password}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                current_password: e.target.value,
              })
            }
          />
          <Input
            type="password"
            placeholder="Yangi parol"
            value={passwordForm.new_password}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                new_password: e.target.value,
              })
            }
          />
          <Button
            type="button"
            onClick={handlePasswordChange}
            disabled={isPasswordPending}
            className="w-full bg-blue-600 text-white"
          >
            {isPasswordPending ? "Yuklanmoqda..." : "Parolni Yangilash"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileComponent;
