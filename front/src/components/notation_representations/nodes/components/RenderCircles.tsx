import React from "react";
import {
  DiagramNodeData,
  NotationRepresentationItem,
} from "../../../../types/types";

// Utility function to calculate positions on a circle based on user-defined positions
const getCircleEdgePosition = (radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: radius * Math.cos(angleInRadians),
    y: radius * Math.sin(angleInRadians),
  };
};

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
        const radius = (circle.position.extent?.width || 100) / 2;
        const centerX = circle.position.x + radius;
        const centerY = circle.position.y + radius;

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
              borderRadius: "50%", // Ensure circle shape
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
