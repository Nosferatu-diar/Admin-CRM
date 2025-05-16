"use client";

import {
  Bell,
  MessageCircleMoreIcon,
  Sidebar,
  VoicemailIcon,
} from "lucide-react";
import React from "react";
import BrandCrumpComponent from "../breadcrumb";
import { ModeToggle } from "../ui/ThemesBtn";
import Image from "next/image";
import { UserType } from "@/@types";
import Cookies from "js-cookie";
import Link from "next/link";

const Header = () => {
  const [user, setUser] = React.useState<UserType | null>(null);

  React.useEffect(() => {
    const updateUserFromCookie = () => {
      const cookieUser = Cookies.get("user");
      if (cookieUser) {
        try {
          setUser(JSON.parse(cookieUser));
        } catch (error) {
          console.error("Cookie parsing error:", error);
        }
      }
    };

    updateUserFromCookie();

    window.addEventListener("user-updated", updateUserFromCookie);
    return () =>
      window.removeEventListener("user-updated", updateUserFromCookie);
  }, []);

  return (
    <header className="flex items-center justify-between border-b w-full h-[50px] px-5">
      <nav className="flex items-center gap-3">
        <Sidebar size={"18px"} />
        <BrandCrumpComponent />
      </nav>
      <nav className="flex items-center gap-4">
        <Bell className="cursor-pointer" />
        <MessageCircleMoreIcon className="cursor-pointer" />
        <VoicemailIcon className="cursor-pointer" />
        <ModeToggle />
        <div className="flex ml-3 items-center gap-2">
          <div className="text-[14px]">
            <div>
              {user?.first_name} {user?.last_name}
            </div>
            <div className="capitalize text-end flex items-center gap-1 justify-end">
              <div
                className={`${
                  user?.active ? "bg-[green]" : "bg-[red]"
                } w-[10px] h-[10px] rounded-full`}
              ></div>
              {user?.role}
            </div>
          </div>
          <div className="w-[40px] h-[40px] bg-black dark:bg-white rounded-full relative flex items-center justify-center font-bold text-white dark:text-black">
            <Link href={"/profile"}>
              <div className="w-[40px] h-[40px] bg-black dark:bg-white rounded-full relative flex items-center justify-center font-bold text-white dark:text-black">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.first_name || "user avatar"}
                    fill
                    sizes="40px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  user?.first_name?.slice(0, 1)
                )}
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
