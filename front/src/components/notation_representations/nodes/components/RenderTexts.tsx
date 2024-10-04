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
    (state: any) => state.metaInstanceModelStore.model
  );

  return (
    <>
      {texts.map((textItem, idx) => {
        // If the text is "name", we need to render the name of the node
        let nameFromClassifier: string | undefined;
        if (
          textItem.text === "name" &&
          instanceModel.package?.objects.length > 0
        ) {
          nameFromClassifier = instanceModel.package.objects.find(
            (obj) => obj.name === data.instanceObject?.name
          )?.name;
        }

        if (nameFromClassifier === undefined) {
          nameFromClassifier = data.instanceObject!.name;
        }

        // we dont want editable field in palette notations
        if (isPalette) {
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
              {nameFromClassifier}
            </span>
          );
        } else if (nameFromClassifier !== undefined) {
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
              value={nameFromClassifier}
              onChange={(e) => handleTextChange(e, nameFromClassifier)}
            />
          );
        }
      })}
    </>
  );
}

export default RenderTexts;
