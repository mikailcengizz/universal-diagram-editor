import { EdgeProps } from "@xyflow/react";

// ECORE INSTANCE MODEL
export interface MetaInstanceModelFile {
  name: string;
  type: ModelFileType;
  ePackages: EPackageInstance[];
}

export interface EPackageInstance {
  id: string;
  name: string;
  eClassifiers: EClassInstance[];
  eSubpackages: EPackageInstance[];
}

export interface EClassInstance {
  id: string;
  name: string;
  abstract?: boolean;
  interface?: boolean;
  eSuperTypes?: EClassInstance[];
  eAttributes?: EAttributeInstance[];
  eReferences?: EReferenceInstance[];
  eOperations?: EOperationInstance[];
}

export interface EAttributeInstance {
  id: string;
  [key: string]: any;
}

export interface EReferenceInstance {
  id: string;
  name: string;
  eReferenceType?: EClassInstance;
}

export interface EOperationInstance {
  name: string;
  eParameters?: EParameterInstance[];
  eType?: EClassInstance;
}

export interface EParameterInstance {
  name: string;
  eType?: EClassInstance;
}

export interface EDataTypeInstance {
  name: string;
}

// REPRESENTATION INSTANCE MODEL
export interface RepresentationInstanceModelFile {
  name: string;
  type: ModelFileType;
  ePackages: EPackageRepresentationInstance[];
}

export interface EPackageRepresentationInstance {
  id: string;
  referenceMetaId: string;
  name: string;
  position: Position;
  graphicalRepresentation?: NotationRepresentationItem[];
  eClassifiers: EClassRepresentationInstance[];
  eSubpackages: EPackageRepresentationInstance[];
}

export interface EClassRepresentationInstance {
  id: string;
  referenceMetaId: string;
  name: string;
  position: Position;
  graphicalRepresentation?: NotationRepresentationItem[];
  eAttributes: EAttributeRepresentationInstance[];
  eReferences: EReferenceRepresentationInstance[];
  eOperations?: EOperationRepresentationInstance[];
}

export interface EAttributeRepresentationInstance {
  id: string;
  referenceMetaId: string;
  name: string;
}

export interface EReferenceRepresentationInstance {
  id: string;
  referenceMetaId: string;
  name: string;
}

export interface EOperationRepresentationInstance {
  id: string;
  referenceMetaId: string;
  name: string;
  eParameters?: EParameterRepresentationInstance[];
}

export interface EParameterRepresentationInstance {
  id: string;
  referenceMetaId: string;
  name: string;
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

export type DataType = "String" | "Collection" | "Package" | "Boolean" | "Text";

export type NotationType =
  | "EPackage"
  | "EClass"
  | "EAttribute"
  | "EReference"
  | "EOperation"
  | "EParameter";

// DIAGRAM EDITOR
export interface InstanceNotation {
  id: string;
  name: string;
  interface?: boolean;
  abstract?: boolean;
  type?: NotationType;
  eSuperTypes?: EClassInstance[];
  eSubpackages?: EPackageInstance[];
  eClassifiers?: EClassInstance[];
  eAttributes?: EAttributeInstance[];
  eReferences?: EReferenceInstance[];
  eOperations?: EOperationInstance[];
  graphicalRepresentation?: NotationRepresentationItem[];
}

export interface MetaNotation {
  name: string;
  type?: NotationType;
  subpackages?: Package[];
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

export type ModelFileType =
  | "meta"
  | "meta-instance"
  | "representation"
  | "representation-instance";

// NEW EMF ECORE MODEL - START
export interface MetaModelFile {
  name: string;
  type: ModelFileType;
  packages: Package[];
  classifiers: Classifier[];
  relations: Array<Reference>;
  features: Array<Attribute | Operation | Parameter>;
}

export abstract class NamedElement {
  name: string | undefined;
}

export interface Package extends NamedElement {
  references: Reference[];
  //attributes?: Attribute[]; in reality they need attributes as we model it as a class diagram
  //operations?: Operation[]; in reality they need operations as we model it as a class diagram
}

export interface Classifier extends NamedElement {
  package?: Package;
  attributes?: Attribute[];
  //operations?: Operation[]; in reality they need operations as we model it as a class diagram
  references?: Reference[];
}

export interface EDataType extends Classifier {
  // represents data types like EString, EInt, etc. and also Classifer types
}

export abstract class TypedElement extends NamedElement {
  type?: Classifier;
  references?: Reference[];
  attributes?: Attribute[];
  //operations?: Operation[]; in reality they need operations as we model it as a class diagram
  lowerBound?: string; // string because it can be "infinite"
  upperBound?: string;
  isUnique?: boolean;
  isDerived?: boolean;
  defaultValue?: any;
  defaultValueLiteral?: string;
}

export interface Attribute extends TypedElement {
  attributeType?: DataType;
}

export interface Reference extends TypedElement {
  containment?: boolean;
  composite?: boolean;
  opposite?: Reference;
  referenceType?: Classifier;
}

export interface TypedElement extends NamedElement {
  type?: Classifier;
}

export interface Operation extends TypedElement {
  parameters?: Parameter[];
}

export interface Parameter extends TypedElement {}

// NEW EMF ECORE MODEL - END

// NEW REPRESENTATION MODEL - START
export interface RepresentationModelFile {
  name: string;
  type: ModelFileType;
  packages: Representation[];
  classifiers: Representation[];
  relations: Representation[];
  features: Representation[];
}

export interface Representation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
}

// NEW REPRESENTATION MODEL - END
