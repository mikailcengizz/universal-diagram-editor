// NOTATION DESIGNER

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
}

export type NotationCategory = "classifier" | "feature" | "relation";

export interface StyleProperties {
  border: Array<Property>;
  general: Array<Property>;
  other: Array<Property>;
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
