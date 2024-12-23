import { EdgeProps } from "@xyflow/react";

// NOTATION DESIGNER
export type MarkerType =
  | "openArrow"
  | "closedArrow"
  | "diamond"
  | "circle"
  | "square"
  | "none";

export interface Marker {
  type?: MarkerType;
  style?: StyleProperties;
}

export interface NotationRepresentationItem {
  shape?: Shape;
  markers?: Marker[];
  text?: string | ClassAttributeReference;
  content?: ClassReferenceReference; // for compartments
  style: StyleProperties;
  position: Position;
}

export interface ClassAttributeReference {
  $ref: string; // URI reference to the class attribute
  // e.g. #/elements/0/attributes/0
}

export interface ClassReferenceReference {
  $ref: string; // URI reference to the class reference
  // e.g. #/elements/0/references/0
}

export interface Position {
  x: number; // left top position in draw panel
  y: number; // left top position in draw panel
  targetX?: number; // optional for edges
  targetY?: number; // optional for edges
  extent?: {
    width?: number; // optional for edges
    height?: number; // optional for edges
  };
}

export type LineStyle = "solid" | "dotted" | "dashed";

export interface StyleProperties {
  color?: string;
  fontSize?: number;
  alignment?: Alignment;
  layout?: "horizontal" | "vertical";
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  borderRadius?: number;
  width?: number;
  lineStyle?: LineStyle;
  pattern?: Pattern;
  zIndex?: number;
}

export type Pattern = "dotted" | "dashed" | "solid";

export type Alignment = "left" | "center" | "right" | "top" | "bottom";

export type Shape = NodeShape | EdgeShape;

export type NodeShape =
  | "square"
  | "circle"
  | "compartment"
  | "text"
  | "connector";

export type EdgeShape = "line" | "doubleLine" | "marker";

export interface Notation {
  metaModel: MetaModel;
  representationMetaModel: RepresentationMetaModel;
}

// DIAGRAM EDITOR
export interface DiagramNodeData {
  notation?: Notation; // notation (meta model and representation model)
  notationElement?: Class; // notation element (class) for this node
  notationElementRepresentation?: Representation; // graphical representation of the notation element
  instanceObject?: InstanceObject; // instance object for this node
  instanceObjectRepresentation?: RepresentationInstanceObject; // graphical representation of the instance object
  position?: Position;
  isNotationSlider?: boolean;
  isDesignerPreview?: boolean;
  onDoubleClick?: (id: any, data: any) => void;
}

export interface CustomEdgeProps extends EdgeProps {
  data: {
    onEdgeClick?: () => void;
    type: string;
    [key: string]: any; // allow for additional properties if necessary
  };
}

// used to list config in dropdowns
export interface ConfigListItem {
  name: string;
  filename: string;
  uri: string;
}

// PALETTE
export interface DragData {
  notationElement: Class;
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
  representation: RepresentationReference;
  constraints?: string[];
}

export interface RepresentationReference {
  $ref: string; // URI reference to the representation
}

export interface DataType extends Classifier {
  // represents data types String, int, etc.
}

export interface Attribute extends NamedElement {
  attributeType: DataType;
  defaultValue?: any;
  isUnique?: boolean;
}

export interface Reference extends NamedElement {
  element: ClassReference;
  isComposition?: boolean;
  opposite?: Reference;
}

export interface ClassReference {
  $ref: string; // URI reference to the class
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
  type: ClassReference; // type (class) of this object, $ref to the meta model definition
  attributes: AttributeValue[];
  links: ReferenceValue[];
  representation?: RepresentationInstanceObjectReference; // $ref
}

export interface ClassReference {
  $ref: string; // URI reference to the class
}

export interface RepresentationInstanceObjectReference {
  $ref: string; // URI reference to the representation instance object
}

export interface AttributeValue {
  name: string; // name of the attribute (from the meta model)
  value: any; // value assigned to the attribute
}

export interface ReferenceValue {
  name: string; // reference name (as defined in the meta model)
  target: InstanceObjectReference; // object being referenced
}

export interface InstanceObjectReference {
  $ref: string; // URI reference to the instance object, can be extended with connector reference
  // e.g. #/objects/0/representation/graphicalRepresentation/1
}

// REPRESENTATION META MODEL
export interface RepresentationMetaModel {
  package: RepresentationPackage;
}

export interface RepresentationPackage {
  name: string;
  uri: string;
  elements: Representation[];
}

export type RepresentationType = "ClassNode" | "ClassEdge" | "None";

export interface Representation {
  name: string;
  type: RepresentationType; // we map classes to representation types
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
  name: string;
  type: RepresentationType;
  position?: Position;
  graphicalRepresentation?: NotationRepresentationItem[];
}
