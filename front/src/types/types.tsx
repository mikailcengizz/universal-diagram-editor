import { EdgeProps } from "@xyflow/react";

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
export interface DiagramObject {
  // Old name: InstanceNotation
  id: string;
  name: string;
  type?: string;
  attributes?: Array<{ type: any; value: any }>;
  links?: Array<{ type: any; id: string }>;
  graphicalRepresentation?: NotationRepresentationItem[];
}

export interface Notation {
  metaModel?: MetaModel;
  graphicalRepresentation?: NotationRepresentationItem[];
}

export interface CustomNodeData {
  notation: Notation;
  diagramObject: DiagramObject; // Old name: InstanceNotation
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

// ECORE META MODEL
export interface MetaModel {
  packages: Package[];
}

export interface Package extends NamedElement {
  uri: string;
  elements: Classifier[];
}

export abstract class NamedElement {
  name: string | undefined;
}

export abstract class TypedElement extends NamedElement {
  type?: Classifier;
  lowerBound?: number | "infinite";
  upperBound?: number | "infinite";
  isUnique?: boolean;
  isDerived?: boolean;
  defaultValue?: any;
}

export abstract class Classifier extends NamedElement {}

export interface Class extends Classifier {
  isAbstract: boolean;
  isInterface: boolean;
  attributes: Attribute[];
  references: Reference[];
}

export interface DataType extends Classifier {
  // represents data types like String, int, etc.
}

export interface Attribute extends NamedElement {
  attributeType: DataType;
}

export interface Reference extends NamedElement {
  referenceType: Class;
  isComposition?: boolean;
  opposite?: Reference;
}

// INSTANCE MODEL
export interface InstanceModel {
  uri: string;
  objects: InstanceObject[];
}

export interface InstanceObject {
  name: string;
  type: Class; // type (class) of this object, referencing the meta model definition
  attributes: AttributeValue[];
  links: ReferenceValue[];
}

export interface AttributeValue {
  name: string; // name of the attribute (from the meta model)
  value: any; // value assigned to the attribute
}

export interface ReferenceValue {
  name: string; // reference name (as defined in the meta model)
  target: InstanceObject; // object being referenced
}

// REPRESENTATION META MODEL
export interface RepresentationMetaModel {
  uri: string;
  representations: Representation[];
}

export interface Representation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
}

// REPRESENTATION INSTANCE
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
