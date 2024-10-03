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

// DIAGRAM EDITOR
export interface Notation {
  metaModel?: MetaModel;
  graphicalRepresentationModel?: NotationRepresentationItem[];
}

export interface DiagramElement {
  id: string;
  notation: Notation;
  objectInstance: InstanceObject; // Old name: InstanceNotation
  graphicalRepresentationInstance?: NotationRepresentationItem[];
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
  notation: InstanceObject;
}

// ECORE MODEL
export interface MetaModel {
  package: Package;
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
  isOrdered?: boolean;
  isDerived?: boolean;
  defaultValue?: any;
}

export abstract class Classifier extends NamedElement {}

export interface Class extends Classifier {
  isAbstract: boolean;
  isInterface: boolean;
  attributes: Attribute[];
  references: Reference[];
  representation?: Representation;
}

export interface DataType extends Classifier {
  // represents data types like String, int, etc.
}

export interface Attribute extends NamedElement {
  attributeType: DataType;
}

export interface Reference extends NamedElement {
  type: Class;
  isComposition?: boolean;
  opposite?: Reference;
}

// INSTANCE MODEL
export interface InstanceModel {
  package: InstancePackage;
}

export interface InstancePackage {
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
  package: RepresentationPackage;
}

export interface RepresentationPackage {
  uri: string;
  elements: Representation[];
}

export interface Representation {
  graphicalRepresentation?: NotationRepresentationItem[];
}

// REPRESENTATION INSTANCE
export interface RepresentationInstanceModel {
  package: RepresentationInstancePackage;
}

export interface RepresentationInstancePackage {
  uri: string;
  objects: RepresentationInstanceObject[];
}

export interface RepresentationInstanceObject {
  name: InstanceObject; // name of the representation (from the meta model)
  position?: Position; // only for classifiers and packages
  graphicalRepresentation?: NotationRepresentationItem[];
}
