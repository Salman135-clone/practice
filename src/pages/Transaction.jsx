import React from "react";
import AdminTransaction from "../components/AdminTransaction";
import { authProvider } from "../context/MyProvider";
import UserTransaction from "../components/UserTransaction";

const Transaction = () => {
  const { roleName } = authProvider();
  return (
    <>
      <AdminTransaction />
    </>
  );
};

export default Transaction;
