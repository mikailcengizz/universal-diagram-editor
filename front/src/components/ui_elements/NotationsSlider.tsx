import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Notation } from "../../types/types";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesNode from "../notation_representations/nodes/CombineRelationshipShapesNode";
import CombineRoleShapesNode from "../notation_representations/nodes/CombineRoleShapesNode";

interface NotationsSliderProps {
  settings: {};
  notations: Notation[];
  setCurrentNotation: (value: Notation) => void;
}

function NotationsSlider({
  settings,
  notations,
  setCurrentNotation,
}: NotationsSliderProps) {
  const updatedSettings = {
    ...settings,
    infinite: notations.length > 5, // Disable infinite scroll when there's only 5 slides
  };

  const renderNodePreview = (notation: Notation) => {
    const notationType = notation.type;

    switch (notationType) {
      case "object":
        return (
          <CombineObjectShapesNode
            key={notation.name}
            id={notation.name}
            isPalette={true}
            isNotationSlider={true}
            data={{ notation }}
          />
        );
      case "relationship":
        return <CombineRelationshipShapesNode />;
      case "role":
        return <CombineRoleShapesNode />;
    }
  };

  console.log("notations_from_slider", notations);

  return (
    <Slider {...updatedSettings} className="mt-2">
      {notations.map((notation, index) => (
        <div
          key={index}
          className="border-[1px] border-black text-center h-28 p-2 cursor-pointer"
          onClick={() => setCurrentNotation(notation)}
        >
          {/** If the notation has a graphical representation, render it otherwise render its name */}
          {notation.graphicalRepresentation.length > 0 ? (
            renderNodePreview(notation)
          ) : (
            <span>{notation.name}</span>
          )}
        </div>
      ))}
    </Slider>
  );
}

export default NotationsSlider;
