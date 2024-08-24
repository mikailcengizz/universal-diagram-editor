// NOTATION DESIGNER

import { EdgeProps } from "@xyflow/react";

export interface Config {
  name: string;
  notations: Notations;
}

// New Notations structure to accommodate classifiers, features, and relations
export interface Notations {
  classifiers: Notation[];
  features: Notation[];
  relations: Notation[];
}

export interface Notation {
  category: NotationCategory | null;
  styleProperties: StyleProperties;
  semanticProperties: Array<SemanticProperty>;
  compartments?: Notation[];
}

export type NotationCategory = "classifier" | "feature" | "relation";

export interface StyleProperties {
  border: Array<Property> | null;
  general: Array<Property> | null;
  other: Array<Property> | null;
}

export interface Property {
  name: string;
  default: string | number;
}

export interface SemanticProperty {
  name: string;
  default: string;
}

// MAPPING
export type Mapping = { shape: Shape; metamodel: string };

// DIAGRAM EDITOR

export interface CustomNodeData {
  label: string;
  notation: Notation;
  features: Notation[];
  relations: Notation[];
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

// SHAPE
export type Shape =
  | "rectangle"
  | "circle"
  | "arrow"
  | "dot"
  | "label"
  | "compartment";
