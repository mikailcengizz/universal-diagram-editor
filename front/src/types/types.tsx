import { EdgeProps } from "@xyflow/react";

// ECORE INSTANCE MODEL
export interface Instance {
  uri: string;
  objects: InstanceObject[];
}

export interface InstanceObject {
  id: string;
  name: string;
  type: string;
  attributes: { [key: string]: string }[];
  references: { name: string; id: string }[];
}

// REPRESENTATION INSTANCE MODEL
export interface RepresentationInstance {
  uri: string;
  objects: RepresentationInstanceObject[];
}

export interface RepresentationInstanceObject {
  id: string;
  referenceMetaInstanceId: string;
  name: string;
  position?: Position; // only for classifiers and packages
  graphicalRepresentation?: NotationRepresentationItem[];
}

// NOTATION DESIGNER
export interface Marker {
  id: string;
  description: string;
  svgDefinition: string;
}

export interface NotationRepresentationItem {
  shape: Shape;
  marker?: string;
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

export type lineStyle = "solid" | "dotted" | "dashed";

export interface StyleProperties {
  color?: string;
  fontSize?: number;
  alignment?: Alignment;
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  borderRadius?: number;
  lineWidth?: number;
  lineStyle?: lineStyle;
  pattern?: Pattern;
  zIndex?: number;
}

export type Pattern = "dotted" | "dashed" | "solid";

export type Alignment = "left" | "center" | "right";

export type Shape =
  | "square"
  | "compartment"
  | "text"
  | "connector"
  | "marker"
  | "line"
  | "doubleLine";

export type NotationType =
  | "Package"
  | "Class"
  | "Attribute"
  | "Reference"
  | "Operation"
  | "Parameter";

// DIAGRAM EDITOR
export interface InstanceNotation {
  id: string;
  name: string;
  interface?: boolean;
  abstract?: boolean;
  type?: NotationType;
  classifiers?: ClassifierInstance[];
  attributes?: Array<AttributeInstance | { attributeId: string }>;
  references?: Array<{ type: string; referenceId: string }>;
  operations?: Array<{ operationId: string }>;
  graphicalRepresentation?: NotationRepresentationItem[];
}

export interface MetaNotation {
  name: string;
  type?: NotationType;
  classifiers?: Classifier[];
  attributes?: Attribute[];
  references?: Reference[];
  operations?: Operation[];
  graphicalRepresentation?: NotationRepresentationItem[];
}

export interface CustomNodeData {
  metaNotations: MetaNotation[];
  instanceNotation: InstanceNotation;
  position?: Position;
  isPalette?: boolean;
  isNotationSlider?: boolean; // only used for slider item width
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
  notation: InstanceNotation;
  notationType: NotationType;
}

// ECORE MODEL
export interface MetaModel {
  uri: string;
  classes: Class[];
}

export abstract class NamedElement {
  name: string | undefined;
}

export abstract class TypedElement extends NamedElement {
  type?: Classifier;
  lowerBound?: string;
  upperBound?: string;
  isUnique?: boolean;
  isDerived?: boolean;
  defaultValue?: any;
}

export abstract class Classifier extends NamedElement {}

export interface Package extends NamedElement {}

export interface Class extends Classifier {
  isAbstract: boolean;
  isInterface: boolean;
  attributes: Attribute[];
  operations: Operation[];
  references: Reference[];
}

export interface DataType extends Classifier {
  // represents data types like String, int, etc. and also Classifer types
}

export interface Attribute extends TypedElement {
  attributeType?: DataType;
}

export interface Reference extends TypedElement {
  isComposition?: boolean;
  opposite?: Reference;
}

export interface TypedElement extends NamedElement {
  type?: Classifier;
}

export interface Operation extends TypedElement {
  parameters?: Parameter[];
}

export interface Parameter extends TypedElement {
  operation?: Operation;
}

// NEW REPRESENTATION MODEL - START
export interface RepresentationMetaModel {
  uri: string;
  representations: Representation[];
}

export interface Representation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
}

// NEW REPRESENTATION MODEL - END
