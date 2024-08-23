import React, { useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";

const itemCSS =
  "mx-auto my-2 hover:bg-[#494950] rounded-md p-2 cursor-pointer hover:scale-125 transform transition duration-200 ease-in-out";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <div
        className={`flex flex-col bg-[#1B1B20] align-middle items-center min-h-screen ${
          isCollapsed ? "w-0 overflow-hidden" : "w-[60px]"
        } justify-between text-white px-1 py-1 relative transition-all duration-300`}
      >
        {!isCollapsed && (
          <div className="flex flex-col w-full">
            <div className={itemCSS}>
              <a href="/" className="font-bold">
                <HomeOutlinedIcon />
              </a>
            </div>

            <div className={itemCSS}>
              <a href="/editor">
                <SchemaOutlinedIcon />
              </a>
            </div>

            <div className={itemCSS}>
              <a href="/designer">
                <ModeEditOutlineOutlinedIcon />
              </a>
            </div>

            <div className={itemCSS}>
              <a href="/teams">
                <PeopleAltOutlinedIcon />
              </a>
            </div>
          </div>
        )}

        <div
          className={`absolute right-[-5px] top-1/2 origin-center cursor-pointer transition-transform duration-300 ${
            isCollapsed ? "-rotate-180" : "rotate-0"
          }`}
          onClick={handleToggle}
        >
          <NavigateBeforeOutlinedIcon />
        </div>

        {!isCollapsed && (
          <div className="flex flex-col justify-end">
            <div className={itemCSS}>
              <a href="/notifications">
                <NotificationsNoneOutlinedIcon />
              </a>
            </div>
            <div className={itemCSS}>
              <a href="/payments">
                <PaymentOutlinedIcon />
              </a>
            </div>
            <div className={itemCSS}>
              <a href="/settings">
                <SettingsOutlinedIcon />
              </a>
            </div>
            <div className={itemCSS}>
              <a href="/profile">
                <AccountCircleOutlinedIcon />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
