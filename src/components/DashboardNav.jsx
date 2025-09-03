import React, { useState } from "react";
import Logout from "../Auth/Logout";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../context/MyProvider";
import PermissionChecker from "./PermissionChecker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";

const DashboardNav = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { roleName, userInfo } = authProvider();
  // console.log(userInfo);

  return (
    <div className="h-[70px] px-4 flex text-center items-center justify-between bg-gray-800 text-white ">
      <span className="flex flex-row items-center gap-2 font-semibold text-2xl ">
        <button
          onClick={toggleSidebar}
          className="focus:outline-none cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <span className="tracking-wider text-white font-medium">
          {roleName}
        </span>
      </span>
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className=" flex items-center gap-2 rounded-md px-3 py-1 cursor-pointer hover:bg-gray-700">
              <Avatar>
                <AvatarImage src={userInfo?.image} alt={userInfo?.username} />
                <AvatarFallback className="bg-green-800">
                  {userInfo?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-medium">
                  {userInfo?.username.charAt(0)?.toUpperCase() +
                    userInfo?.username.slice(1)}
                </span>
                <span className="text-sm text-gray-300">{userInfo?.email}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <PermissionChecker name="can-logout">
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 font-medium">
                <LogOut className="mr-2 h-4 w-4" />
                <Logout />
              </DropdownMenuItem>
            </PermissionChecker>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardNav;
