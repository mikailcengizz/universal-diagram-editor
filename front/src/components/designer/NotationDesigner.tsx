import React, { useEffect, useState } from "react";
import axios from "axios";
import { SelectChangeEvent } from "@mui/material";
import NotationDesignerConfigurePanel from "./NotationDesignerConfigurePanel";
import NotationDesignerDrawPanel from "./NotationDesignerDrawPanel";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import configService from "../../services/ConfigService";
import {
  ConfigListItem,
  Attribute,
  MetaModel,
  RepresentationMetaModel,
  Class,
  Representation,
} from "../../types/types";
import ModelHelperFunctions from "../helpers/ModelHelperFunctions";

const NotationDesigner = () => {
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedMetaModel, setSelectedMetaModel] = useState<MetaModel>({
    package: {
      name: "",
      uri: "",
      elements: [],
    },
  });
  const [selectedRepresentationMetaModel, setSelectedRepresentationMetaModel] =
    useState<RepresentationMetaModel>({
      package: {
        uri: "",
        elements: [],
      },
    });

  const [currentNotationElement, setCurrentNotationElement] = useState<Class>({
    name: "",
    attributes: [],
    references: [],
    representation: undefined,
  });
  const [
    currentNotationElementRepresentation,
    setCurrentNotationElementRepresentation,
  ] = useState<Representation>({
    name: "",
    type: "ClassNode",
    graphicalRepresentation: [],
  });

  const [selectedNotationType, setSelectedNotationType] = useState<string>();
  const [newAttribute, setNewAttribute] = useState<Attribute>({
    name: "",
    attributeType: {
      name: "String",
    },
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
    if (selectedMetaModel.package && !isConfigLoaded) {
      const loadMetaConfig = async () => {
        try {
          const response = await configService.getMetaConfigByUri(
            selectedMetaModel.package.uri
          );
          if (
            !response.data ||
            response.data === "" ||
            response.data === null
          ) {
            return;
          }
          const config = response.data as MetaModel;
          setSelectedMetaModel(config);
          setIsConfigLoaded(true); // Mark config as loaded
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadMetaConfig();

      const loadRepresentationConfig = async () => {
        try {
          const response = await configService.getRepresentationConfigByUri(
            selectedMetaModel.package.uri + "-representation"
          );
          if (
            !response.data ||
            response.data === "" ||
            response.data === null
          ) {
            return;
          }
          const config = response.data as RepresentationMetaModel;
          setSelectedRepresentationMetaModel(config);
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadRepresentationConfig();
    }
  }, [selectedMetaModel.package, isConfigLoaded]);

  const handleNotationTypeChange = (e: SelectChangeEvent<string>) => {
    /* setSelectedNotationType(value);
    setCurrentNotation({
      ...currentNotation,
      type: value,
    }); */
  };

  const handleAddAttribute = () => {
    /* setCurrentNotation({
      ...currentNotation,
      attributes: [...currentNotation.attributes!, newAttribute],
    });
    setNewAttribute({
      id: "",
      name: "",
      defaultValue: "",
      eAttributeType: undefined,
      isUnique: false,
      lowerBound: 0,
      upperBound: 1,
    }); */
  };

  const saveNotation = () => {
    // Save in the frontend
    const updatedElements = { ...selectedMetaModel.package.elements };

    setSelectedMetaModel({
      package: {
        ...selectedMetaModel.package,
        elements: updatedElements,
      },
    });

    // Save in the backend
    const saveConfig = async () => {
      try {
        await axios.post(
          "/config/save",
          {
            uri: selectedMetaModel?.package.uri,
            elements: updatedElements,
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
          currentNotationElementRepresentation={
            currentNotationElementRepresentation
          }
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          newAttribute={newAttribute}
          setNewAttribute={setNewAttribute}
          handleAddProperty={handleAddAttribute}
          availableConfigs={availableConfigs}
          selectedMetaModel={selectedMetaModel}
          setSelectedMetaModel={(config) => {
            setSelectedMetaModel(config);
            setIsConfigLoaded(false); // Reset flag if a new config is selected
          }}
          selectedRepresentationMetaModel={selectedRepresentationMetaModel}
          setSelectedRepresentationMetaModel={
            setSelectedRepresentationMetaModel
          }
          saveNotation={saveNotation}
        />
      ) : (
        <NotationDesignerDrawPanel
          currentNotationElementRepresentation={
            currentNotationElementRepresentation
          }
          setCurrentNotationElementRepresentation={
            setCurrentNotationElementRepresentation
          }
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          selectedRepresentationMetaModel={selectedRepresentationMetaModel}
          setSelectedRepresentationMetaModel={
            setSelectedRepresentationMetaModel
          }
          saveNotation={saveNotation}
        />
      )}
    </div>
  );
};

export default NotationDesigner;
