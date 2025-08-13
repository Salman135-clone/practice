import React from "react";
import { auth } from "../constant/Firebase";
import { toast } from "react-toastify";
import { authProvider } from "../context/MyProvider";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
const Logout = () => {
  const { logout } = authProvider();
  const navigate = useNavigate();
  const handleSignout = async () => {
    try {
      await logout(auth);
      toast.success("Logout Successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <button
        onClick={handleSignout}
        className="cursor-pointer bg-cyan-800 text-white rounded px-2 py-1"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
