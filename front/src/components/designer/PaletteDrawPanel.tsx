import React from "react";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import TitleIcon from "@mui/icons-material/Title";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import CircleIcon from "@mui/icons-material/Circle";

const shapes = [
  {
    shape: "square",
    icon: <CropSquareIcon />,
    style: {
      backgroundColor: "#f9f9f9",
      borderColor: "#000",
      borderWidth: 1,
      borderStyle: "solid",
      zIndex: 1,
    },
  },
  {
    shape: "text",
    icon: <TitleIcon />,
    text: "Class name",
    style: {
      color: "#000",
      fontSize: 14,
      alignment: "center",
      zIndex: 3,
      borderWidth: 0,
    },
    position: { extent: { width: 100, height: 30 } },
  },
  {
    shape: "connector",
    icon: <CircleIcon />,
    style: {
      color: "#000",
      alignment: "left",
      fontSize: 6,
      borderRadius: 50,
      zIndex: 2,
    },
    position: { extent: { width: 10, height: 10 } },
  },
  {
    shape: "compartment",
    icon: <SmartButtonIcon />,
    generator: "attributesForNotation",
    style: {
      color: "#000000",
      fontSize: 14,
      alignment: "left",
      borderColor: "#00b3ff",
      borderWidth: 1,
      zIndex: 2,
    },
  },
];

function PaletteDrawPanel() {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    shape: any
  ) => {
    event.dataTransfer.setData("shape", JSON.stringify(shape));
    console.log("drag start", shape);
  };

  return (
    <div className="px-8 w-full h-16 flex flex-row items-center align-middle my-auto border-y-[1px] border-gray-200">
      <div className="flex flex-row items-center align-middle my-auto gap-x-1">
        {shapes.map((shape, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            className="p-2 bg-white border border-gray-400 rounded cursor-move align-middle justify-center items-center flex"
          >
            {shape.icon}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaletteDrawPanel;
