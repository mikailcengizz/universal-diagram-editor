import React, { useEffect, useState } from "react";
import {
  Config,
  ConfigListItem,
  Notation,
  Notations,
  StyleProperties,
} from "../types/types";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const NotationDesigner: React.FC = () => {
  const [notations, setNotations] = useState<Notations>({
    classifiers: [],
    features: [],
    relations: [],
  });
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedConfig, setSelectedConfig] = useState<string | null>("");
  const [packageName, setPackageName] = useState<string>("");
  const [currentNotation, setCurrentNotation] = useState<Notation>({
    category: null,
    styleProperties: {
      border: [],
      general: [],
      other: [],
    },
    semanticProperties: [],
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available configurations from the server
    const fetchConfigs = async () => {
      try {
        const response = await axios.get("/config/list", {
          headers: {
            Authorization: "Basic " + btoa("test@hotmail.com:test123"),
          },
        });
        setAvailableConfigs(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };

    fetchConfigs();
  }, []);

  useEffect(() => {
    if (selectedConfig) {
      const loadConfig = async () => {
        try {
          const response = await axios.get(
            `/config/get-config/${selectedConfig}`,
            {
              headers: {
                Authorization: "Basic " + btoa("test@hotmail.com:test123"),
              },
            }
          );
          const config = response.data as Config;
          setNotations(config.notations);
          setPackageName(config.name);
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadConfig();
    }
  }, [selectedConfig]);

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setSelectedCategory(e.target.value);
    setCurrentNotation({
      ...currentNotation,
      category: e.target.value as "classifier" | "feature" | "relation",
    });
  };

  const handleShapeChange = (e: SelectChangeEvent<string>) => {
    const shape = e.target.value;
    setSelectedShape(shape);
    setCurrentNotation({
      ...currentNotation,
      styleProperties: {
        ...currentNotation.styleProperties,
        general: [{ name: "Shape", default: shape }],
      },
    });
  };

  const handleStylePropertyChange = (
    section: keyof StyleProperties,
    name: string,
    value: string | number
  ) => {
    setCurrentNotation((prevNotation) => {
      const updatedStyleProperties = {
        ...prevNotation.styleProperties,
        [section]: prevNotation.styleProperties[section]?.map((prop) =>
          prop.name === name ? { ...prop, default: value } : prop
        ),
      };
      return { ...prevNotation, styleProperties: updatedStyleProperties };
    });
  };

  const handleSemanticPropertyChange = (
    name: string,
    value: string | number
  ) => {
    setCurrentNotation((prevNotation) => {
      const updatedSemanticProperties = prevNotation.semanticProperties.map(
        (prop) =>
          prop.name === name ? { ...prop, default: String(value) } : prop
      );
      return { ...prevNotation, semanticProperties: updatedSemanticProperties };
    });
  };

  const saveNotation = () => {
    const updatedNotations = { ...notations };
    if (selectedCategory === "classifier") {
      updatedNotations.classifiers.push(currentNotation);
    } else if (selectedCategory === "feature") {
      updatedNotations.features.push(currentNotation);
    } else if (selectedCategory === "relation") {
      updatedNotations.relations.push(currentNotation);
    }
    setNotations(updatedNotations);
  };

  const exportConfig = () => {
    if (!packageName) {
      alert("Please enter a configuration name.");
      return;
    }
    const config = { name: packageName, notations };
    const blob = new Blob([JSON.stringify(config)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${packageName}-config.json`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Category selection */}
      <FormControl>
        <InputLabel>Select Category</InputLabel>
        <Select value={selectedCategory || ""} onChange={handleCategoryChange}>
          <MenuItem value="classifier">Classifier</MenuItem>
          <MenuItem value="feature">Feature</MenuItem>
          <MenuItem value="relation">Relation</MenuItem>
        </Select>
      </FormControl>

      {/* Shape selection based on category */}
      {selectedCategory && (
        <FormControl>
          <InputLabel>Select Shape</InputLabel>
          <Select value={selectedShape || ""} onChange={handleShapeChange}>
            <MenuItem value="rectangle">Rectangle</MenuItem>
            <MenuItem value="compartment">Compartment</MenuItem>
            <MenuItem value="label">Label</MenuItem>
            <MenuItem value="arrow">Arrow</MenuItem>
            <MenuItem value="dot">Dot</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Render style and semantic properties form based on selected shape */}
      {selectedShape && (
        <>
          {/* Example for handling general style properties */}
          <div>
            <h3>Style Properties</h3>
            <input
              type="text"
              placeholder="Label Color"
              value={
                currentNotation.styleProperties.other!.find(
                  (prop) => prop.name === "Label Color"
                )?.default || ""
              }
              onChange={(e) =>
                handleStylePropertyChange(
                  "other",
                  "Label Color",
                  e.target.value
                )
              }
            />
          </div>

          {/* Example for handling semantic properties */}
          <div>
            <h3>Semantic Properties</h3>
            <input
              type="text"
              placeholder="Name"
              value={
                currentNotation.semanticProperties.find(
                  (prop) => prop.name === "Name"
                )?.default || ""
              }
              onChange={(e) =>
                handleSemanticPropertyChange("Name", e.target.value)
              }
            />
          </div>
        </>
      )}

      {/* Save and export buttons */}
      <button onClick={saveNotation}>Save Notation</button>
      <button onClick={exportConfig}>Export Configuration</button>
    </div>
  );
};

export default NotationDesigner;
