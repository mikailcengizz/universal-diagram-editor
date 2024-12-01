export type Callback = (error: Error | null, success?: any) => void;

export type ModelFileType = "representation" | "meta";

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
  borderRadius?: number;
  zIndex?: number;
}

export type Alignment = "left" | "center" | "right";

export type Shape = "square" | "line" | "compartment" | "text" | "connector";

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
  isAbstract?: boolean;
  isInterface?: boolean;
  attributes?: Attribute[];
  references?: Reference[];
  representation?: RepresentationReference;
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
  $ref: string; // URI reference to the instance object
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

export type RepresentationType = "ClassNode" | "ClassEdge";

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
