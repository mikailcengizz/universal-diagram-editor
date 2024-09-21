import React, { useEffect, useState } from "react";
import axios from "axios";
import { SelectChangeEvent } from "@mui/material";
import NotationDesignerConfigurePanel from "./NotationDesignerConfigurePanel";
import NotationDesignerDrawPanel from "./NotationDesignerDrawPanel";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import configService from "../../services/ConfigService";
import {
  ConfigListItem,
  EAttribute,
  EAttributeInstance,
  EClass,
  MetaModelFile,
  InstanceNotation,
  NotationType,
  RepresentationModelFile,
  MetaNotation,
} from "../../types/types";
import typeHelper from "../helpers/TypeHelper";

const NotationDesigner = () => {
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedMetaConfig, setSelectedMetaConfig] = useState<MetaModelFile>({
    name: "",
    type: "meta",
    ePackages: [],
  });
  const [selectedRepresentationConfig, setSelectedRepresentationConfig] =
    useState<RepresentationModelFile>({
      name: "",
      type: "representation",
      ePackages: [],
    });
  const [currentNotation, setCurrentNotation] = useState<InstanceNotation>({
    name: "",
    type: undefined,
    eAttributes: [],
    eReferences: [],
    eOperations: [],
    eSubpackages: [],
    graphicalRepresentation: [],
  });
  const [selectedNotationType, setSelectedNotationType] =
    useState<NotationType>();
  const [newAttribute, setNewAttribute] = useState<EAttributeInstance>({
    id: "",
    name: "",
    defaultValue: "",
    eAttributeType: undefined,
    isUnique: false,
    lowerBound: 0,
    upperBound: 1,
  });
  const [isConfigurePanelOpen, setIsConfigurePanelOpen] =
    useState<boolean>(true);
  const [isConfigLoaded, setIsConfigLoaded] = useState<boolean>(false);
  const [allNotations, setAllNotations] = useState<MetaNotation[]>([]);

  useEffect(() => {
    if (selectedMetaConfig && selectedRepresentationConfig) {
      const metaPackages = selectedMetaConfig.ePackages;
      const representationPackages = selectedRepresentationConfig.ePackages;

      const mergedNotations = typeHelper.mergeMetaAndRepresentation(
        metaPackages,
        representationPackages
      );

      // Set the merged notations
      setAllNotations(mergedNotations);
    }
  }, [selectedMetaConfig, selectedRepresentationConfig, isConfigurePanelOpen]); // Add isConfigurePanelOpen to ensure state updates on panel switch

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
    if (selectedMetaConfig.name && !isConfigLoaded) {
      const loadMetaConfig = async () => {
        try {
          const response = await configService.getMetaConfigByName(
            selectedMetaConfig.name
          );
          if (
            !response.data ||
            response.data === "" ||
            response.data === null
          ) {
            return;
          }
          const config = response.data as MetaModelFile;
          setSelectedMetaConfig(config);
          setIsConfigLoaded(true); // Mark config as loaded
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadMetaConfig();

      const loadRepresentationConfig = async () => {
        try {
          const response = await configService.getRepresentationConfigByName(
            selectedMetaConfig.name
          );
          if (
            !response.data ||
            response.data === "" ||
            response.data === null
          ) {
            return;
          }
          const config = response.data as RepresentationModelFile;
          setSelectedRepresentationConfig(config);
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadRepresentationConfig();
    }
  }, [selectedMetaConfig.name, isConfigLoaded]);

  const handleNotationTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as NotationType;

    setSelectedNotationType(value);
    setCurrentNotation({
      ...currentNotation,
      type: value,
    });
  };

  const handleAddAttribute = () => {
    setCurrentNotation({
      ...currentNotation,
      eAttributes: [...currentNotation.eAttributes!, newAttribute],
    });
    setNewAttribute({
      id: "",
      name: "",
      defaultValue: "",
      eAttributeType: undefined,
      isUnique: false,
      lowerBound: 0,
      upperBound: 1,
    });
  };

  const saveNotation = () => {
    // Save in the frontend
    const updatedNotations = { ...selectedMetaConfig!.ePackages };

    setSelectedMetaConfig({
      ...selectedMetaConfig!,
      ePackages: updatedNotations,
    });

    // Save in the backend
    const saveConfig = async () => {
      try {
        await axios.post(
          "/config/save",
          {
            name: selectedMetaConfig?.name,
            type: selectedMetaConfig?.type,
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
  };

  return (
    <div className="flex flex-col h-full bg-white min-h-screen w-full ">
      <div className="w-full pt-4 pb-4 px-12">
        <div
          className="bg-[#1B1B20] px-4 py-2 w-fit rounded-md text-white cursor-pointer float-right hover:opacity-85 transition duration-300 ease-in-out"
          onClick={() => setIsConfigurePanelOpen(!isConfigurePanelOpen)}
        >
          <span className="text-sm">
            Switch to {isConfigurePanelOpen ? "draw panel" : "configure panel"}
          </span>
          <AutorenewIcon className="ml-1" fontSize="small" />
        </div>
      </div>

      {/* Pass the same currentNotation and setCurrentNotation to both panels */}
      {isConfigurePanelOpen ? (
        <NotationDesignerConfigurePanel
          selectedNotationType={selectedNotationType!}
          handleNotationTypeChange={handleNotationTypeChange}
          currentNotation={currentNotation}
          setCurrentNotation={setCurrentNotation}
          newAttribute={newAttribute}
          setNewAttribute={setNewAttribute}
          handleAddProperty={handleAddAttribute}
          availableConfigs={availableConfigs}
          selectedMetaConfig={selectedMetaConfig}
          setSelectedMetaConfig={(config) => {
            setSelectedMetaConfig(config);
            setIsConfigLoaded(false); // Reset flag if a new config is selected
          }}
          ePackages={selectedMetaConfig.ePackages}
          allNotations={allNotations}
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
