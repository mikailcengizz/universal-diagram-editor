import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Notation } from "../../types/types";

interface NotationsSliderProps {
  settings: {};
  notations: Notation[];
}

function NotationsSlider({ settings, notations }: NotationsSliderProps) {
  const updatedSettings = {
    ...settings,
    infinite: notations.length > 1, // Disable infinite scroll when there's only 1 slide
  };

  return (
    <Slider {...updatedSettings} className="mt-2">
      {notations.map((notation, index) => (
        <div key={index} className="border-[1px] border-black text-center h-28">
          <h3 className="h-full flex items-center">{notation.name}</h3>
        </div>
      ))}
    </Slider>
  );
}

export default NotationsSlider;
