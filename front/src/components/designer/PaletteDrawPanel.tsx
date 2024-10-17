import React from "react";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import TitleIcon from "@mui/icons-material/Title";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import zIndex from "@mui/material/styles/zIndex";
import { Class, MetaModel, Representation } from "../../types/types";

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
    shape: "circle",
    icon: <CircleOutlinedIcon />,
    style: {
      backgroundColor: "#f9f9f9",
      borderColor: "#000",
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: "50%",
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
      borderColor: "#000",
      borderWidth: 1,
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
  {
    shape: "line",
    icon: <HorizontalRuleIcon />,
    style: {
      backgroundColor: "#000000",
      borderWidth: 0,
      zIndex: 2,
    },
    position: { extent: { width: 50, height: 2 } },
  },
];

interface PaletteDrawPanelProps {
  selectedMetaModel: MetaModel;
  currentNotationElement: Class;
  currentNotationElementRepresentation: Representation;
  saveNotation: (selectedElementIndex: number) => void;
}

function PaletteDrawPanel({
  selectedMetaModel,
  currentNotationElement,
  currentNotationElementRepresentation,
  saveNotation,
}: PaletteDrawPanelProps) {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    shape: any
  ) => {
    event.dataTransfer.setData("shape", JSON.stringify(shape));
  };

  return (
    <div className="px-12 w-[82%] h-16 flex flex-row items-center align-middle my-auto">
      <div className="flex flex-row items-center align-middle my-auto justify-between w-full">
        {/* Chooseable shapes */}
        {currentNotationElementRepresentation.type === "ClassNode" && (
          <div className="flex flex-row items-center align-middle my-auto gap-x-1">
            {shapes.map((shape, index) => (
              <div
                key={index}
                title={shape.shape}
                draggable
                onDragStart={(e) => handleDragStart(e, shape)}
                className="p-2 bg-white border border-gray-400 rounded cursor-move align-middle justify-center items-center flex"
              >
                {shape.icon}
              </div>
            ))}
          </div>
        )}

        {/* Currently drawing - center title */}
        <div>
          <h3>Currently drawing: {currentNotationElement.name}</h3>
        </div>

        {/* Save notation button */}
        <div
          className="bg-[#1B1B20] px-4 py-2 w-fit rounded-md text-white cursor-pointer float-right hover:opacity-85 trransition duration-300 ease-in-out"
          onClick={() =>
            saveNotation(
              selectedMetaModel.package.elements.findIndex(
                (element) => element === currentNotationElement
              )
            )
          }
        >
          <span className="text-sm">Save notation</span>
        </div>
      </div>
    </div>
  );
}

export default PaletteDrawPanel;
