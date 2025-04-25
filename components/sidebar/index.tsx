"use client";
import { others_menu, sidebar_menu } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { notificationApi } from "@/generics/nitification";
const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const notify = notificationApi();
  return (
    <div className="w-[250px] h-screen p-4 border-r-1">
      <div className="text-center">
        <h2 className="font-bold">ADMIN CRM</h2>
      </div>
      <div>
        <h2 className="pt-5">Menu </h2>
        {sidebar_menu.map(({ Icon, title, id, path }) => (
          <Button
            onClick={() => router.push(path)}
            key={id}
            className={`flex items-center gap-4 mt-3 w-full justify-start cursor-pointer border-transparent shadow-none hover:border-accent ${
              pathname === path && "border-accent bg-accent"
            }`}
            variant="outline"
          >
            <Icon />
            <h2>{title}</h2>
          </Button>
        ))}
        <h2 className="pt-10">Boshqalar</h2>
        {others_menu.map(({ Icon, title, id, path }) => (
          <Button
            onClick={() => router.push(path)}
            key={id}
            className={`flex items-center gap-4 mt-3 w-full justify-start cursor-pointer border-transparent shadow-none hover:border-accent ${
              pathname === path && "border-accent bg-accent"
            }`}
            variant="outline"
          >
            <Icon />
            <h2>{title}</h2>
          </Button>
        ))}
        <div
          onClick={() => {
            Cookies.remove("token");
            Cookies.remove("user");
            notify("logout");
            router.push("/login");
          }}
          className="flex items-center gap-2 border border-red-500 rounded-md mt-6 p-2 cursor-pointer hover:bg-accent"
        >
          <LogOut className="text-red-500 ml-8" />
          <p className="text-sm text-red-500">Chiqish</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
