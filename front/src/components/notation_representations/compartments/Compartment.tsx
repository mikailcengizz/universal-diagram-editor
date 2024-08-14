import React from "react";

interface CompartmentProps {
  text: string;
  style?: React.CSSProperties;
}

const Compartment = ({ text, style }: CompartmentProps) => {
  return (
    <div
      style={{
        borderBottom: "1px solid black",
        padding: "5px",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export default Compartment;
