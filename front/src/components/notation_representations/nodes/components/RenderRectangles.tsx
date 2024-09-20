import {
  CustomNodeData,
  NotationRepresentationItem,
} from "../../../../types/types";

interface RenderRectanglesProps {
  rectangles: NotationRepresentationItem[];
  data: CustomNodeData;
}

function RenderRectangles({ rectangles, data }: RenderRectanglesProps) {
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
                data.isPalette
                  ? (rect.position.extent?.width || 100) + "px"
                  : "100%"
              }`,
              height: `${
                data.isPalette
                  ? (rect.position.extent?.height || 100) + "px"
                  : "100%"
              }`,
              backgroundColor: rect.style.backgroundColor,
              borderColor: rect.style.borderColor,
              borderWidth: rect.style.borderWidth,
              borderStyle: rect.style.borderStyle,
              borderRadius: rect.style.borderRadius + "px",
            }}
          />
        );
      })}
    </>
  );
}

export default RenderRectangles;
