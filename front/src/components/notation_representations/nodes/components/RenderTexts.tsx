import React from "react";
import {
  DiagramNodeData,
  NotationRepresentationItem,
} from "../../../../types/types";

interface RenderTextsProps {
  nodeId: string;
  data: DiagramNodeData;
  texts: NotationRepresentationItem[];
  handleTextChange: (e: any, nameFromClassifier: string | undefined) => void;
  isPalette?: boolean;
  isNotationSlider?: boolean;
}

function RenderTexts({
  nodeId,
  data,
  texts,
  handleTextChange,
  isPalette = false,
  isNotationSlider = false,
}: RenderTextsProps) {
  return (
    <>
      {texts.map((textItem, idx) => {
        let text =
          typeof textItem.text === "object" && !isPalette
            ? data.instanceObject?.attributes[
                +textItem.text.$ref.split("attributes/")[1]!
              ]!.value
            : typeof textItem.text === "object" && isPalette
            ? "Text"
            : textItem.text;

        // no editable field in palette notations
        if (isPalette || isNotationSlider) {
          return (
            <span
              key={idx}
              style={{
                position: "absolute",
                left: `${textItem.position.x}px`,
                top: `${textItem.position.y}px`,
                width: `${textItem.position.extent?.width || 100}px`,
                height: `${textItem.position.extent?.height || 20}px`,
                color: textItem.style.color,
                fontSize: `${textItem.style.fontSize}px`,
                textAlign: textItem.style.alignment as
                  | "left"
                  | "center"
                  | "right",
                zIndex: textItem.style.zIndex,
              }}
            >
              {text}
            </span>
          );
        } else {
          return (
            <input
              key={idx}
              type={"text"}
              style={{
                position: "absolute",
                left: `${textItem.position.x}px`,
                top: `${textItem.position.y}px`,
                width: `${textItem.position.extent?.width || 100}px`,
                height: `${textItem.position.extent?.height || 20}px`,
                color: textItem.style.color,
                backgroundColor: "transparent",
                fontSize: `${textItem.style.fontSize}px`,
                textAlign: textItem.style.alignment as
                  | "left"
                  | "center"
                  | "right",
                borderColor: textItem.style.borderColor,
                borderWidth: textItem.style.borderWidth,
                borderStyle: textItem.style.borderStyle,
                zIndex: textItem.style.zIndex,
              }}
              value={text}
              onChange={(e) => handleTextChange(e, text)}
            />
          );
        }
      })}
    </>
  );
}

export default RenderTexts;
