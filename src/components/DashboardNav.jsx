import React, { useState } from "react";
import Logout from "../Auth/Logout";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../context/MyProvider";
import PermissionChecker from "./PermissionChecker";

const DashboardNav = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { roleName } = authProvider();

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
        <span className="font-light text-white">{roleName}</span>
      </span>
      <PermissionChecker name="can-logout">
        <Logout />
      </PermissionChecker>
    </div>
  );
};

export default DashboardNav;
