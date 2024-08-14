// NOTATION DESIGNER

export interface Config {
  name: string;
  notations: Notation[];
}
export interface Notation {
  id: string;
  name: string;
  label?: string | null;
  shape: Shape;
  style: "solid" | "dashed" | "dotted" | null;
  sourceId: string | null;
  targetId: string | null;
  sections?: Array<{ name: string; default: string }> | null;
  mappings: Array<Mapping>;
  rules?: Record<string, any> | null;
}

export type Shape =
  | "rectangle"
  | "circle"
  | "arrow"
  | "dot"
  | "label"
  | "compartment";

// MAPPING
export type Mapping = { shape: Shape; metamodel: string };

// DIAGRAM EDITOR

// used to list config in dropdowns
export interface ConfigListItem {
  name: string;
  filename: string;
}

export interface GeneralizedNodeData {
  shape: string;
  sections?: Array<{ name: string; default: string }> | null;
  label?: string | null;
  rules?: Record<string, any> | null;
}
