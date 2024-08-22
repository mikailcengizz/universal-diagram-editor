import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SimpleSliderProps {
  settings: {};
  slides: any[];
}

function SimpleSlider({ settings, slides }: SimpleSliderProps) {
  return (
    <Slider {...settings}>
      <div className="border-[1px] border-black text-center">
        <h3>Notation 1</h3>
      </div>
      <div className="border-[1px] border-black text-center">
        <h3>Notation 2</h3>
      </div>
      <div className="border-[1px] border-black text-center">
        <h3>Notation 3</h3>
      </div>
      <div className="border-[1px] border-black text-center">
        <h3>Notation 4</h3>
      </div>
      <div className="border-[1px] border-black text-center">
        <h3>Notation 5</h3>
      </div>
      <div className="border-[1px] border-black text-center">
        <h3>Notation 6</h3>
      </div>
    </Slider>
  );
}

export default SimpleSlider;
