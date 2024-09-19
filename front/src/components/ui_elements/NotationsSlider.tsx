import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { EPackage, Notation } from "../../types/types";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesNode from "../notation_representations/edges/CombineRelationshipShapesEdge";
import CombineRoleShapesNode from "../notation_representations/nodes/CombineRoleShapesNode";
import { Position } from "@xyflow/react";

interface NotationsSliderProps {
  settings: {};
  ePackages: EPackage[];
  allNotations: Notation[];
  setCurrentNotation: (value: Notation) => void;
}

function NotationsSlider({
  settings,
  ePackages,
  allNotations,
  setCurrentNotation,
}: NotationsSliderProps) {
  const updatedSettings = {
    ...settings,
    infinite: allNotations.length > 5, // Disable infinite scroll when there's only 5 slides
  };

  const renderNodePreview = (notation: Notation) => {
    const notationType = notation.type;

    switch (notationType) {
      case "EClass":
        return (
          <CombineObjectShapesNode
            key={notation.name}
            id={notation.name}
            isPalette={true}
            isNotationSlider={true}
            data={{ ePackages: ePackages, nodeNotation: notation }}
          />
        );
      case "EReference":
        const { x, y, targetX, targetY } =
          notation.graphicalRepresentation![0].position;
        return (
          <CombineRelationshipShapesNode
            key={notation.name}
            id={notation.name}
            isPalette={true}
            isNotationSlider={true}
            data={{ ePackages: ePackages, nodeNotation: notation }}
            sourceX={x}
            sourceY={y}
            targetX={targetX!}
            targetY={targetY!}
            sourcePosition={Position.Right}
            targetPosition={Position.Left}
          />
        );
      /* case "role":
        return <CombineRoleShapesNode />; */
    }
  };

  return (
    <Slider {...updatedSettings} className="mt-2">
      {allNotations && allNotations.length > 0 ? (
        allNotations.map((notation, index) => (
          <div
            key={index}
            className="border-[1px] border-black text-center h-28 p-2 cursor-pointer content-center"
            onClick={() => setCurrentNotation(notation)}
          >
            {notation.graphicalRepresentation!.length > 0 ? (
              renderNodePreview(notation)
            ) : (
              <span>{notation.name}</span>
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
