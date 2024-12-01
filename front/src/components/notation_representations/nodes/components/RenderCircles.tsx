import React from "react";
import {
  DiagramNodeData,
  NotationRepresentationItem,
} from "../../../../types/types";

interface RenderCirclesProps {
  isPalette?: boolean;
  isNotationSlider?: boolean;
  circles: NotationRepresentationItem[];
  data?: DiagramNodeData;
}

function RenderCircles({
  isPalette = false,
  isNotationSlider = false,
  circles,
  data,
}: RenderCirclesProps) {
  return (
    <>
      {circles.map((circle, index) => {
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${circle.position.x}px`,
              top: `${circle.position.y}px`,
              width: `${circle.position.extent?.width || 100}px`,
              height: `${circle.position.extent?.height || 100}px`,
              backgroundColor: circle.style.backgroundColor,
              borderColor: circle.style.borderColor,
              borderWidth: `${circle.style.borderWidth}px`,
              borderStyle: circle.style.borderStyle,
              borderRadius: "50%", // ensure circle shape
              zIndex: circle.style.zIndex,
            }}
          >
            {/* Render the circle */}
          </div>
        );
      })}
    </>
  );
}

export default RenderCircles;
