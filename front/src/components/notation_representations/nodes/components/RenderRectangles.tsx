import React from "react";
import { NotationRepresentationItem } from "../../../../types/types";

interface RenderRectanglesProps {
  rectangles: NotationRepresentationItem[];
  isPalette: boolean;
}

function RenderRectangles({ rectangles, isPalette }: RenderRectanglesProps) {
  return (
    <>
      {rectangles.map((rect, index) => {
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${rect.position.x}px`,
              top: `${rect.position.y}px`,
              width: `${
                isPalette ? (rect.position.extent?.width || 100) + "px" : "100%"
              }`,
              height: `${
                isPalette
                  ? (rect.position.extent?.height || 100) + "px"
                  : "100%"
              }`,
              backgroundColor: rect.style.backgroundColor,
              borderColor: rect.style.borderColor,
              borderWidth: rect.style.borderWidth,
              borderStyle: rect.style.borderStyle,
            }}
          />
        );
      })}
    </>
  );
}

export default RenderRectangles;