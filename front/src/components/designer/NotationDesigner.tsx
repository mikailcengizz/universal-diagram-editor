import React, { useEffect, useState } from "react";
import {
  Config,
  ConfigListItem,
  Notation,
  NotationRepresentationItem,
  Notations,
  NotationType,
  Property,
} from "../../types/types";
import axios from "axios";
import { SelectChangeEvent } from "@mui/material";
import NotationDesignerConfigurePanel from "./NotationDesignerConfigurePanel";
import NotationDesignerDrawPanel from "./NotationDesignerDrawPanel";

const NotationDesigner = () => {
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
  const [newProperty, setNewProperty] = useState<Property>({
    name: "",
    defaultValue: "",
    dataType: "String",
    elementType: "",
    isUnique: false,
  });
  const [newGraphicalElement, setNewGraphicalElement] =
    useState<NotationRepresentationItem>({
      shape: "square",
      style: {
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        borderWidth: 1,
        borderStyle: "solid",
      },
      position: {
        x: 0,
        y: 0,
        extent: {
          width: 100,
          height: 100,
        },
      },
    });
  const [isConfigurePanelOpen, setIsConfigurePanelOpen] =
    useState<boolean>(true);

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

  const handleAddProperty = () => {
    setCurrentNotation({
      ...currentNotation,
      properties: [...currentNotation.properties, newProperty],
    });
    setNewProperty({
      name: "",
      defaultValue: "",
      dataType: "String",
      elementType: "",
      isUnique: false,
    });
  };

  const handleAddGraphicalElement = () => {
    // Check if the necessary fields are populated
    if (
      newGraphicalElement.shape &&
      newGraphicalElement.position &&
      newGraphicalElement.position.x !== undefined &&
      newGraphicalElement.position.y !== undefined &&
      newGraphicalElement.style
    ) {
      // Add the new graphical element to the current notation's graphical representation
      setCurrentNotation({
        ...currentNotation,
        graphicalRepresentation: [
          ...currentNotation.graphicalRepresentation,
          newGraphicalElement,
        ],
      });

      // Reset the new graphical element to a default state
      setNewGraphicalElement({
        shape: "square",
        style: {
          backgroundColor: "#ffffff",
          borderColor: "#000000",
          borderWidth: 1,
          borderStyle: "solid",
        },
        position: {
          x: 0,
          y: 0,
          extent: {
            width: 100,
            height: 100,
          },
        },
      });
    } else {
      // Handle cases where required fields are missing
      console.error("New graphical element is missing required fields.");
    }
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
    setCurrentNotation({
      name: "",
      type: "object",
      properties: [],
      description: "",
      graphicalRepresentation: [],
    });
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
    <div className="flex flex-col h-full bg-white min-h-screen px-12 pt-4 w-full">
      <div className="w-full">
        <div
          className="bg-[#1B1B20] px-8 py-2 w-fit rounded-md text-white cursor-pointer float-right"
          onClick={() => setIsConfigurePanelOpen(!isConfigurePanelOpen)}
        >
          Switch to {isConfigurePanelOpen ? "draw panel" : "configure panel"}
        </div>
      </div>
      <br />

      {isConfigurePanelOpen ? (
        <NotationDesignerConfigurePanel
          selectedNotationType={selectedNotationType!}
          handleNotationTypeChange={handleNotationTypeChange}
          packageName={packageName}
          setPackageName={setPackageName}
          currentNotation={currentNotation}
          setCurrentNotation={setCurrentNotation}
          newProperty={newProperty}
          setNewProperty={setNewProperty}
          handleAddProperty={handleAddProperty}
          saveNotation={saveNotation}
          exportConfig={exportConfig}
        />
      ) : (
        <NotationDesignerDrawPanel
          currentNotation={currentNotation}
          setCurrentNotation={setCurrentNotation}
        />
      )}
    </div>
  );
};

export default NotationDesigner;
