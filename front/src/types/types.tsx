// NOTATION DESIGNER

export interface Config {
  name: string;
  notations: Notation[];
}
export interface Notation {
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

// MOF structure should be used when configuring and using languages,
// together with their visual representation types
export type Type = {};

export type Classifier = {
  type: Type;
  isAbstract: boolean;
};

export type Class = {
  classifier: Classifier;
  properties: Property[];
  operations: Operation[];
};

export type Property = {
  aggregation: Aggregation;
  default: string[];
  isComposite: boolean;
  isDerived: boolean;
  structuralFeature: StructuralFeature;
  association: Association;
};

export type StructuralFeature = {
  isReadOnly: boolean;
  feature: Feature;
  typedElement: TypedElement;
  multiplicityElement: MultiplicityElement;
};

export type Association = {};

export type Operation = {
  isOrdered: boolean;
  isUnique: boolean;
  lower: number;
  upper: number;
  parameter: Parameter;
  type: Type;
};

export type Parameter = {
  direction: ParameterDirectionKind;
  multiplicityElement: MultiplicityElement;
  typedElement: TypedElement;
};

// MAPPING
export type Mapping = { shape: Shape; metamodel: string };

// DIAGRAM EDITOR

// used to list config in dropdowns
export interface ConfigListItem {
  name: string;
  filename: string;
}
