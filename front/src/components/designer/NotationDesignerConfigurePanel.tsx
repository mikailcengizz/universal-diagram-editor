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
  Config,
  ConfigListItem,
  Notation,
  Notations,
  Property,
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
  currentNotation: Notation;
  setCurrentNotation: (value: any) => void;
  newProperty: Property;
  setNewProperty: (value: any) => void;
  handleAddProperty: () => void;
  availableConfigs: ConfigListItem[];
  selectedConfig: Config;
  setSelectedConfig: (value: Config) => void;
  notations: Notations;
  allNotations: Notation[];
  saveNotation: () => void;
}

function NotationDesignerConfigurePanel({
  selectedNotationType,
  handleNotationTypeChange,
  currentNotation,
  setCurrentNotation,
  newProperty,
  setNewProperty,
  handleAddProperty,
  availableConfigs,
  selectedConfig,
  setSelectedConfig,
  notations,
  allNotations,
  saveNotation,
}: NotationDesignerConfigurePanelProps) {
  return (
    <div className="px-12 pb-24">
      <h2 className="text-xl font-bold mb-2">Configure Panel</h2>

      <div className="flex flex-col gap-y-2">
        {/* Configuration name */}
        <Autocomplete
          className={configureTextfieldStyle}
          freeSolo
          options={availableConfigs.map(
            (availableConfig) => availableConfig?.name
          )} // List of existing configuration names
          value={selectedConfig.name}
          onInputChange={(event, newInputValue) => {
            setSelectedConfig({
              name: newInputValue,
              notations: { objects: [], relationships: [], roles: [] },
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
        <FormControl className={configureTextfieldStyle}>
          <Select
            value={currentNotation.type || ""}
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
        </FormControl>

        {/* Notation Name */}
        <Autocomplete
          className={configureTextfieldStyle}
          freeSolo
          options={
            currentNotation.type === "object"
              ? selectedConfig.notations.objects.map(
                  (notation) => notation?.name
                )
              : currentNotation.type === "relationship"
              ? selectedConfig.notations.relationships.map(
                  (notation) => notation?.name
                )
              : selectedConfig.notations.roles.map((notation) => notation?.name)
          } // List of existing notation names
          value={currentNotation.name}
          onInputChange={(event, newInputValue) => {
            const newNotation = allNotations.find(
              (n) => n.name === newInputValue
            );
            if (newNotation) {
              setCurrentNotation(newNotation);
            } else {
              setCurrentNotation({
                ...currentNotation,
                name: newInputValue,
              });
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              className={configureTextfieldStyle}
              placeholder="Notation Name"
            />
          )}
        />

        {/* Description */}
        <textarea
          id="configure-notation-input"
          className={configureTextfieldStyle}
          placeholder="Description"
          value={currentNotation.description}
          onChange={(e) =>
            setCurrentNotation({
              ...currentNotation,
              description: e.target.value,
            })
          }
        />

        {/* Properties Section */}
        <h3>Properties</h3>
        {currentNotation.properties!.length > 0 && (
          <List>
            {currentNotation.properties!.map((prop, index) => (
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
                        properties: currentNotation.properties!.filter(
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
              setNewProperty({ ...newProperty, dataType: e.target.value })
            }
          />
          <TextField
            className={propertyTextfieldStyle}
            placeholder="Default Value"
            value={newProperty.defaultValue}
            onChange={(e) =>
              setNewProperty({ ...newProperty, defaultValue: e.target.value })
            }
          />
          <TextField
            className={propertyTextfieldStyle}
            placeholder="Element Type"
            value={newProperty.elementType}
            onChange={(e) =>
              setNewProperty({ ...newProperty, elementType: e.target.value })
            }
          />
          <Select
            className={propertyTextfieldStyle}
            value={newProperty.isUnique || ""}
            onChange={(e) =>
              setNewProperty({ ...newProperty, isUnique: e.target.value })
            }
            displayEmpty
          >
            <MenuItem value="" disabled>
              Unique
            </MenuItem>
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
          <IconButton onClick={handleAddProperty} size="small" id="icon-button">
            <AddIcon fontSize="small" />
          </IconButton>
        </div>

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
            notations={notations}
            allNotations={allNotations}
            setCurrentNotation={setCurrentNotation}
          />
        </div>
      </div>
    </div>
  );
}

export default NotationDesignerConfigurePanel;
