import {
  DiagramNodeData,
  NotationRepresentationItem,
} from "../../../../types/types";

interface RenderRectanglesProps {
  isPalette?: boolean;
  isNotationSlider?: boolean;
  circles: NotationRepresentationItem[];
  data: DiagramNodeData;
}

function RenderCircles({
  isPalette = false,
  isNotationSlider = false,
  circles,
  data,
}: RenderRectanglesProps) {
  return (
    <>
      {circles.map((rect, index) => {
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
              borderRadius: rect.style.borderRadius + "px",
            }}
          />
        );
      })}
    </>
  );
}

export default RenderCircles;
