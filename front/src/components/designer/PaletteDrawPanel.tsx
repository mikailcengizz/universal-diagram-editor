import React from "react";

const shapes = [
  {
    shape: "square",
    style: {
      backgroundColor: "#f9f9f9",
      borderColor: "#000",
      borderWidth: 1,
      borderStyle: "solid",
    },
  },
  {
    shape: "text",
    text: "Class name",
    style: { color: "#000", fontSize: 14, alignment: "center" },
  },
  {
    shape: "compartment",
    generator: "attributesForNotation",
    style: { color: "#000", fontSize: 14, alignment: "left" },
  },
  { shape: "connector", style: { color: "#000", alignment: "left" } },
];

function PaletteDrawPanel() {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    shape: any
  ) => {
    event.dataTransfer.setData("shape", JSON.stringify(shape));
  };

  return (
    <div className="bg-gray-200 p-4 w-48">
      <h3 className="text-lg font-semibold">Palette</h3>
      <div className="mt-4">
        {shapes.map((shape, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            className="p-2 mb-2 bg-white border border-gray-400 rounded cursor-move"
          >
            {shape.shape === "text" ? shape.text : shape.shape}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaletteDrawPanel;
