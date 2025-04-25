"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { UserType } from "@/@types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
// import userDefaultImg from "@/public/user.svg"; // fallback image
import { Edit, EyeIcon, MailIcon, UserIcon } from "lucide-react";

const Profile = () => {
  const [edit, setEdit] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setImagePreview(parsedUser.image);
      } catch (err) {
        console.error("Error parsing cookie", err);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Edit Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            defaultValue={user?.email}
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
            placeholder="Password"
            disabled={edit}
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
            defaultValue={user?.first_name}
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
            defaultValue={user?.last_name}
            className="pl-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileImage">Upload Profile</Label>
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

        <div className="flex justify-center pt-5">
          <Button
            type="submit"
            disabled={edit}
            className="bg-black text-white px-6 py-2"
          >
            Update Profile
          </Button>
        </div>
      </form>

      <div className="flex justify-center pt-4">
        <Button type="button" onClick={() => setEdit(!edit)} variant="outline">
          {edit ? "Edit" : "Cancel"} <Edit className="ml-2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Profile;
 