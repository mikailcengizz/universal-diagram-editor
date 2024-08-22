import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
  return (
    <div className="flex bg-[#1B1B20]">
      <Sidebar />
      <div className="min-h-screen max-h-screen w-full overflow-y-scroll no-scrollbar h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
