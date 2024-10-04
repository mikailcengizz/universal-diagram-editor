import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Class, MetaModel, Notation } from "../../types/types";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesNode from "../notation_representations/edges/CombineRelationshipShapesEdge";
import CombineRoleShapesNode from "../notation_representations/nodes/CombineRoleShapesNode";
import { Position } from "@xyflow/react";

interface NotationsSliderProps {
  settings: {};
  selectedNotation: Notation;
  setCurrentNotationElement: (value: Class) => void;
}

function NotationsSlider({
  settings,
  selectedNotation,
  setCurrentNotationElement,
}: NotationsSliderProps) {
  const updatedSettings = {
    ...settings,
    infinite: selectedNotation.metaModel!.package.elements.length > 5, // Disable infinite scroll when there's only 5 slides
  };
  const allNotationElements = selectedNotation.metaModel?.package.elements;

  const renderNodePreview = (element: Class) => {
    const elementType = element.name;

    switch (elementType) {
      case "Reference":
        const { x, y, targetX, targetY } =
          element.representation?.graphicalRepresentation![0].position!;
        return (
          <CombineRelationshipShapesNode
            key={element.name}
            id={element.name!}
            data={{
              notation: selectedNotation,
              instance: undefined, // not necessary for nodes inside the slider
              position: undefined, // not necessary for nodes inside the slider
            }}
            sourceX={x}
            sourceY={y}
            targetX={targetX!}
            targetY={targetY!}
            sourcePosition={Position.Right}
            targetPosition={Position.Left}
          />
        );
      default:
        return (
          <CombineObjectShapesNode
            key={element.name}
            id={element.name!}
            data={{
              notation: selectedNotation,
              instance: undefined, // not necessary for nodes inside the slider
              position: undefined, // not necessary for nodes inside the slider
            }}
          />
        );
      /* case "role":
        return <CombineRoleShapesNode />; */
    }
  };

  return (
    <Slider {...updatedSettings} className="mt-2">
      {allNotationElements && allNotationElements.length > 0 ? (
        (allNotationElements as Class[]).map((notationElement, index) => (
          <div
            key={index}
            className="border-[1px] border-black text-center h-28 p-2 cursor-pointer content-center"
            onClick={() => setCurrentNotationElement(notationElement)}
          >
            {notationElement.representation &&
            notationElement.representation!.graphicalRepresentation!.length >
              0 ? (
              renderNodePreview(notationElement)
            ) : (
              <span>{notationElement.name}</span>
            )}
          </div>
        ))
      ) : (
        <div>No Notations Available</div>
      )}
    </Slider>
  );
}

export default NotationsSlider;
