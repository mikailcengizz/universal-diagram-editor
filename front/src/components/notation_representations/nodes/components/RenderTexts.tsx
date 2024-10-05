import React from "react";
import {
  DiagramNodeData,
  InstanceModel,
  NotationRepresentationItem,
} from "../../../../types/types";
import dataTypeHelper from "../../../helpers/TypeHelper";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch();
  const instanceModel: InstanceModel = useSelector(
    (state: any) => state.instanceModelStore.model
  );

  return (
    <>
      {texts.map((textItem, idx) => {
        let text = "Class";
        if (!isPalette && !isNotationSlider && textItem.text === "name") {
          text = data.instanceObject!.name;
        }

        // we dont want editable field in palette notations
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
