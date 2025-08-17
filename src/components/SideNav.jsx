import React from "react";
import { CiUser } from "react-icons/ci";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PostAddIcon from "@mui/icons-material/PostAdd";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PermissionChecker from "./PermissionChecker";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import Transaction from "../pages/Transaction";

const SideNav = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-gray-800 w-[240px] h-full text-white pt-5">
        {/* <span className="text-2xl py-2 px-2.5">Role</span> */}
        <nav className="">
          <div className="px-1">
            <ul className="space-y-4">
              <li className="">
                <a
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 py-2 px-2.5 hover:bg-gray-600 rounded-sm cursor-pointer"
                >
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <PermissionChecker>
                <li>
                  <a
                    onClick={() => navigate("/post")}
                    className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                  >
                    <PostAddIcon />
                    Add Post
                  </a>
                </li>
              </PermissionChecker>
              <PermissionChecker name="user-list-manage">
                <li>
                  <a
                    onClick={() => navigate("/user")}
                    className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                  >
                    <CiUser size={19} />
                    User
                  </a>
                </li>
              </PermissionChecker>
              <PermissionChecker name="manage-transaction">
                <li>
                  <a
                    onClick={() => navigate("/transaction")}
                    className="flex items-center gap-2 py-2 px-2.5 cursor-pointer hover:bg-gray-600 rounded-sm"
                  >
                    <BanknotesIcon className="size-5" />
                    Transaction
                  </a>
                </li>
              </PermissionChecker>
              <PermissionChecker name="manage-permission">
                <li>
                  <a
                    onClick={() => navigate("/permission")}
                    className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                  >
                    <ManageAccountsIcon />
                    Permission
                  </a>
                </li>
              </PermissionChecker>
              <PermissionChecker name="manage-role">
                <li>
                  <a
                    onClick={() => navigate("/role")}
                    className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                  >
                    <SupervisorAccountIcon />
                    Role
                  </a>
                </li>
              </PermissionChecker>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideNav;
