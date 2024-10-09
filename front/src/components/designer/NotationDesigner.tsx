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
        name: "",
        uri: "",
        elements: [],
      },
    });

  const [currentNotationElement, setCurrentNotationElement] = useState<Class>({
    name: "",
    isAbstract: false,
    isInterface: false,
    attributes: [],
    references: [],
    representation: {
      $ref: "",
    },
  });
  const [
    currentNotationElementRepresentation,
    setCurrentNotationElementRepresentation,
  ] = useState<Representation>({
    name: "",
    type: "None",
    graphicalRepresentation: [],
  });

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
    class: {
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

  const deleteConfig = async (uri: string) => {
    try {
      await configService.deleteConfig(encodeURIComponent(uri));
    } catch (error) {
      console.error("Error deleting configuration:", error);
    }
  };

  const handleSelectUri = async (uri: string) => {
    // always reset current notation element
    setCurrentNotationElement({
      name: "",
      isAbstract: false,
      isInterface: false,
      attributes: [],
      references: [],
      representation: {
        $ref: "",
      },
    });
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
      setSelectedRepresentationMetaModel({
        package: {
          name: config.name + " Representation",
          uri: config.uri + "-representation",
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
      setSelectedRepresentationMetaModel({
        package: {
          name: "",
          uri: uri + "-representation",
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
    const updatedElements = [...selectedMetaModel.package.elements];

    // Make sure the current notation is also in the updated elements
    const currentNotationElementIndex = updatedElements.findIndex(
      (element) => element.name === currentNotationElement.name
    );

    if (
      currentNotationElementIndex === -1 &&
      currentNotationElement.name !== ""
    ) {
      updatedElements.push(currentNotationElement);
    } else {
      updatedElements[currentNotationElementIndex] = currentNotationElement;
    }

    const updatedMetaModel = {
      package: {
        ...selectedMetaModel.package,
        uri: selectedMetaModel.package.uri,
        elements: updatedElements,
      },
    };

    setSelectedMetaModel(updatedMetaModel);

    // Save meta model in the backend
    console.log("saving meta config", updatedMetaModel);
    const saveConfig = async () => {
      try {
        await configService.saveMetaConfig(updatedMetaModel);
      } catch (error) {
        console.error("Error saving configuration:", error);
      }
    };
    saveConfig();

    const updatedRepresentationElements = [
      ...selectedRepresentationMetaModel.package.elements,
    ];

    // Make sure the current notation representation is also in the updated elements
    const currentNotationElementRepresentationIndex =
      updatedRepresentationElements.findIndex(
        (element) => element.name === currentNotationElementRepresentation.name
      );

    if (currentNotationElementRepresentationIndex === -1) {
      updatedRepresentationElements.push(currentNotationElementRepresentation);
    } else {
      updatedRepresentationElements[currentNotationElementRepresentationIndex] =
        currentNotationElementRepresentation;
    }

    const updatedRepresentationMetaModelURI =
      selectedRepresentationMetaModel.package.uri === ""
        ? selectedMetaModel.package.uri + "representation"
        : selectedRepresentationMetaModel.package.uri;
    const updatedRepresentationMetaModel = {
      package: {
        name: selectedMetaModel.package.name! + " Representation",
        uri: updatedRepresentationMetaModelURI,
        elements: updatedRepresentationElements,
      },
    };

    setSelectedRepresentationMetaModel(updatedRepresentationMetaModel);

    // Save representation in the backend
    console.log("saving representation config", updatedRepresentationMetaModel);
    const saveRepresentationConfig = async () => {
      try {
        await configService.saveRepresentationConfig(
          updatedRepresentationMetaModel
        );
      } catch (error) {
        console.error("Error saving representation configuration:", error);
      }
    };
    saveRepresentationConfig();
  };

  const handleDeleteConfig = (uri: string) => {
    deleteConfig(uri);
    setAvailableConfigs(availableConfigs.filter((c) => c.uri !== uri));
    setSelectedMetaModel({
      package: {
        name: "",
        uri: "",
        elements: [],
      },
    });
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
          availableConfigs={availableConfigs}
          handleDeleteConfig={handleDeleteConfig}
          handleSelectUri={handleSelectUri}
          currentNotationElementRepresentation={
            currentNotationElementRepresentation
          }
          setCurrentNotationElementRepresentation={
            setCurrentNotationElementRepresentation
          }
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          handleAddAttribute={handleAddAttribute}
          newAttribute={newAttribute}
          setNewAttribute={setNewAttribute}
          handleAddReference={handleAddReference}
          newReference={newReference}
          setNewReference={setNewReference}
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
