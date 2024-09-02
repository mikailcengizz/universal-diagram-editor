import {
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Notation, Property } from "../../types/types";

interface NotationDesignerConfigurePanelProps {
  selectedNotationType: string;
  handleNotationTypeChange: (e: SelectChangeEvent<string>) => void;
  packageName: string;
  setPackageName: (value: string) => void;
  currentNotation: Notation;
  setCurrentNotation: (value: any) => void;
  newProperty: Property;
  setNewProperty: (value: any) => void;
  handleAddProperty: () => void;
  saveNotation: () => void;
  exportConfig: () => void;
}

function NotationDesignerConfigurePanel({
  selectedNotationType,
  handleNotationTypeChange,
  packageName,
  setPackageName,
  currentNotation,
  setCurrentNotation,
  newProperty,
  setNewProperty,
  handleAddProperty,
  saveNotation,
  exportConfig,
}: NotationDesignerConfigurePanelProps) {
  return (
    <div className="px-12 pt-4">
      <h2 className="text-xl font-bold">Configure Panel</h2>
      <br />
      {/* Notation type selection */}
      <FormControl className="w-1/3">
        <InputLabel>Select Category</InputLabel>
        <Select
          value={selectedNotationType || ""}
          onChange={handleNotationTypeChange}
        >
          <MenuItem value="object">Object</MenuItem>
          <MenuItem value="relationship">Relationship</MenuItem>
          <MenuItem value="role">Role</MenuItem>
        </Select>
      </FormControl>

      {/* Package name */}
      <TextField
        className="w-1/3"
        label="Package Name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
      />

      {/* Notation Name */}
      <TextField
        className="w-1/3"
        label="Notation Name"
        value={currentNotation.name}
        onChange={(e) =>
          setCurrentNotation({ ...currentNotation, name: e.target.value })
        }
      />

      {/* Description */}
      <TextField
        className="w-1/3"
        label="Description"
        value={currentNotation.description}
        onChange={(e) =>
          setCurrentNotation({
            ...currentNotation,
            description: e.target.value,
          })
        }
        multiline
      />
      <br />

      {/* Properties Section */}
      <h3>Properties</h3>
      {currentNotation.properties.length > 0 && (
        <List>
          {currentNotation.properties.map((prop, index) => (
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
                      properties: currentNotation.properties.filter(
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
      <div className="flex">
        <TextField
          className="w-1/3"
          label="Property Name"
          value={newProperty.name}
          onChange={(e) =>
            setNewProperty({ ...newProperty, name: e.target.value })
          }
        />
        <TextField
          className="w-1/3"
          label="Data Type"
          value={newProperty.dataType}
          onChange={(e) =>
            setNewProperty({ ...newProperty, dataType: e.target.value })
          }
        />
        <IconButton onClick={handleAddProperty} size="small">
          <AddIcon fontSize="small" />
        </IconButton>
      </div>

      {/* Save and export buttons */}
      <button onClick={saveNotation}>Save Notation</button>
      <button onClick={exportConfig}>Export Configuration</button>
    </div>
  );
}

export default NotationDesignerConfigurePanel;
