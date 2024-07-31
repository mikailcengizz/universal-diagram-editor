import React, { useState } from "react";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

function SubHeader() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header>
      <div className="flex w-full bg-white align-middle px-12 items-center h-10 justify-between border-b-2">
        <div
          className="flex w-[10%] hover:cursor-pointer"
          onClick={toggleDropdown}
        >
          <span>Diagram type</span>
          <ArrowDropDownOutlinedIcon />
        </div>
        {dropdownVisible && (
          <div className="absolute mt-44 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
            <div className="py-2">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                BPMN
              </div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                UML
              </div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Sequence Diagram
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default SubHeader;
