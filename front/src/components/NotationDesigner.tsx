import React, { useEffect, useState } from "react";
import {
  Config,
  ConfigListItem,
  Notation,
  Notations,
  NotationType,
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
    objects: [],
    relationships: [],
    roles: [],
  });
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedConfig, setSelectedConfig] = useState<string | null>("");
  const [packageName, setPackageName] = useState<string>("");
  const [currentNotation, setCurrentNotation] = useState<Notation>({
    name: "",
    type: "object",
    properties: [],
    description: "",
    graphicalRepresentation: [],
  });
  const [selectedNotationType, setSelectedNotationType] =
    useState<NotationType>();

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
          setPackageName(config.packageName);
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadConfig();
    }
  }, [selectedConfig]);

  const handleNotationTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as NotationType;

    setSelectedNotationType(value);
    setCurrentNotation({
      ...currentNotation,
      type: e.target.value as NotationType,
    });
  };

  const saveNotation = () => {
    const updatedNotations = { ...notations };
    if (selectedNotationType === "object") {
      updatedNotations.objects.push(currentNotation);
    } else if (selectedNotationType === "relationship") {
      updatedNotations.relationships.push(currentNotation);
    } else if (selectedNotationType === "role") {
      updatedNotations.roles.push(currentNotation);
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
      {/* Notation type selection */}
      <FormControl>
        <InputLabel>Select Category</InputLabel>
        <Select
          value={selectedNotationType || ""}
          onChange={handleNotationTypeChange}
        >
          <MenuItem value="object">Object</MenuItem>
          <MenuItem value="relationship">Relationship</MenuItem>
          <MenuItem value="role">Role</MenuItem>
        </Select>
      </FormControl>

      {/* Save and export buttons */}
      <button onClick={saveNotation}>Save Notation</button>
      <button onClick={exportConfig}>Export Configuration</button>
    </div>
  );
};

export default NotationDesigner;
