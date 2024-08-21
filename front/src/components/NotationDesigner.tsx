import React, { useEffect, useState } from "react";
import { Config, ConfigListItem, Notation } from "../types/types";
import UploadConfig from "./UploadConfig";
import axios from "axios";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PreviewNode from "./notation_representations/nodes/PreviewNode";
import type { Shape } from "../types/types";

const NotationDesigner: React.FC = () => {
  const [notations, setNotations] = useState<Notation[]>([]);
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [packageName, setPackageName] = useState<string>("");
  const [currentNotation, setCurrentNotation] = useState<Notation>({
    name: "",
    label: "",
    shape: "rectangle",
    style: null,
    sourceId: null,
    targetId: null,
    sections: [],
    mappings: [],
    rules: {},
  });

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
          setNotations(config.notations);
          setPackageName(config.name);
          // additional code to set up other state as necessary, such as rules
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadConfig();
    }
  }, [selectedConfig]);

  const addNotation = () => {
    if (!currentNotation!.name) {
      alert("Please enter a notation name.");
      return;
    }
    setNotations([...notations, currentNotation!]);
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    // Create a new array for sections with updated values
    const updatedSections = currentNotation.sections!.map((section, idx) =>
      idx === index ? { ...section, [field]: value } : section
    );

    const newCurrentNotation = {
      ...currentNotation,
      sections: updatedSections,
    };

    setCurrentNotation(newCurrentNotation);
  };

  const handleShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrentNotation = currentNotation!;
    newCurrentNotation.shape = e.target.value as Shape;
    setCurrentNotation(newCurrentNotation);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCurrentNotation = currentNotation!;
    newCurrentNotation.label = e.target.value;
    setCurrentNotation(newCurrentNotation);
  };

  const handleRuleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    ruleName: string
  ) => {
    const newCurrentNotation = currentNotation!;
    newCurrentNotation.rules![ruleName] = e.target.value;
    setCurrentNotation(newCurrentNotation);
  };

  const handleNotationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCurrentNotation = {
      ...currentNotation,
      name: e.target.value,
    };
    const index = newCurrentNotation.mappings.findIndex(
      (m: any) => m.shape === currentNotation?.shape
    );
    if (index !== -1) {
      newCurrentNotation.mappings[index].metamodel = e.target.value;
    } else {
      newCurrentNotation.mappings.push({
        shape: currentNotation?.shape!,
        metamodel: e.target.value,
      });
    }
    setCurrentNotation(newCurrentNotation);
  };

  const handleConfigNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageName(e.target.value);
  };

  const exportConfig = () => {
    if (!packageName) {
      alert("Please enter a configuration name.");
      return;
    }
    if (notations.length === 0) {
      alert("Please add at least one notation.");
      return;
    }
    if (!currentNotation?.name) {
      alert("Please enter a notation name.");
      return;
    }
    const config = {
      name: packageName,
      notations: notations,
    };
    const blob = new Blob([JSON.stringify(config)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${packageName}-config.json`;
    link.click();
  };

  const previewNotation = () => {
    switch (currentNotation.shape) {
      case "rectangle":
        return (
          <PreviewNode
            key={currentNotation.name}
            shape={currentNotation.shape}
            label={currentNotation.label}
            rules={currentNotation.rules}
            sections={currentNotation.sections}
            type={currentNotation}
          />
        );
      case "label":
        return <div>{currentNotation.label}</div>;
      case "compartment":
        return (
          <div
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              backgroundColor: "white",
              padding: "10px",
              minWidth: "150px",
            }}
          >
            <div style={{ paddingBottom: "5px" }}>
              <strong>{currentNotation.label}</strong>
            </div>
          </div>
        );
      case "arrow":
        return (
          <div style={{ width: "0", height: "0", border: "10px solid" }} />
        );
      case "dot":
        return (
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "black",
            }}
          />
        );
      default:
        return <div>{currentNotation.label}</div>;
    }
  };

  return (
    <div className="p-5 w-full flex">
      {/* Notation Designer */}
      <div className="w-1/2">
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
            value={packageName}
            onChange={handleConfigNameChange}
            className="border-2 border-lightgray"
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>Select Node Type: </label>
          <select
            value={currentNotation?.shape || "rectangle"}
            onChange={handleShapeChange}
            className="hover:cursor-pointer border-2 border-lightgray min-w-28"
          >
            <option value="rectangle">Rectangle</option>
            <option value="compartment">Compartment</option>
            <option value="label">Label</option>
            <option value="arrow">Arrow</option>
            <option value="dot">Dot</option>
            {/* Add more predefined node types */}
          </select>
        </div>
        {/* Mapping to metamodel element */}
        {/* Example: { shape: "rectangle", metamodel: "Class" } */}
        <div className="mb-5">
          <label>Notation Name</label>
          <input
            type="text"
            value={currentNotation.name}
            placeholder="Enter notation name"
            className="border-2 border-lightgray"
            onChange={(e) => handleNotationNameChange(e)}
          />
        </div>

        {/* Label is an element of its own, so ownly show default label text when editing a label notation */}
        {currentNotation?.shape === "label" && (
          <div style={{ marginBottom: "20px" }}>
            <label>Default Label Text: </label>
            <input
              type="text"
              value={currentNotation.label!}
              onChange={handleLabelChange}
              className="border-2 border-lightgray"
            />
          </div>
        )}
        {currentNotation?.shape === "rectangle" && (
          <div style={{ marginBottom: "20px" }}>
            <label>Sections:</label>
            {currentNotation.sections!.map((section, index) => (
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
              onClick={() => {
                if (!currentNotation.sections) {
                  setCurrentNotation({
                    ...currentNotation!,
                    sections: [{ name: "", default: "" }],
                  });
                } else {
                  setCurrentNotation({
                    ...currentNotation!,
                    sections: [
                      ...currentNotation!.sections!,
                      { name: "", default: "" },
                    ],
                  });
                }
              }}
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
          className="bg-gray-600 px-4 py-1 text-white font-bold rounded-md hover:opacity-70 transition-all ease-out duration-300 mr-2"
        >
          Add Notation
        </button>
        <div>
          <h3 className="text-lg font-bold mt-8">Current Notations</h3>
          <ul>
            {notations &&
              notations.length > 0 &&
              notations.map((n) => (
                <li key={n.name}>
                  {n.name} ({n.shape}) <CloseOutlinedIcon />
                </li>
              ))}
          </ul>
        </div>

        <button
          onClick={exportConfig}
          className="bg-black px-4 py-1 text-white font-bold rounded-md hover:opacity-70 transition-all ease-out duration-300 mt-4"
        >
          Export Configuration
        </button>
        <div className="mt-6">
          <h3 className="text-lg font-bold">Upload config to server</h3>
          <UploadConfig
            packageName={packageName}
            selectedConfig={selectedConfig}
          />
        </div>
      </div>

      {/* Notation Preview */}
      <div className="w-1/2">
        <h1 className="text-2xl font-extrabold mb-8">Notation Preview</h1>
        <div className="flex">
          {/* Render the selected notation */}
          {previewNotation()}
        </div>
      </div>
    </div>
  );
};

export default NotationDesigner;
