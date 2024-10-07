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

const configureTextfieldStyle = "w-1/3 2xl:w-[350px]";

const propertyTextfieldStyle = "w-1/6 2xl:w-[250px]";

interface NotationDesignerConfigurePanelProps {
  selectedNotationType: string;
  handleNotationTypeChange: (e: SelectChangeEvent<string>) => void;
  currentNotationElementRepresentation: Representation; // updates automatically
  currentNotationElement: Class;
  setCurrentNotationElement: (value: Class) => void;
  handleAddAttribute: (value: any) => void;
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
  selectedNotationType,
  handleNotationTypeChange,
  currentNotationElementRepresentation,
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
          onInputChange={(event, newInputValue) => {
            setSelectedMetaModel({
              package: {
                ...selectedMetaModel.package,
                uri: newInputValue,
                elements: [],
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              className={configureTextfieldStyle}
              placeholder="Configuration URI"
            />
          )}
        />

        {/* Configuration name */}
        <Autocomplete
          className={configureTextfieldStyle}
          freeSolo
          options={availableConfigs.map(
            (availableConfig) => availableConfig?.name
          )} // List of existing configuration names
          value={selectedMetaModel.package.name}
          onInputChange={(event, newInputValue) => {
            setSelectedMetaModel({
              package: {
                ...selectedMetaModel.package,
                name: newInputValue,
                elements: [],
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              className={configureTextfieldStyle}
              placeholder="Configuration Name"
            />
          )}
        />

        {/* Notation type selection */}
        {/* <FormControl className={configureTextfieldStyle}>
          <Select
            value={currentDiagramNode.type || ""}
            onChange={handleNotationTypeChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Notation Type
            </MenuItem>
            <MenuItem value="object">Object</MenuItem>
            <MenuItem value="relationship">Relationship</MenuItem>
            <MenuItem value="role">Role</MenuItem>
          </Select>
        </FormControl> */}

        {/* Notation Name */}
        <Autocomplete
          className={configureTextfieldStyle}
          freeSolo
          options={
            selectedMetaModel.package.elements.map(
              (notation) => notation.name
            ) || []
          } // List of existing notation names
          value={currentNotationElement?.name}
          onInputChange={(event, newInputValue) => {
            const newNotation = selectedMetaModel.package.elements.find(
              (n) => n.name === newInputValue
            );
            if (newNotation) {
              setCurrentNotationElement(newNotation);
            } else {
              setCurrentNotationElement({
                ...currentNotationElement,
                name: newInputValue,
              });
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              className={configureTextfieldStyle}
              placeholder="Class Name"
            />
          )}
        />

        {/* Attributes Section */}
        <h3 className="text-xl font-bold mt-2">Attributes</h3>
        {currentNotationElement.attributes!.length > 0 && (
          <List>
            {(selectedMetaModel.package.elements[0] as Class).attributes!.map(
              (prop, index) => {
                const attribute = prop as Attribute;
                return (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${attribute.name} (${attribute.attributeType})`}
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
              }
            )}
          </List>
        )}
        <div className="flex items-center gap-x-2">
          <TextField
            className={propertyTextfieldStyle}
            placeholder="Attribute Name"
            value={newAttribute.name}
            onChange={(e) =>
              setNewAttribute({ ...newAttribute, name: e.target.value })
            }
          />
          <TextField
            className={propertyTextfieldStyle}
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
            placeholder="Default Value"
            value={newAttribute.defaultValue}
            onChange={(e) =>
              setNewAttribute({ ...newAttribute, defaultValue: e.target.value })
            }
          />
          <Select
            className={propertyTextfieldStyle}
            value={newAttribute.isUnique || ""}
            onChange={(e) =>
              setNewAttribute({
                ...newAttribute,
                isUnique: e.target.value as boolean,
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
            onClick={handleAddAttribute}
            size="small"
            id="icon-button"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </div>

        {/* References section */}
        <h3 className="text-xl font-bold mt-2">References</h3>
        <div className="flex items-center gap-x-2">
          <Autocomplete
            className={propertyTextfieldStyle}
            freeSolo
            options={["type", "opposite"]} // List of existing notation names
            value={currentNotationElement?.references![0].name}
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
                placeholder="Reference Name"
              />
            )}
          />
          <Select
            className={propertyTextfieldStyle}
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
            {selectedMetaModel.package.elements.map((element, index) => {
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
                  <MenuItem key={index} value={element.name}>
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
