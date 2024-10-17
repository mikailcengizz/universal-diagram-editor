import React, { useEffect, useState } from "react";
import {
  Class,
  DiagramNodeData,
  Marker,
  MetaModel,
  NotationRepresentationItem,
  Representation,
  RepresentationMetaModel,
  Shape,
  StyleProperties,
} from "../../types/types";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import CombineLinkShapesNode from "../notation_representations/edges/CombineLinkShapesNode";
import { HexColorPicker } from "react-colorful";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ColorLensIcon from "@mui/icons-material/ColorLens";

interface NotationDesignerDrawEdgeProps {
  currentNotationElementRepresentation: Representation;
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  currentNotationElement: Class;
  setCurrentNotationElement: (value: Class) => void;
  selectedMetaModel: MetaModel;
  setSelectedMetaModel: (value: MetaModel) => void;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setSelectedRepresentationMetaModel: (value: RepresentationMetaModel) => void;
}

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

const configureTextfieldStyle = "w-1/3 2xl:w-[450px]";

const seperationBorder = "border-[#1B1B20] border-b-[2px] w-1/3 2xl:w-[450px]";

function NotationDesignerDrawEdge({
  currentNotationElementRepresentation,
  setCurrentNotationElementRepresentation,
  currentNotationElement,
  setCurrentNotationElement,
  selectedMetaModel,
  setSelectedMetaModel,
  selectedRepresentationMetaModel,
  setSelectedRepresentationMetaModel,
}: NotationDesignerDrawEdgeProps) {
  const [lineColorPickerEl, setLineColorPickerEl] = useState(null);
  const [sourceMarkerColorPickerEl, setSourceMarkerColorPickerEl] =
    useState(null);
  const [targetMarkerColorPickerEl, setTargetMarkerColorPickerEl] =
    useState(null);

  const lineColorPickerOpen = Boolean(lineColorPickerEl);
  const lineColorPickerId = lineColorPickerOpen
    ? "line-color-picker-popover"
    : undefined;

  const sourceMarkerColorPickerOpen = Boolean(sourceMarkerColorPickerEl);
  const sourceMarkerColorPickerId = sourceMarkerColorPickerOpen
    ? "source-marker-color-picker-popover"
    : undefined;

  const targetMarkerColorPickerOpen = Boolean(targetMarkerColorPickerEl);
  const targetMarkerColorPickerId = targetMarkerColorPickerOpen
    ? "target-marker-color-picker-popover"
    : undefined;

  const [selectedShape, setSelectedShape] = useState<Shape>(
    currentNotationElementRepresentation.graphicalRepresentation?.length ===
      0 ||
      currentNotationElementRepresentation.graphicalRepresentation![0].shape ===
        undefined
      ? "line"
      : currentNotationElementRepresentation.graphicalRepresentation![0].shape!
  );
  const [selectedStyle, setSelectedStyle] = useState<StyleProperties>(
    currentNotationElementRepresentation.graphicalRepresentation?.length ===
      0 ||
      currentNotationElementRepresentation.graphicalRepresentation![0].style ===
        undefined
      ? {
          color: "#000000",
          width: 1,
          lineStyle: "solid",
        }
      : currentNotationElementRepresentation.graphicalRepresentation![0].style!
  );
  const [selectedMarkers, setSelectedMarkers] = useState<Marker[]>(
    currentNotationElementRepresentation.graphicalRepresentation?.length ===
      0 ||
      currentNotationElementRepresentation.graphicalRepresentation![0]
        .markers === undefined
      ? [
          {
            type: "openArrow",
            style: {
              color: "#000000",
              width: 10,
            },
          },
          {
            type: "openArrow",
            style: {
              color: "#000000",
              width: 10,
            },
          },
        ]
      : currentNotationElementRepresentation.graphicalRepresentation![0]
          .markers!
  );
  const [data, setData] = useState<DiagramNodeData>({
    notation: {
      metaModel: selectedMetaModel,
      representationMetaModel: selectedRepresentationMetaModel,
    },
    notationElement: currentNotationElement,
    notationElementRepresentation: {
      ...currentNotationElementRepresentation,
      graphicalRepresentation: [
        {
          shape: selectedShape,
          style: selectedStyle,
          markers: selectedMarkers,
          position: {
            x: 0,
            y: 0,
          },
        },
      ],
    },
    instanceObject: undefined,
    isDesignerPreview: true,
  });

  // UseEffect to update the current notation element representation when the props change
  useEffect(() => {
    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      graphicalRepresentation: [
        {
          shape: selectedShape,
          style: selectedStyle,
          markers: selectedMarkers,
          position: {
            x: 0,
            y: 0,
          },
        },
      ],
    });
  }, [selectedShape, selectedStyle, selectedMarkers]);

  // there can always only be one graphical representation item on an edge
  const handleShapeChange = (e: any) => {
    const newShape = e.target.value as Shape;

    setSelectedShape(newShape);
    let updatedData = { ...data };
    updatedData.notationElementRepresentation!.graphicalRepresentation![0].shape =
      newShape;
    setData(updatedData); // Force re-render
  };

  const handleStyleChange = (e: any, targetName: string) => {
    const styleName = targetName as "color" | "width" | "lineStyle";
    const newStyle = styleName === "color" ? e : e.target.value;

    // create a new style object to ensure React re-renders
    const updatedStyle = {
      ...selectedStyle,
      [styleName]: newStyle,
    };

    setSelectedStyle(updatedStyle);
    let updatedData = { ...data };
    updatedData.notationElementRepresentation!.graphicalRepresentation![0].style =
      updatedStyle;
    setData(updatedData); // Force re-render
  };

  const handleMarkerTypeChange = (e: any) => {
    const newMarker = e.target.value;
    const markerName = e.target.name as "sourceMarker" | "targetMarker";
    const markerIndex = markerName === "sourceMarker" ? 0 : 1;

    const updatedMarkers = [...selectedMarkers];
    updatedMarkers[markerIndex] = {
      ...selectedMarkers[markerIndex],
      type: newMarker,
    };

    setSelectedMarkers(updatedMarkers);
    let updatedData = { ...data };
    updatedData.notationElementRepresentation!.graphicalRepresentation![0].markers =
      updatedMarkers;
    setData(updatedData); // Force re-render
  };

  const handleMarkersStyleChange = (
    e: any,
    targetName: string,
    markerName: string
  ) => {
    const styleName = targetName as "color" | "width";
    const newStyle = styleName === "color" ? e : +e.target.value;
    const markerIndex = markerName === "source" ? 0 : 1;

    const updatedMarkers = [...selectedMarkers];
    updatedMarkers[markerIndex].style = {
      ...selectedMarkers[markerIndex].style,
      [styleName]: newStyle,
    };

    setSelectedMarkers(updatedMarkers);
    let updatedData = { ...data };
    updatedData.notationElementRepresentation!.graphicalRepresentation![0].markers =
      updatedMarkers;
    setData(updatedData); // Force re-render
  };

  return (
    <div className="px-12 pb-24 w-full flex flex-row">
      <div className="w-1/2 flex flex-col gap-y-2">
        <div className={seperationBorder + " mb-2"}>
          <h2 className="text-lg text-white bg-[#1B1B20] w-fit px-3 py-1 rounded-t-sm">
            Design Edge
          </h2>
        </div>

        <h3 className="font-bold text-lg">Line</h3>
        {/* Shape selection */}
        <FormControl className={configureTextfieldStyle}>
          <Select
            sx={selectsStyleMuiSx}
            value={selectedShape}
            onChange={(e) => handleShapeChange(e)}
            displayEmpty
          >
            <MenuItem value="" disabled style={{ display: "none" }}>
              Select Edge Shape
            </MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="doubleLine">Double Line</MenuItem>
          </Select>
        </FormControl>

        {/* Edge style */}
        {/* Color */}
        <TextField
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={(e: any) => setLineColorPickerEl(e.currentTarget)}
                >
                  <ColorLensIcon style={{ color: selectedStyle.color }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className={configureTextfieldStyle}
          sx={textFieldsStyleMuiSx}
          placeholder="Color"
          value={selectedStyle.color}
          name="color"
          onClick={(e: any) => setLineColorPickerEl(e.currentTarget)}
          onChange={(e) => handleStyleChange(e, "color")}
        />

        {/* Popover for color picker */}
        <Popover
          id={lineColorPickerId}
          open={lineColorPickerOpen}
          anchorEl={lineColorPickerEl}
          onClose={() => setLineColorPickerEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <HexColorPicker
            color={selectedStyle.color}
            onChange={(e) => handleStyleChange(e, "color")}
          />
        </Popover>

        {/* Line width */}
        <TextField
          className={configureTextfieldStyle}
          sx={textFieldsStyleMuiSx}
          placeholder="Edge Width"
          value={selectedStyle.width}
          name="width"
          onChange={(e) => handleStyleChange(e, "width")}
        />

        {/* Line style */}
        <FormControl className={configureTextfieldStyle}>
          <Select
            sx={selectsStyleMuiSx}
            value={selectedStyle.lineStyle}
            onChange={(e) => handleStyleChange(e, "lineStyle")}
            displayEmpty
            name="lineStyle"
          >
            <MenuItem value="" disabled style={{ display: "none" }}>
              Select Edge Style
            </MenuItem>
            <MenuItem value="solid">Solid</MenuItem>
            <MenuItem value="dotted">Dotted</MenuItem>
            <MenuItem value="dashed">Dashed</MenuItem>
          </Select>
        </FormControl>

        <h3 className="font-bold text-lg">Markers</h3>
        {/* Edge markers */}
        {/* Source marker select */}
        <h3>Source marker</h3>
        {/* Source marker type */}
        <FormControl className={configureTextfieldStyle}>
          <Select
            sx={selectsStyleMuiSx}
            value={selectedMarkers[0]?.type}
            onChange={(e) => handleMarkerTypeChange(e)}
            displayEmpty
            name="sourceMarker"
          >
            <MenuItem value="" disabled style={{ display: "none" }}>
              Select Source Marker
            </MenuItem>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="openArrow">Open Arrow</MenuItem>
            <MenuItem value="closedArrow">Closed Arrow</MenuItem>
          </Select>
        </FormControl>
        {/* Source marker style */}
        {/* Source marker color */}
        <TextField
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={(e: any) =>
                    setSourceMarkerColorPickerEl(e.currentTarget)
                  }
                >
                  <ColorLensIcon
                    style={{ color: selectedMarkers[0]?.style?.color }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className={configureTextfieldStyle}
          sx={textFieldsStyleMuiSx}
          placeholder="Color"
          value={selectedMarkers[0]?.style?.color}
          name="color"
          onClick={(e: any) => setSourceMarkerColorPickerEl(e.currentTarget)}
        />
        {/* Popover for color picker */}
        <Popover
          id={sourceMarkerColorPickerId}
          open={sourceMarkerColorPickerOpen}
          anchorEl={sourceMarkerColorPickerEl}
          onClose={() => setSourceMarkerColorPickerEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <HexColorPicker
            color={selectedMarkers[0]?.style?.color}
            onChange={(e) => handleMarkersStyleChange(e, "color", "source")}
          />
        </Popover>

        {/* Source marker width */}
        <TextField
          className={configureTextfieldStyle}
          sx={textFieldsStyleMuiSx}
          placeholder="Width"
          value={selectedMarkers[0]?.style?.width}
          name="width"
          type="number"
          onChange={(e) => handleMarkersStyleChange(e, "width", "source")}
        />

        {/* Target marker select */}
        <h3>Target marker</h3>
        {/* Target marker type */}
        <FormControl className={configureTextfieldStyle}>
          <Select
            sx={selectsStyleMuiSx}
            value={selectedMarkers[1]?.type}
            onChange={(e) => handleMarkerTypeChange(e)}
            displayEmpty
            name="targetMarker"
          >
            <MenuItem value="" disabled style={{ display: "none" }}>
              Select Target Marker
            </MenuItem>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="openArrow">Open Arrow</MenuItem>
            <MenuItem value="closedArrow">Closed Arrow</MenuItem>
          </Select>
        </FormControl>
        {/* Target marker style */}
        {/* Target marker color */}
        <TextField
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={(e: any) =>
                    setTargetMarkerColorPickerEl(e.currentTarget)
                  }
                >
                  <ColorLensIcon
                    style={{ color: selectedMarkers[1]?.style?.color }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className={configureTextfieldStyle}
          sx={textFieldsStyleMuiSx}
          placeholder="Color"
          value={selectedMarkers[1]?.style?.color}
          name="color"
          onClick={(e: any) => setTargetMarkerColorPickerEl(e.currentTarget)}
        />
        {/* Popover for color picker */}
        <Popover
          id={targetMarkerColorPickerId}
          open={targetMarkerColorPickerOpen}
          anchorEl={targetMarkerColorPickerEl}
          onClose={() => setTargetMarkerColorPickerEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <HexColorPicker
            color={selectedMarkers[1]?.style?.color}
            onChange={(e) => handleMarkersStyleChange(e, "color", "target")}
          />
        </Popover>

        {/* Target marker width */}
        <TextField
          className={configureTextfieldStyle}
          sx={textFieldsStyleMuiSx}
          placeholder="Width"
          value={selectedMarkers[1]?.style?.width}
          name="width"
          type="number"
          onChange={(e) => handleMarkersStyleChange(e, "width", "target")}
        />
      </div>

      {/* Preview Edge */}
      <div className="w-1/2">
        <div className={seperationBorder + " mb-2"}>
          <h2 className="text-lg text-white bg-[#1B1B20] w-fit px-3 py-1 rounded-t-sm">
            Preview Edge
          </h2>
        </div>
        <div className="ml-20 mt-16">
          <CombineLinkShapesNode
            id="edge"
            data={data}
            sourceX={100}
            sourceY={100}
            targetX={300}
            targetY={300}
          />
        </div>
      </div>
    </div>
  );
}

export default NotationDesignerDrawEdge;
