import {
  Autocomplete,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  ConfigListItem,
  Attribute,
  Package,
  MetaModel,
  Class,
  Representation,
  RepresentationMetaModel,
  Reference,
  RepresentationType,
} from "../../types/types";
import NotationsSlider from "../ui_elements/NotationsSlider";

var notationsSliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
};

const textFieldsStyleMuiSx = {
  "& .MuiOutlinedInput-root": {
    border: "1px solid red",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

const selectsStyleMuiSx = {
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "red",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "red",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "red",
  },
};

// #d3d3d3

const configureTextfieldStyle = "w-1/3 2xl:w-[450px]";

const propertyTextfieldStyle = "w-1/6 2xl:w-[200px]";

interface NotationDesignerConfigurePanelProps {
  handleSelectUri: (selectedUri: string) => void;
  currentNotationElementRepresentation: Representation; // updates automatically
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  currentNotationElement: Class;
  setCurrentNotationElement: (value: Class) => void;
  handleAddAttribute: () => void;
  newAttribute: Attribute;
  setNewAttribute: (value: Attribute) => void;
  handleAddReference: () => void;
  newReference: Reference;
  setNewReference: (value: Reference) => void;
  availableConfigs: ConfigListItem[];
  selectedMetaModel: MetaModel;
  setSelectedMetaModel: (value: MetaModel) => void;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setSelectedRepresentationMetaModel: (value: RepresentationMetaModel) => void;
  saveNotation: () => void;
}

function NotationDesignerConfigurePanel({
  handleSelectUri,
  currentNotationElementRepresentation,
  setCurrentNotationElementRepresentation,
  currentNotationElement,
  setCurrentNotationElement,
  handleAddAttribute,
  newAttribute,
  setNewAttribute,
  newReference,
  setNewReference,
  handleAddReference,
  availableConfigs,
  selectedMetaModel,
  setSelectedMetaModel,
  selectedRepresentationMetaModel,
  setSelectedRepresentationMetaModel,
  saveNotation,
}: NotationDesignerConfigurePanelProps) {
  const isAttributeButtonDisabled = (attribute: Attribute) => {
    return (
      attribute.name === "" ||
      attribute.attributeType.name === "" ||
      attribute.isUnique === undefined
    );
  };

  const isReferenceButtonDisabled = (reference: Reference) => {
    return reference.name === "" || reference.type.$ref === "";
  };

  const handleNotationNameChange = (newInputValue: string) => {
    const newNotation = selectedMetaModel.package.elements.find(
      (n) => n.name === newInputValue
    );
    if (newNotation) {
      setCurrentNotationElement(newNotation);
    } else {
      // initialize notation element's representation in representation meta model and establish ref
      const newNotationElementRepresentation = {
        name: newInputValue,
        type: currentNotationElementRepresentation.type || "ClassNode",
        graphicalRepresentation: [],
      };
      const indexRef = selectedRepresentationMetaModel.package.elements.length;
      setCurrentNotationElementRepresentation(newNotationElementRepresentation);

      setCurrentNotationElement({
        ...currentNotationElement,
        name: newInputValue,
        representation: {
          $ref: `${
            selectedMetaModel.package.uri + "-representation"
          }#/elements/${indexRef}`,
        },
      });
    }
  };

  return (
    <div className="px-12 pb-24">
      <h2 className="text-xl font-bold mb-2">Configure Panel</h2>

      <div className="flex flex-col gap-y-2">
        {/* Configuration uri */}
        <Autocomplete
          className={configureTextfieldStyle}
          freeSolo
          options={availableConfigs.map(
            (availableConfig) => availableConfig?.uri
          )} // List of existing configuration URIs
          value={selectedMetaModel.package.uri}
          onInputChange={(event, selectedUri: string) => {
            handleSelectUri(selectedUri);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              className={configureTextfieldStyle}
              sx={textFieldsStyleMuiSx}
              placeholder="Configuration URI"
            />
          )}
        />

        {/* Configuration name */}
        <TextField
          className={configureTextfieldStyle}
          sx={textFieldsStyleMuiSx}
          placeholder="Notation Name"
          value={selectedMetaModel.package.name}
          onChange={(e) =>
            setSelectedMetaModel({
              package: {
                ...selectedMetaModel.package,
                name: e.target.value,
                elements: [],
              },
            })
          }
        />

        {/* Element Name */}
        <h3 className="text-lg mt-2">Element</h3>
        <Autocomplete
          className={configureTextfieldStyle}
          freeSolo
          options={
            (Array.isArray(selectedMetaModel.package.elements) &&
              selectedMetaModel.package.elements.map((notation, index) => ({
                name: notation.name,
                key: `${notation.name}-${index}`, // Ensures unique key
              }))) ||
            []
          } // List of existing notation names
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name!
          }
          renderOption={(props, option) => (
            <li {...props} key={option.key}>
              {" "}
              {/* Use the unique `id` as the key */}
              {option.name}
            </li>
          )}
          value={currentNotationElement?.name}
          onInputChange={(event, newInputValue) =>
            handleNotationNameChange(newInputValue)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              className={configureTextfieldStyle}
              sx={textFieldsStyleMuiSx}
              placeholder="Name"
            />
          )}
        />

        {/* Element type selection */}
        <FormControl className={configureTextfieldStyle}>
          <Select
            sx={selectsStyleMuiSx}
            value={currentNotationElementRepresentation.type}
            onChange={(e) => {
              const value = e.target.value as RepresentationType;
              setCurrentNotationElementRepresentation({
                ...currentNotationElementRepresentation,
                type: value,
              });
            }}
            displayEmpty
          >
            <MenuItem value="" disabled style={{ display: "none" }}>
              Select Notation Type
            </MenuItem>
            <MenuItem value="ClassNode">Node</MenuItem>
            <MenuItem value="ClassEdge">Edge</MenuItem>
          </Select>
        </FormControl>

        {/* Attributes Section */}
        <h3 className="text-lg mt-2">Element Attributes</h3>
        {currentNotationElement.attributes!.length > 0 && (
          <List style={{ width: "40%" }}>
            {currentNotationElement.attributes!.map((prop, index) => {
              const attribute = prop as Attribute;
              return (
                <ListItem key={index} style={{ border: "" }}>
                  <ListItemText
                    primary={`${attribute.name} (${attribute.attributeType.name})`}
                    secondary={attribute.defaultValue?.toString() || ""}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setCurrentNotationElement({
                          ...currentNotationElement,
                          /* properties: (
                              selectedMetaModel.package.elements[0] as Class
                            ).attributes!.filter((_, i) => i !== index), */
                        })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
        <div className="flex items-center gap-x-2">
          <TextField
            className={propertyTextfieldStyle}
            sx={textFieldsStyleMuiSx}
            placeholder="Attribute Name"
            value={newAttribute.name}
            onChange={(e) =>
              setNewAttribute({ ...newAttribute, name: e.target.value })
            }
          />
          <TextField
            className={propertyTextfieldStyle}
            sx={textFieldsStyleMuiSx}
            placeholder="Data Type"
            value={newAttribute.attributeType.name}
            onChange={(e) =>
              setNewAttribute({
                ...newAttribute,
                attributeType: { name: e.target.value },
              })
            }
          />
          <TextField
            className={propertyTextfieldStyle}
            sx={textFieldsStyleMuiSx}
            placeholder="Default Value"
            value={newAttribute.defaultValue}
            onChange={(e) =>
              setNewAttribute({ ...newAttribute, defaultValue: e.target.value })
            }
          />
          <Select
            className={propertyTextfieldStyle}
            sx={selectsStyleMuiSx}
            value={
              newAttribute.isUnique !== undefined
                ? newAttribute.isUnique.toString()
                : ""
            }
            onChange={(e) => {
              const value = e.target.value === "true";
              setNewAttribute({ ...newAttribute, isUnique: value });
            }}
            displayEmpty
          >
            <MenuItem value="" disabled style={{ display: "none" }}>
              Unique
            </MenuItem>
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
          <IconButton
            onClick={handleAddAttribute}
            disabled={isAttributeButtonDisabled(newAttribute)}
            style={{
              opacity: isAttributeButtonDisabled(newAttribute) ? 0.5 : 1,
              cursor: isAttributeButtonDisabled(newAttribute)
                ? "not-allowed"
                : "",
            }}
            size="small"
            id="icon-button"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </div>

        {/* References section */}
        <h3 className="text-lg mt-2">Element References</h3>
        <div className="flex items-center gap-x-2">
          <Autocomplete
            className={propertyTextfieldStyle}
            freeSolo
            options={["type", "opposite"]} // List of existing notation names
            value={newReference.name}
            onInputChange={(event, newInputValue) => {
              const newNotationReference =
                (selectedMetaModel.package.elements.find(
                  (n) => n.name === newInputValue
                ) as Class)!.references!.find(
                  (reference) => reference.name === newInputValue
                );
              if (newNotationReference) {
                setCurrentNotationElement({
                  ...currentNotationElement,
                  references: [newNotationReference],
                });
              } else {
                setCurrentNotationElement({
                  ...currentNotationElement,
                  references: [
                    {
                      name: newInputValue,
                      type: {
                        $ref: "",
                      },
                    },
                  ],
                });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                className={configureTextfieldStyle}
                sx={textFieldsStyleMuiSx}
                placeholder="Reference Name"
              />
            )}
          />
          <Select
            className={propertyTextfieldStyle}
            sx={selectsStyleMuiSx}
            value={newReference.type.$ref || ""}
            onChange={(e) =>
              setNewReference({
                ...newReference,
                type: { $ref: e.target.value },
              })
            }
            displayEmpty
          >
            <MenuItem value="" disabled>
              References
            </MenuItem>
            {Array.isArray(selectedMetaModel.package.elements) &&
              selectedMetaModel.package.elements.map((element, index) => {
                const currentNotationElementIndex =
                  selectedMetaModel.package.elements.indexOf(
                    currentNotationElement
                  );
                // not possible to reference itself, unless it is a reference
                if (
                  currentNotationElementIndex !== index ||
                  element.name === "Reference"
                ) {
                  return (
                    <MenuItem key={index} value={index}>
                      {element.name}
                    </MenuItem>
                  );
                }
              })}
          </Select>
          <IconButton
            onClick={handleAddReference}
            size="small"
            id="icon-button"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </div>

        <h3 className="text-xl font-bold">Roles</h3>
        {/* Roles section */}
        {/* {currentNotation.type === "EClass" &&
          currentNotation.roles?.map((role) => {
            if (role.name === "Source") {
              return (
                // Source role properties
                <>
                  <h3 className="font-bold">Source Role Marker</h3>
                  <select
                    className="w-1/6 2xl:w-[250px] border-black border-2 rounded-md"
                    name="sourceMarker"
                    value={
                      currentNotation.roles![0].graphicalRepresentation![0]
                        .marker
                    }
                    onChange={(e) => {
                      setCurrentNotation({
                        ...currentNotation,
                        roles: currentNotation.roles!.map((r) =>
                          r.name === role.name
                            ? {
                                ...r,
                                graphicalRepresentation: {
                                  ...r.graphicalRepresentation!,
                                  marker: e.target.value,
                                },
                              }
                            : r
                        ),
                      });
                    }}
                  >
                    <option value="ArrowClosed">Arrow Closed</option>
                    <option value="ArrowOpen">Arrow Open</option>
                  </select>
                  <h3 className="font-bold">Source Role Properties</h3>
                  {role.properties!.length > 0 && (
                    <List>
                      {role.properties!.map((prop, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${prop.name} (${prop.dataType})`}
                            secondary={prop.defaultValue?.toString() || ""}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() =>
                                setCurrentNotation({
                                  ...currentNotation,
                                  properties:
                                    currentNotation.properties!.filter(
                                      (_, i) => i !== index
                                    ),
                                })
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                  <div className="flex items-center gap-x-2">
                    <TextField
                      className={propertyTextfieldStyle}
                      placeholder="Property Name"
                      value={newProperty.name}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, name: e.target.value })
                      }
                    />
                    <TextField
                      className={propertyTextfieldStyle}
                      placeholder="Data Type"
                      value={newProperty.dataType}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          dataType: e.target.value,
                        })
                      }
                    />
                    <TextField
                      className={propertyTextfieldStyle}
                      placeholder="Default Value"
                      value={newProperty.defaultValue}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          defaultValue: e.target.value,
                        })
                      }
                    />
                    <TextField
                      className={propertyTextfieldStyle}
                      placeholder="Element Type"
                      value={newProperty.elementType}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          elementType: e.target.value,
                        })
                      }
                    />
                    <Select
                      className={propertyTextfieldStyle}
                      value={newProperty.isUnique || ""}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          isUnique: e.target.value,
                        })
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Unique
                      </MenuItem>
                      <MenuItem value="true">True</MenuItem>
                      <MenuItem value="false">False</MenuItem>
                    </Select>
                    <IconButton
                      onClick={handleAddProperty}
                      size="small"
                      id="icon-button"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>
                </>
              );
            } else {
              return (
                // Target role properties
                <>
                  <h3 className="font-bold">Target Role Marker</h3>
                  <select
                    className="w-1/6 2xl:w-[250px] border-black border-2 rounded-md"
                    name="targetMarker"
                    onChange={(e) => {
                      setCurrentNotation({
                        ...currentNotation,
                        roles: currentNotation.roles!.map((r) =>
                          r.name === role.name
                            ? {
                                ...r,
                                graphicalRepresentation: {
                                  ...r.graphicalRepresentation!,
                                  marker: e.target.value,
                                },
                              }
                            : r
                        ),
                      });
                    }}
                  >
                    <option value="ArrowClosed">Arrow Closed</option>
                    <option value="ArrowOpen">Arrow Open</option>
                  </select>
                  <h3 className="font-bold">Target Role Properties</h3>
                  {role.properties!.length > 0 && (
                    <List>
                      {role.properties!.map((prop, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${prop.name} (${prop.dataType})`}
                            secondary={prop.defaultValue?.toString() || ""}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() =>
                                setCurrentNotation({
                                  ...currentNotation,
                                  properties:
                                    currentNotation.properties!.filter(
                                      (_, i) => i !== index
                                    ),
                                })
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                  <div className="flex items-center gap-x-2">
                    <TextField
                      className={propertyTextfieldStyle}
                      placeholder="Property Name"
                      value={newProperty.name}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, name: e.target.value })
                      }
                    />
                    <TextField
                      className={propertyTextfieldStyle}
                      placeholder="Data Type"
                      value={newProperty.dataType}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          dataType: e.target.value,
                        })
                      }
                    />
                    <TextField
                      className={propertyTextfieldStyle}
                      placeholder="Default Value"
                      value={newProperty.defaultValue}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          defaultValue: e.target.value,
                        })
                      }
                    />
                    <TextField
                      className={propertyTextfieldStyle}
                      placeholder="Element Type"
                      value={newProperty.elementType}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          elementType: e.target.value,
                        })
                      }
                    />
                    <Select
                      className={propertyTextfieldStyle}
                      value={newProperty.isUnique || ""}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          isUnique: e.target.value,
                        })
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Unique
                      </MenuItem>
                      <MenuItem value="true">True</MenuItem>
                      <MenuItem value="false">False</MenuItem>
                    </Select>
                    <IconButton
                      onClick={handleAddProperty}
                      size="small"
                      id="icon-button"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>
                </>
              );
            }
          })} */}

        {/* Save and export buttons */}
        <button
          onClick={saveNotation}
          className="bg-[#1B1B20] px-4 py-2 w-fit rounded-md text-white cursor-pointer hover:opacity-85 trransition duration-300 ease-in-out float-left mt-4"
        >
          <span className="text-sm">Save Notation</span>
        </button>

        <div className="relative max-w-xl">
          <h3 className="text-lg font-bold mt-8">Current Notations</h3>
          <input
            type="text"
            className="border-[1px] border-solid border-[#C8C8C8] rounded-md w-60 h-[38px] px-[16px] py-2 text-[#595959]"
            placeholder="Search..."
          />
          <NotationsSlider
            settings={notationsSliderSettings}
            selectedMetaModel={selectedMetaModel}
            selectedRepresentationMetaModel={selectedRepresentationMetaModel}
            setCurrentNotationElement={setCurrentNotationElement}
          />
        </div>
      </div>
    </div>
  );
}

export default NotationDesignerConfigurePanel;
