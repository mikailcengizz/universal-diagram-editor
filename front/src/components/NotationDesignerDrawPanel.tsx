import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Notation } from "../types/types";

interface NotationDesignerDrawPanelProps {
  currentNotation: Notation;
  setCurrentNotation: (value: any) => void;
  newGraphicalElement: any;
  setNewGraphicalElement: (value: any) => void;
  handleAddGraphicalElement: () => void;
}

function NotationDesignerDrawPanel({
  currentNotation,
  setCurrentNotation,
  newGraphicalElement,
  setNewGraphicalElement,
  handleAddGraphicalElement,
}: NotationDesignerDrawPanelProps) {
  return (
    <>
      <h3>Graphical Representation</h3>
      <List>
        {currentNotation.graphicalRepresentation.map((element, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${element.shape} at (${element.position.x}, ${element.position.y})`}
              secondary={`Size: ${element.position.extent?.width}x${element.position.extent?.height}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() =>
                  setCurrentNotation({
                    ...currentNotation,
                    graphicalRepresentation:
                      currentNotation.graphicalRepresentation.filter(
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
          label="Shape"
          value={newGraphicalElement.shape}
          onChange={(e) =>
            setNewGraphicalElement({
              ...newGraphicalElement,
              shape: e.target.value,
            })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="X Position"
          type="number"
          value={newGraphicalElement.position.x}
          onChange={(e) =>
            setNewGraphicalElement({
              ...newGraphicalElement,
              position: {
                ...newGraphicalElement.position,
                x: Number(e.target.value),
              },
            })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Y Position"
          type="number"
          value={newGraphicalElement.position.y}
          onChange={(e) =>
            setNewGraphicalElement({
              ...newGraphicalElement,
              position: {
                ...newGraphicalElement.position,
                y: Number(e.target.value),
              },
            })
          }
          fullWidth
          margin="normal"
        />
        <IconButton onClick={handleAddGraphicalElement}>
          <AddIcon />
        </IconButton>
      </div>
    </>
  );
}

export default NotationDesignerDrawPanel;
