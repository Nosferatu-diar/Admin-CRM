"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { UserType } from "@/@types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Edit, MailIcon, UserIcon } from "lucide-react";
import { useEditProfile, useUploadImage } from "@/request/mutation";

const Profile = () => {
  const [edit, setEdit] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "" as string,
    first_name: "" as string,
    last_name: "" as string,
    image: "" as string | File,
  });

  const { mutate: editProfile, isPending } = useEditProfile();
  const { mutate: uploadImage } = useUploadImage();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setImagePreview(parsedUser.image);
        setForm({
          email: parsedUser.email || ("" as string),
          first_name: parsedUser.first_name || ("" as string),
          last_name: parsedUser.last_name || ("" as string),
          image: parsedUser.image || ("" as string | File),
        });
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSave = () => {
    let updatedImage = form.image;

    const updateProfileData = () => {
      const payload = {
        email: form.email as string,
        first_name: form.first_name as string,
        last_name: form.last_name as string,
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
          setUser(updatedUser);
          Cookies.set("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          setEdit(true);

          window.dispatchEvent(new Event("user-updated")); /// extra
        },
      });
    };

    if (form.image instanceof File) {
      const formData = new FormData();
      formData.append("image", form.image);

      uploadImage(formData, {
        onSuccess: (data: { data: { data: { image: string } } }) => {
          updatedImage = data.data.data.image;
          updateProfileData();
        },
      });
    } else {
      updateProfileData();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Edit Your Profile
      </h2>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <MailIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <Input
            type="email"
            placeholder="johndoe@gmail.com"
            disabled={edit}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <UserIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <Input
            type="text"
            placeholder="First Name"
            disabled={edit}
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <UserIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <Input
            type="text"
            placeholder="Last Name"
            disabled={edit}
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileImage">Upload Profile Image</Label>
          <Input
            id="profileImage"
            type="file"
            disabled={edit}
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <div className="flex justify-center pt-5">
            <div className="w-40 h-40 rounded-full overflow-hidden">
              <Image
                src={imagePreview}
                alt="Profile Image Preview"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}

        {!edit && (
          <div className="flex justify-center pt-5">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="bg-black text-white px-6 py-2"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </form>

      <div className="flex justify-center pt-4">
        <Button
          type="button"
          onClick={() => setEdit(!edit)}
          variant={edit ? "outline" : "default"}
        >
          {edit ? "Edit" : "Cancel"} <Edit className="ml-2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Profile;
