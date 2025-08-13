import React from "react";
import { authProvider } from "../context/MyProvider";

export default function PermissionChecker({ name, children }) {
  const { hasPermission } = authProvider();
  if (!hasPermission(name)) return null;
  return <>{children}</>;
}
