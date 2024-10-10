import {
  Alert,
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import ReferenceHelper from "../helpers/ReferenceHelper";
import ModelHelperFunctions from "../helpers/ModelHelperFunctions";
import CheckIcon from "@mui/icons-material/Check";

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
    border: "1px solid #d3d3d3",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

const selectsStyleMuiSx = {
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d3d3d3",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d3d3d3",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d3d3d3",
  },
};

const listItemsStyle = {
  border: "1px solid #d3d3d3",
  borderRadius: "5px",
  marginBottom: "5px",
};

const listStyle = {
  width: "33%",
};

const configureTextfieldStyle = "w-1/3 2xl:w-[450px]";

const propertyTextfieldStyle = "w-1/6 2xl:w-[200px]";

const seperationBorder = "border-[#1B1B20] border-b-[2px] w-1/3 2xl:w-[450px]";

interface NotationDesignerConfigurePanelProps {
  availableConfigs: ConfigListItem[];
  handleDeleteConfig: (uri: string) => void;
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
  selectedMetaModel: MetaModel;
  setSelectedMetaModel: (value: MetaModel) => void;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setSelectedRepresentationMetaModel: (value: RepresentationMetaModel) => void;
  saveNotation: (selectedElementIndex: number) => void;
}

function NotationDesignerConfigurePanel({
  availableConfigs,
  handleDeleteConfig,
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
  selectedMetaModel,
  setSelectedMetaModel,
  selectedRepresentationMetaModel,
  setSelectedRepresentationMetaModel,
  saveNotation,
}: NotationDesignerConfigurePanelProps) {
  const [selectedElementIndex, setSelectedElementIndex] = useState<number>(-1);

  const isAttributeButtonDisabled = (attribute: Attribute) => {
    return (
      attribute.name === "" ||
      attribute.attributeType.name === "" ||
      attribute.isUnique === undefined
    );
  };

  const isReferenceButtonDisabled = (reference: Reference) => {
    return reference.name === "" || reference.element.$ref === "";
  };

  const handleNotationNameChange = (selectedIndexOrInput: number | string) => {
    // Check if the newInputValue is a number (selected from the dropdown) or just a string (typed in)
    const isExistingNotation =
      typeof selectedIndexOrInput === "number" && selectedIndexOrInput !== null;
    console.log("isExistingNotation", isExistingNotation);

    if (isExistingNotation) {
      // Use the index directly from the Autocomplete's selected option
      const existingNotationIndex = selectedIndexOrInput; // Get the index of the existing notation
      const existingNotation = selectedMetaModel.package.elements[
        existingNotationIndex
      ] as Class;
      const existingNotationRepresentation = selectedRepresentationMetaModel
        .package.elements[existingNotationIndex] as Representation;

      // Update the current notation element and its representation
      setCurrentNotationElement(existingNotation);
      setCurrentNotationElementRepresentation(existingNotationRepresentation);
    } else {
      // If it's a new notation (typed by the user), proceed to initialize a new notation
      const newNotationElementRepresentation: Representation = {
        name: selectedIndexOrInput,
        type: "None",
        graphicalRepresentation: [],
      };

      // Add the new element at the end of the representation array
      const indexRef = selectedRepresentationMetaModel.package.elements.length;

      // Update the state with the new notation element and its representation
      setCurrentNotationElementRepresentation(newNotationElementRepresentation);

      setCurrentNotationElement({
        ...currentNotationElement,
        isAbstract: false,
        isInterface: false,
        attributes: [],
        references: [],
        name: selectedIndexOrInput, // Set the name as the typed value
        representation: {
          $ref: `${selectedMetaModel.package.uri}-representation#/elements/${indexRef}`,
        },
      });

      // Reset the new attribute and reference inputs
      setNewAttribute({
        name: "",
        attributeType: { name: "" },
        defaultValue: "",
        isUnique: undefined,
      });

      setNewReference({
        name: "",
        element: { $ref: "" },
      });
    }
  };

  return (
    <div className="px-12 pb-24">
      <div className={seperationBorder + " mb-2"}>
        <h2 className="text-lg text-white bg-[#1B1B20] w-fit px-3 py-1 rounded-t-sm">
          Configure Panel
        </h2>
      </div>

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

        {/* Delete configuration */}
        {selectedMetaModel.package.uri &&
          availableConfigs.find(
            (config) => config.uri === selectedMetaModel.package.uri // exists in the backend?
          ) && (
            <div
              className={`bg-[#9b0f0f] px-4 py-2 w-fit rounded-md items-center flex gap-x-[6px] text-white text-xs cursor-pointer hover:opacity-85 trransition duration-300 ease-in-out float-left`}
              onClick={() => handleDeleteConfig(selectedMetaModel.package.uri)}
            >
              Delete selected configuration
              <DeleteIcon
                style={{ width: "15px", height: "15px", objectFit: "contain" }}
              />
            </div>
          )}

        {/* Element Name */}
        <div className={seperationBorder + " mt-2"}>
          <h3 className="text-lg text-white bg-[#1B1B20] w-fit px-3 py-1 rounded-t-sm">
            Element
          </h3>
        </div>
        <Autocomplete
          className={configureTextfieldStyle}
          freeSolo
          options={
            (Array.isArray(selectedMetaModel.package.elements) &&
              (selectedMetaModel.package.elements as Class[]).map(
                (notation, index) => {
                  const notationReference = notation.references.find(
                    (r) => r.name === "type"
                  )?.element.$ref;

                  let notationReferencing = null;
                  if (notationReference !== undefined) {
                    notationReferencing = ReferenceHelper.resolveRef(
                      selectedMetaModel.package,
                      notationReference
                    ) as Class;
                  }

                  return {
                    label: notation.name, // Displayed name in the dropdown
                    referencing: notationReferencing
                      ? notationReferencing.name
                      : "", // Display additional reference info
                    index: index, // Store the index as value
                    key: `${notation.name}-${index}`, // Ensure unique key
                  };
                }
              )) ||
            []
          } // List of existing notation names
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label!
          }
          renderOption={(props, option) => (
            <li {...props} key={option.key}>
              {option.label}{" "}
              {option.referencing !== "" &&
                "(target: " + option.referencing + ")"}
            </li>
          )}
          value={currentNotationElement ? currentNotationElement.name : ""}
          onInputChange={(event, newInputValue) => {
            if (newInputValue) {
              handleNotationNameChange(newInputValue);
            }
          }}
          onChange={(event, newValue) => {
            const index =
              typeof newValue === "string" ? newValue : newValue?.index!;
            if (typeof index === "number") {
              setSelectedElementIndex(index);
            }
            handleNotationNameChange(index);
          }} // handle change on select
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
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="ClassNode">Node</MenuItem>
            <MenuItem value="ClassEdge">Edge</MenuItem>
          </Select>
        </FormControl>

        {/* Is abstract and Is interface checkbox */}
        <FormControl className={configureTextfieldStyle}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  style={{
                    color: "#1B1B20",
                  }}
                  sx={{
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  checked={currentNotationElement.isAbstract}
                  onChange={(e) =>
                    setCurrentNotationElement({
                      ...currentNotationElement,
                      isAbstract: e.target.checked,
                    })
                  }
                />
              }
              label="Is abstract?"
            />
            <FormControlLabel
              control={
                <Checkbox
                  style={{
                    color: "#1B1B20",
                  }}
                  sx={{
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  checked={currentNotationElement.isInterface}
                  onChange={(e) =>
                    setCurrentNotationElement({
                      ...currentNotationElement,
                      isInterface: e.target.checked,
                    })
                  }
                />
              }
              label="Is interface?"
            />
          </FormGroup>
        </FormControl>

        {/* Delete selected notation element */}
        {currentNotationElement.name &&
          selectedMetaModel.package.elements.length > 0 &&
          selectedMetaModel.package.elements[
            selectedMetaModel.package.elements.indexOf(currentNotationElement)
          ] && (
            <div
              className={`bg-[#9b0f0f] px-4 py-2 w-fit rounded-md items-center flex gap-x-[6px] text-white text-xs cursor-pointer hover:opacity-85 trransition duration-300 ease-in-out float-left`}
              onClick={() =>
                setSelectedMetaModel({
                  package: {
                    ...selectedMetaModel.package,
                    elements: selectedMetaModel.package.elements.filter(
                      (n) => n.name !== currentNotationElement.name
                    ),
                  },
                })
              }
            >
              Delete selected element
              <DeleteIcon
                style={{ width: "15px", height: "15px", objectFit: "contain" }}
              />
            </div>
          )}

        {/* Attributes Section */}
        <h3 className="text-lg mt-2">Element Attributes</h3>
        {currentNotationElement.attributes!.length > 0 && (
          <List style={listStyle}>
            {currentNotationElement.attributes!.map((prop, index) => {
              const attribute = prop as Attribute;
              return (
                <ListItem key={index} style={listItemsStyle}>
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
                          attributes: currentNotationElement.attributes!.filter(
                            (_, i) => i !== index
                          ),
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
          <Select
            className={propertyTextfieldStyle}
            sx={selectsStyleMuiSx}
            value={newAttribute.attributeType.name}
            onChange={(e) =>
              setNewAttribute({
                ...newAttribute,
                attributeType: { name: e.target.value },
              })
            }
            displayEmpty
          >
            <MenuItem value="" disabled style={{ display: "none" }}>
              Data Type
            </MenuItem>
            <MenuItem value="String">String</MenuItem>
            <MenuItem value="Integer">Integer</MenuItem>
            <MenuItem value="Boolean">Boolean</MenuItem>
          </Select>
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
        {currentNotationElement.references!.length > 0 &&
          selectedMetaModel.package.elements.length > 0 && (
            <List style={listStyle}>
              {currentNotationElement.references!.map((prop, index) => {
                const reference = prop as Reference;
                return (
                  <ListItem key={index} style={listItemsStyle}>
                    <ListItemText
                      primary={`${reference.name} (${
                        (
                          ReferenceHelper.resolveRef(
                            selectedMetaModel.package,
                            reference.element.$ref
                          ) as Class
                        ).name
                      })`}
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
          <Autocomplete
            className={propertyTextfieldStyle}
            freeSolo
            options={["superType", "type", "opposite", "reference"]} // List of existing notation names
            value={newReference.name}
            onInputChange={(event, newInputValue) => {
              setNewReference({ ...newReference, name: newInputValue });
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
            value={newReference.element.$ref.split("/").pop()}
            onChange={(e) =>
              setNewReference({
                ...newReference,
                element: { $ref: "#/elements/" + e.target.value },
              })
            }
            displayEmpty
          >
            <MenuItem value="" disabled style={{ display: "none" }}>
              References
            </MenuItem>
            {Array.isArray(selectedMetaModel.package.elements) &&
              (selectedMetaModel.package.elements as Class[]).map(
                (element, index) => {
                  const elementReferencing = ReferenceHelper.resolveRef(
                    selectedMetaModel.package,
                    element.references.find((r) => r.name === "type")?.element
                      .$ref!
                  ) as Class;

                  return (
                    <MenuItem key={index} value={index}>
                      {element.name}{" "}
                      {elementReferencing &&
                        "(target: " + elementReferencing.name + ")"}
                    </MenuItem>
                  );
                }
              )}
          </Select>
          <IconButton
            onClick={handleAddReference}
            disabled={isReferenceButtonDisabled(newReference)}
            style={{
              opacity: isReferenceButtonDisabled(newReference) ? 0.5 : 1,
              cursor: isReferenceButtonDisabled(newReference)
                ? "not-allowed"
                : "",
            }}
            size="small"
            id="icon-button"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </div>

        {/* <h3 className="text-xl font-bold">Roles</h3> */}
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

        <div className="relative max-w-xl">
          <div className={"border-[#1B1B20] border-b-[2px] w-full mt-2"}>
            <h3 className="text-lg text-white bg-[#1B1B20] w-fit px-3 py-1 rounded-t-sm">
              Current notation elements
            </h3>
          </div>
          {/* <input
            type="text"
            className="border-[1px] border-solid border-[#C8C8C8] rounded-md w-60 h-[38px] px-[16px] py-2 text-[#595959]"
            placeholder="Search..."
          /> */}
          <NotationsSlider
            settings={notationsSliderSettings}
            selectedMetaModel={selectedMetaModel}
            selectedRepresentationMetaModel={selectedRepresentationMetaModel}
            setCurrentNotationElement={setCurrentNotationElement}
          />
        </div>

        {/* Save button */}
        <button
          onClick={() => saveNotation(selectedElementIndex)}
          className="bg-[#1B1B20] px-4 py-2 w-fit rounded-md text-white cursor-pointer hover:opacity-85 trransition duration-300 ease-in-out float-left mt-4"
        >
          <span className="text-[16px]">Save Notation</span>
        </button>
      </div>
    </div>
  );
}

export default NotationDesignerConfigurePanel;
