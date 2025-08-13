import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authProvider } from "../context/MyProvider";
import DashboardNav from "../components/DashboardNav";
import SideNav from "../components/SideNav";
import WebLoader from "../components/WebLoader";

const ProtectedLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading } = authProvider();
  if (!user && !loading) return <Navigate to="/login" />;

  return (
    <>
      {loading ? (
        <WebLoader />
      ) : (
        <div className="top-nav h-screen flex flex-col">
          <div className="fixed top-0 w-full left-0 z-50 ">
            <DashboardNav
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              sidebarOpen={sidebarOpen}
            />
          </div>

          <div className=" flex flex-1 pt-[70px]">
            <div
              id="sideNav"
              className={`transition-all duration-300 ${
                sidebarOpen ? "w-60  " : "w-0"
              } overflow-hidden fixed h-full top-[70px] left-0 z-40`}
            >
              {sidebarOpen && <SideNav />}
            </div>

            <main
              className={`transition-all duration-300 flex-1 ${
                sidebarOpen ? "ml-60" : "ml-0"
              } overflow-y-auto p-4 bg-gray-50`}
              // style={{ marginLeft: sidebarOpen ? "15rem" : "0" }}
            >
              {children || <Outlet />}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedLayout;
