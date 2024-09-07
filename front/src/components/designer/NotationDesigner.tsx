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
import AutorenewIcon from "@mui/icons-material/Autorenew";
import configService from "../../services/ConfigService";

const NotationDesigner = () => {
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedConfig, setSelectedConfig] = useState<Config>({
    name: "",
    notations: {
      objects: [],
      relationships: [],
      roles: [],
    },
  });
  const [currentNotation, setCurrentNotation] = useState<Notation>({
    name: "",
    type: "",
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
  const [isConfigurePanelOpen, setIsConfigurePanelOpen] =
    useState<boolean>(true);
  const [isConfigLoaded, setIsConfigLoaded] = useState<boolean>(false);

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
    // Only load config if it's not loaded yet or when a new config name is selected
    if (selectedConfig.name && !isConfigLoaded) {
      const loadConfig = async () => {
        try {
          const response = await configService.getConfigByName(
            selectedConfig.name
          );
          if (
            !response.data ||
            response.data === "" ||
            response.data === null
          ) {
            return;
          }
          const config = response.data as Config;
          setSelectedConfig(config);
          setIsConfigLoaded(true); // Mark config as loaded
          setCurrentNotation({
            name: "",
            type: "",
            properties: [],
            description: "",
            graphicalRepresentation: [],
          });
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadConfig();
    }
  }, [selectedConfig.name, isConfigLoaded]);

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

  const saveNotation = () => {
    // Save in the frontend
    const updatedNotations = { ...selectedConfig!.notations };
    if (currentNotation.type === "object") {
      const alreadyExists = selectedConfig.notations.objects.findIndex(
        (n) => n.name === currentNotation.name
      );
      if (alreadyExists !== -1) {
        updatedNotations.objects[alreadyExists] = currentNotation;
      } else {
        updatedNotations.objects.push(currentNotation);
      }
    } else if (selectedNotationType === "relationship") {
      const alreadyExists = selectedConfig.notations.relationships.findIndex(
        (n) => n.name === currentNotation.name
      );
      if (alreadyExists !== -1) {
        updatedNotations.relationships[alreadyExists] = currentNotation;
      } else {
        updatedNotations.relationships.push(currentNotation);
      }
    } else if (selectedNotationType === "role") {
      const alreadyExists = selectedConfig.notations.roles.findIndex(
        (n) => n.name === currentNotation.name
      );
      if (alreadyExists !== -1) {
        updatedNotations.roles[alreadyExists] = currentNotation;
      } else {
        updatedNotations.roles.push(currentNotation);
      }
    }
    setSelectedConfig({ ...selectedConfig!, notations: updatedNotations });

    // Save in the backend
    const saveConfig = async () => {
      try {
        await axios.post(
          "/config/save",
          {
            name: selectedConfig?.name,
            notations: updatedNotations,
          },
          {
            headers: {
              Authorization: "Basic " + btoa("test@hotmail.com:test123"),
            },
          }
        );
      } catch (error) {
        console.error("Error saving configuration:", error);
      }
    };
    saveConfig();

    setCurrentNotation({
      name: "",
      type: "",
      properties: [],
      description: "",
      graphicalRepresentation: [],
    });
  };

  return (
    <div className="flex flex-col h-full bg-white min-h-screen w-full ">
      <div className="w-full pt-4 pb-4 px-12">
        <div
          className="bg-[#1B1B20] px-4 py-2 w-fit rounded-md text-white cursor-pointer float-right hover:opacity-85 trransition duration-300 ease-in-out"
          onClick={() => setIsConfigurePanelOpen(!isConfigurePanelOpen)}
        >
          <span className="text-sm">
            Switch to {isConfigurePanelOpen ? "draw panel" : "configure panel"}
          </span>
          <AutorenewIcon className="ml-1" fontSize="small" />
        </div>
      </div>

      {isConfigurePanelOpen ? (
        <NotationDesignerConfigurePanel
          selectedNotationType={selectedNotationType!}
          handleNotationTypeChange={handleNotationTypeChange}
          currentNotation={currentNotation}
          setCurrentNotation={setCurrentNotation}
          newProperty={newProperty}
          setNewProperty={setNewProperty}
          handleAddProperty={handleAddProperty}
          availableConfigs={availableConfigs}
          selectedConfig={selectedConfig}
          setSelectedConfig={(config) => {
            setSelectedConfig(config);
            setIsConfigLoaded(false); // Reset flag if a new config is selected
          }}
          saveNotation={saveNotation}
        />
      ) : (
        <NotationDesignerDrawPanel
          currentNotation={currentNotation}
          setCurrentNotation={setCurrentNotation}
          saveNotation={saveNotation}
        />
      )}
    </div>
  );
};

export default NotationDesigner;
