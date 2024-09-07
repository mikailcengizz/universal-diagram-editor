// NOTATION DESIGNER

import { EdgeProps } from "@xyflow/react";

export interface Config {
  name: string;
  notations: Notations;
}

// New Notations structure to accommodate classifiers, features, and relations
export interface Notations {
  objects: Notation[];
  relationships: Notation[];
  roles: Notation[];
}

export interface Notation {
  name: string;
  type: NotationType;
  properties?: Property[];
  description?: string;
  graphicalRepresentation?: NotationRepresentationItem[];
}

export interface NotationRepresentationItem {
  shape: Shape;
  text?: string;
  generator?: string | null;
  style: StyleProperties;
  position: Position;
}

export interface Position {
  x: number;
  y: number;
  targetX?: number; // optional for edges
  targetY?: number; // optional for edges
  extent?: {
    width: number;
    height?: number; // optional for edges
  };
}

export interface StyleProperties {
  color?: string;
  fontSize?: number;
  alignment?: Alignment;
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  borderRadius?: number;
  zIndex?: number;
}

export type Alignment = "left" | "center" | "right";

export type Shape = "square" | "line" | "compartment" | "text" | "connector";

export type NotationType = "object" | "relationship" | "role" | "";

export type DataType = "String" | "Collection" | "Package" | "Boolean" | "Text";

export interface Property {
  name: string;
  defaultValue: string | number | boolean | Array<any>;
  dataType: DataType;
  elementType: string;
  isUnique: boolean;
}

export interface Attribute {
  name: string;
  dataType: string;
  defaultValue: string;
  multiplicity: string;
  visibility: string;
  unique: boolean;
  derived: boolean;
  constraints: string;
}

export interface Operation {
  name: string;
  parameters: Parameter[];
  returnType: string;
  preconditions: string;
  postconditions: string;
  body: string;
  visibility: string;
}

export interface Parameter {
  name: string;
  dataType: string;
  defaultValue: string;
}

// DIAGRAM EDITOR

export interface CustomNodeData {
  notations: Notations;
  nodeNotation: Notation;
  position?: Position;
  onDoubleClick?: (id: any, data: any) => void;
}

export interface CustomEdgeProps extends EdgeProps {
  data: {
    onEdgeClick?: () => void;
    type: string;
    [key: string]: any; // Allow for additional properties if necessary
  };
}

// used to list config in dropdowns
export interface ConfigListItem {
  name: string;
  filename: string;
}

// PALETTE
export interface DragData {
  notation: Notation;
  notationType: NotationType;
}
