// NOTATION DESIGNER

import { EdgeProps } from "@xyflow/react";

export interface Config {
  packageName: string;
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
  properties: Property[];
  description: string;
  graphicalRepresentation: NotationRepresentationItem[];
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
  extent?: {
    width: number;
    height: number;
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
}

export type Alignment = "left" | "center" | "right";

export type Shape = "square" | "line" | "compartment" | "text" | "connector";

export type NotationType = "object" | "relationship" | "role";

export type DataType = "String" | "Collection" | "Package" | "Boolean" | "Text";

export interface Property {
  name: string;
  defaultValue: string | number | boolean | Array<any>;
  dataType: DataType;
  elementType: string;
  isUnique: boolean;
}

// DIAGRAM EDITOR

export interface CustomNodeData {
  notation: Notation;
  position?: Position;
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
