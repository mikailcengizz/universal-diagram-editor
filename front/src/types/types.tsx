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

// EMOF structure should be used when configuring and using languages,
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

export type MultiplicityElement = {
  isOrdered: boolean;
  isUnique: boolean;
  lower: number;
  upper: number;
};

export type Feature = {
  isStatic: boolean;
  isLeaf: boolean;
  isAbstract: boolean;
  isReadOnly: boolean;
  isDerived: boolean;
  isDerivedUnion: boolean;
  isID: boolean;
};

export type Aggregation = {};

export type Association = {
  memberEnd: Property[];
  navigableOwnedEnd: Property;
  ownedEnd: Property;
  isDerived: boolean;
  isDerivedUnion: boolean;
  isID: boolean;
  isLeaf: boolean;
  isReadOnly: boolean;
  isStatic: boolean;
  isUnique: boolean;
  isOrdered: boolean;
  isAbstract: boolean;
  isComposite: boolean;
  isNavigable: boolean;
  isSubstitutable: boolean;
};

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

export type ParameterDirectionKind = {};

export type NamedElement = {
  name: string;
  qualifiedName: string;
  visibility: VisibilityKind;
};

export type PackageableElement = {
  visibility: VisibilityKind;
};

export type VisibilityKind = {};

export type TypedElement = {
  type: Type;
};

export type Comment = {
  body: string;
};

// MAPPING
export type Mapping = { shape: Shape; metamodel: string };

// DIAGRAM EDITOR

// used to list config in dropdowns
export interface ConfigListItem {
  name: string;
  filename: string;
}
