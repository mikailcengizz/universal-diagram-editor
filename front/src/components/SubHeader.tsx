import React, { useEffect, useState } from "react";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import axios from "axios";

function SubHeader({ onSelectConfig }: any) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [configs, setConfigs] = useState<any>([]);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/config/list", {
          headers: {
            Authorization: "Basic " + btoa("test@hotmail.com:test123"),
          },
        });
        setConfigs(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigs();
  }, []);

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
          <div className="absolute mt-24 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
            <div className="py-2">
              {configs.map((config: any, index: any) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSelectConfig(config.filename);
                    setDropdownVisible(false);
                  }}
                >
                  {config.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default SubHeader;
