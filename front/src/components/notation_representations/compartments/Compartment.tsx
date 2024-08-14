import React, { useState } from "react";

interface CompartmentProps {
  text: string;
  onChange: (text: string) => void;
  style?: React.CSSProperties;
}

const Compartment = ({ text, onChange, style }: CompartmentProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
    onChange(value);
  };

  return (
    <div
      style={{
        borderBottom: "1px solid black",
        padding: "5px",
        ...style,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          style={{ width: "100%" }}
        />
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
};

export default Compartment;
