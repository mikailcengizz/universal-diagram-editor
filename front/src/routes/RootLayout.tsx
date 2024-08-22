import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen max-h-screen w-full overflow-y-scroll h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
