import React, { useEffect, useState } from "react";
import {
  Config,
  ConfigElement,
  ConfigListItem,
  Notation,
} from "../types/types";
import UploadConfig from "./UploadConfig";
import axios from "axios";

type Shape = "rectangle" | "circle" | "arrow" | "dot" | "umlClass";

const NotationDesigner: React.FC = () => {
  const [notations, setNotations] = useState<ConfigElement[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape>("circle");
  const [label, setLabel] = useState<string>("");
  const [rules, setRules] = useState<{ [key: string]: any }>({});
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [configName, setConfigName] = useState<string>("");
  const [sections, setSections] = useState<{ name: string; default: string }[]>(
    []
  );

  useEffect(() => {
    // fetch available configurations from the server
    const fetchConfigs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/config/list", {
          headers: {
            Authorization: "Basic " + btoa("test@hotmail.com:test123"),
          },
        });
        const data: ConfigListItem[] = response.data;
        setAvailableConfigs(data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };

    fetchConfigs();
  }, []);

  useEffect(() => {
    if (selectedConfig) {
      // load the selected configuration from the server
      const loadConfig = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/config/get-config/${selectedConfig}`,
            {
              headers: {
                Authorization: "Basic " + btoa("test@hotmail.com:test123"),
              },
            }
          );
          const config = response.data as Config;
          setNotations(config.notations[0].elements);
          setConfigName(config.name);
          // additional code to set up other state as necessary, such as rules
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadConfig();
    }
  }, [selectedConfig]);

  const addNotation = () => {
    const newNotation: ConfigElement = {
      id: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      shape: currentShape,
      sections: currentShape === "umlClass" ? sections : undefined,
    };
    setNotations([...notations, newNotation]);
    setLabel("");
    setSections([]);
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
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

  const handleConfigNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfigName(e.target.value);
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
      <h1 className="text-2xl font-extrabold mb-8">Notation Designer</h1>

      {/* dropdown to select existing configurations */}
      <div style={{ marginBottom: "20px" }}>
        <label>Select Configuration: </label>
        <select
          value={selectedConfig || ""}
          onChange={(e) => setSelectedConfig(e.target.value)}
          className="hover:cursor-pointer border-2 border-lightgray min-w-28"
        >
          <option value="">-- Select a Configuration --</option>
          {availableConfigs.map((config, index) => (
            <option key={index} value={config.filename}>
              {config.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Configuration Name: </label>
        <input
          type="text"
          value={configName}
          onChange={handleConfigNameChange}
          className="border-2 border-lightgray"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Choose Shape: </label>
        <select
          value={currentShape}
          onChange={handleShapeChange}
          className="hover:cursor-pointer border-2 border-lightgray min-w-28"
        >
          <option value="circle">Circle</option>
          <option value="rectangle">Rectangle</option>
          <option value="arrow">Arrow</option>
          <option value="dot">Dot</option>
          <option value="umlClass">UML Class</option>
          {/* shape options as needed */}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Label: </label>
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          className="border-2 border-lightgray"
        />
      </div>

      {currentShape === "umlClass" && (
        <div style={{ marginBottom: "20px" }}>
          <label>Sections:</label>
          {sections.map((section, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Section name"
                value={section.name}
                onChange={(e) =>
                  handleSectionChange(index, "name", e.target.value)
                }
                className="border-2 border-lightgray"
              />
              <input
                type="text"
                placeholder="Default text"
                value={section.default}
                onChange={(e) =>
                  handleSectionChange(index, "default", e.target.value)
                }
                className="border-2 border-lightgray"
              />
            </div>
          ))}
          <br />
          <button
            onClick={() =>
              setSections([...sections, { name: "", default: "" }])
            }
            className="bg-gray-600 px-4 py-1 text-white font-bold rounded-md hover:opacity-70 transition-all ease-out duration-300 mr-2"
          >
            Add Section
          </button>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h3 className="font-bold">Rules and Constraints</h3>
        <div>
          <label>Max Connections: </label>
          <input
            type="number"
            onChange={(e) => handleRuleChange(e, "maxConnections")}
            className="border-2 border-lightgray"
          />
        </div>
        <div>
          <label>Can Contain: </label>
          <input
            type="text"
            onChange={(e) => handleRuleChange(e, "canContain")}
            className="border-2 border-lightgray"
          />
        </div>
        {/* more rule fields as necessary */}
      </div>

      <button
        onClick={addNotation}
        className="bg-black px-4 py-1 text-white font-bold rounded-md hover:opacity-70 transition-all ease-out duration-300 mr-2"
      >
        Add Notation
      </button>
      <button
        onClick={exportConfig}
        className="bg-black px-4 py-1 text-white font-bold rounded-md hover:opacity-70 transition-all ease-out duration-300"
      >
        Export Configuration
      </button>
      <div>
        <h3 className="font-bold mt-2">Current Notations</h3>
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
      <UploadConfig configName={configName} selectedConfig={selectedConfig} />
    </div>
  );
};

export default NotationDesigner;
