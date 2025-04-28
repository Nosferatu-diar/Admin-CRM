"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { UserType } from "@/@types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Edit, EyeIcon, MailIcon, UserIcon } from "lucide-react";
import { useEiditProfile } from "@/request/mutation"; // senga tashlangan mutation

const Profile = () => {
  const [edit, setEdit] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<{
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    image: string | File;
  }>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    image: "",
  });

  const { mutate, isPending } = useEiditProfile();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setImagePreview(parsedUser.image);
        setForm({
          email: parsedUser.email || "",
          password: "",
          first_name: parsedUser.first_name || "",
          last_name: parsedUser.last_name || "",
          image: parsedUser.image || "",
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
    mutate(form, {
      onSuccess: () => {
        setEdit(true);
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Edit Your Profile
      </h2>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Email */}
        <div className="relative">
          <MailIcon
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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

        {/* Password */}
        <div className="relative">
          <EyeIcon
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <Input
            type="password"
            placeholder="New Password"
            disabled={edit}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* First Name */}
        <div className="relative">
          <UserIcon
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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

        {/* Last Name */}
        <div className="relative">
          <UserIcon
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
                alt="Profile Preview"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Agar edit rejimda bo'lmasa Save ko'rsat */}
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

      {/* Edit / Cancel Button */}
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
