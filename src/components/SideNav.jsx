import React, { useState } from "react";

import { MdManageAccounts } from "react-icons/md";

import { useNavigate } from "react-router-dom";

import PermissionChecker from "./PermissionChecker";
import { GrTransaction } from "react-icons/gr";

//
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const SideNav = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
                  <MdDashboard size={20} />
                  Dashboard
                </a>
              </li>
              <PermissionChecker name="add-new-post">
                <li>
                  <a
                    onClick={() => navigate("/post")}
                    className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                  >
                    <MdPostAdd size={20} />
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
                    <FaUsers size={20} />
                    User
                  </a>
                </li>
              </PermissionChecker>
              <PermissionChecker name="manage-borrower">
                <li>
                  <a
                    onClick={() => navigate("/borrower")}
                    className="flex items-center gap-2 py-2 px-2.5 cursor-pointer hover:bg-gray-600 rounded-sm"
                  >
                    <RiMoneyDollarCircleLine size={20} />
                    Borrower
                  </a>
                </li>
              </PermissionChecker>
              <PermissionChecker name="manage-transaction">
                <li>
                  <a
                    onClick={() => navigate("/transaction")}
                    className="flex items-center gap-2 py-2 px-2.5 cursor-pointer hover:bg-gray-600 rounded-sm"
                  >
                    <GrTransaction size={20} />
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
                    <MdManageAccounts size={20} /> Permission
                  </a>
                </li>
              </PermissionChecker>
              <PermissionChecker name="manage-role">
                <li>
                  <a
                    onClick={() => navigate("/role")}
                    className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                  >
                    <FaUserFriends size={20} />
                    Role
                  </a>
                </li>
              </PermissionChecker>

              <PermissionChecker name="wallet">
                <li>
                  <a
                    onClick={() => navigate("/wallet")}
                    className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                  >
                    <FaWallet size={20} />
                    Wallet
                  </a>
                </li>
              </PermissionChecker>

              <li>
                <a
                  onClick={() => navigate("/repayment")}
                  className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                >
                  <FaHandHoldingUsd size={20} />
                  Repayment
                </a>
              </li>
              {/* <li>
                <a
                  onClick={() => navigate("report")}
                  className="flex items-center gap-2 py-2 px-2.5  hover:bg-gray-600 rounded-sm cursor-pointer"
                >
                  <HiOutlineDocumentReport size={20} />
                  Report
                </a>
              </li> */}

              {/* <li>
                <button
                  onClick={() => setOpen(!open)}
                  className="group flex w-full flex-row items-center gap-2 py-2 px-2.5 hover:bg-gray-600 rounded-sm cursor-pointer"
                >
                  <FaUserShield size={20} />
                  <span className="flex-1 text-left"> Roles & Access</span>
                  <IoChevronUpOutline
                    size={20}
                    className={`opacity-0 group-hover:opacity-100  ${
                      open && "rotate-180"
                    }`}
                  />
                </button>
                {open && (
                  <ul className="mt-1 space-y-1 border-l border-gray-600 ml-5">
                    <li>
                      <a className="flex items-center gap-2 py-2 px-2.5 ml-0.5  hover:bg-gray-600 rounded-sm cursor-pointer pl-4">
                        Role
                      </a>
                    </li>
                    <li>
                      <a className="flex items-center gap-2 py-2 px-2.5 ml-0.5  hover:bg-gray-600 rounded-sm cursor-pointer pl-4">
                        Permission
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideNav;
