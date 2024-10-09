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
  Reference,
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
    defaultValue: "",
    isUnique: undefined,
  });
  const [newReference, setNewReference] = useState<Reference>({
    name: "",
    type: {
      $ref: "",
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

  const loadMetaConfig = async (selectedUri: string) => {
    try {
      const response = await configService.getMetaConfigByUri(
        encodeURIComponent(selectedUri)
      );
      if (!response.data || response.data === "" || response.data === null) {
        return;
      }
      const config = response.data as MetaModel;
      setSelectedMetaModel(config);
    } catch (error) {
      console.error("Error loading meta configuration:", error);
    }
  };

  const loadRepresentationConfig = async (selectedUri: string) => {
    try {
      const response = await configService.getRepresentationConfigByUri(
        encodeURIComponent(selectedUri + "-representation")
      );
      if (!response.data || response.data === "" || response.data === null) {
        return;
      }
      const config = response.data as RepresentationMetaModel;
      setSelectedRepresentationMetaModel(config);
    } catch (error) {
      console.error("Error loading representation configuration:", error);
    }
  };

  const handleSelectUri = async (uri: string) => {
    // if the uri is already registered, load the config
    const config = availableConfigs.find((c) => c.uri === uri);
    if (config) {
      setSelectedMetaModel({
        package: {
          uri: config.uri,
          name: config.name,
          elements: [],
        },
      });
      await loadMetaConfig(config.uri);
      await loadRepresentationConfig(config.uri);
    } else {
      setSelectedMetaModel({
        package: {
          uri: uri,
          name: "",
          elements: [],
        },
      });
    }
  };

  const handleNotationTypeChange = (e: SelectChangeEvent<string>) => {
    /* setSelectedNotationType(value);
    setCurrentNotation({
      ...currentNotation,
      type: value,
    }); */
  };

  const handleAddAttribute = () => {
    setCurrentNotationElement({
      ...currentNotationElement,
      attributes: [...currentNotationElement.attributes!, newAttribute],
    });
    setNewAttribute({
      name: "",
      defaultValue: "",
      attributeType: { name: "String" },
      isUnique: undefined,
    });
  };

  const handleAddReference = () => {
    /* setCurrentNotation({
      ...currentNotation,
      references: [...currentNotation.references!, newReference],
    });
    setNewReference({
      id: "",
      name: "",
      eReferenceType: undefined,
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
          handleSelectUri={handleSelectUri}
          currentNotationElementRepresentation={
            currentNotationElementRepresentation
          }
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          handleAddAttribute={handleAddAttribute}
          newAttribute={newAttribute}
          setNewAttribute={setNewAttribute}
          handleAddReference={handleAddReference}
          newReference={newReference}
          setNewReference={setNewReference}
          availableConfigs={availableConfigs}
          selectedMetaModel={selectedMetaModel}
          setSelectedMetaModel={setSelectedMetaModel}
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
