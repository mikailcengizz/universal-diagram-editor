// NotationDesigner.tsx
import React, { useState } from "react";
import { ConfigElement } from "../types/types";
import UploadConfig from "./UploadConfig";

type Shape = "rectangle" | "circle" | "arrow" | "dot";

const NotationDesigner: React.FC = () => {
  const [notations, setNotations] = useState<ConfigElement[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape>("circle");
  const [label, setLabel] = useState<string>("");
  const [rules, setRules] = useState<{ [key: string]: any }>({});

  const addNotation = () => {
    const newNotation: ConfigElement = {
      id: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      shape: currentShape,
      // additional properties or rules here
    };
    setNotations([...notations, newNotation]);
    setLabel("");
  };

  const handleShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentShape(e.target.value as Shape);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleRuleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    ruleName: string
  ) => {
    setRules({ ...rules, [ruleName]: e.target.value });
  };

  const exportConfig = () => {
    const config = {
      notations: [
        {
          name: "Custom Diagram Standard",
          elements: notations.map((n) => ({
            ...n,
            rules: rules[n.id] || {}, // rules to each element
          })),
        },
      ],
    };
    const blob = new Blob([JSON.stringify(config)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "custom-diagram-standard.json";
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notation Designer</h2>
      <div style={{ marginBottom: "20px" }}>
        <label>Choose Shape: </label>
        <select value={currentShape} onChange={handleShapeChange}>
          <option value="circle">Circle</option>
          <option value="rectangle">Rectangle</option>
          <option value="arrow">Arrow</option>
          <option value="dot">Dot</option>
          {/* shape options as needed */}
        </select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>Label: </label>
        <input type="text" value={label} onChange={handleLabelChange} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Rules and Constraints</h3>
        <div>
          <label>Max Connections: </label>
          <input
            type="number"
            onChange={(e) => handleRuleChange(e, "maxConnections")}
          />
        </div>
        <div>
          <label>Can Contain: </label>
          <input
            type="text"
            onChange={(e) => handleRuleChange(e, "canContain")}
          />
        </div>
        {/* more rule fields as necessary */}
      </div>
      <button onClick={addNotation} className="border-black border-2 px-4 py-1">
        Add Notation
      </button>
      <button
        onClick={exportConfig}
        className="border-black border-2 px-4 py-1"
      >
        Export Configuration
      </button>
      <div>
        <h3>Current Notations</h3>
        <ul>
          {notations.map((n) => (
            <li key={n.id}>
              {n.label} ({n.shape})
            </li>
          ))}
        </ul>
      </div>

      <br />
      <h3 className="text-lg font-bold">Upload config to server</h3>
      <UploadConfig />
    </div>
  );
};

export default NotationDesigner;
