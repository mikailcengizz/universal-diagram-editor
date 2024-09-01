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
import { Notation, Property } from "../types/types";

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
    <>
      {/* Notation type selection */}
      <FormControl>
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
        label="Package Name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Notation Name */}
      <TextField
        label="Notation Name"
        value={currentNotation.name}
        onChange={(e) =>
          setCurrentNotation({ ...currentNotation, name: e.target.value })
        }
        fullWidth
        margin="normal"
      />

      {/* Description */}
      <TextField
        label="Description"
        value={currentNotation.description}
        onChange={(e) =>
          setCurrentNotation({
            ...currentNotation,
            description: e.target.value,
          })
        }
        fullWidth
        margin="normal"
        multiline
      />

      {/* Properties Section */}
      <h3>Properties</h3>
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
      <div className="flex">
        <TextField
          label="Property Name"
          value={newProperty.name}
          onChange={(e) =>
            setNewProperty({ ...newProperty, name: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Data Type"
          value={newProperty.dataType}
          onChange={(e) =>
            setNewProperty({ ...newProperty, dataType: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <IconButton onClick={handleAddProperty}>
          <AddIcon />
        </IconButton>
      </div>

      {/* Save and export buttons */}
      <button onClick={saveNotation}>Save Notation</button>
      <button onClick={exportConfig}>Export Configuration</button>
    </>
  );
}

export default NotationDesignerConfigurePanel;
