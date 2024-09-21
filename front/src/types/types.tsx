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
  eSubpackages?: EPackage[];
  eClassifiers?: EClass[];
  eAttributes?: EAttribute[];
  eReferences?: EReference[];
  eOperations?: EOperation[];
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
  ePackages: EPackage[];
}

export abstract class ENamedElement {
  name: string | undefined;
}

export interface EPackage extends ENamedElement {
  eClassifiers: EClassifier[];
  eSubpackages: EPackage[];
}

export abstract class EClassifier extends ENamedElement {
  ePackage?: EPackage;
  abstract?: boolean;
  interface?: boolean;
}

export interface EClass extends EClassifier {
  eAttributes?: EAttribute[];
  eReferences?: EReference[];
  eOperations?: EOperation[];
  eSuperTypes?: EClass[];
}

export interface EDataType extends EClassifier {
  // represents data types like EString, EInt, etc.
}

export abstract class TypedElement extends ENamedElement {
  eType?: EClassifier; // Name of the data type
  lowerBound?: number;
  upperBound?: number;
  isUnique?: boolean;
}

export abstract class EStructuralFeature extends TypedElement {
  isDerived?: boolean;
  defaultValue?: any;
  defaultValueLiteral?: string;
  eContainingClass?: EClass; // The class that has this feature
}

export interface EAttribute extends EStructuralFeature {
  name: string;
  eAttributeType?: EDataType; // Name of the data type
  defaultValue?: any;
}

export interface EReference extends EStructuralFeature {
  containment?: boolean;
  eOpposite?: EReference;
  eReferenceType?: EClass; // Name of the data type
}

export interface ETypedElement extends ENamedElement {
  eType?: EClassifier; // Name of the data type
}

export interface EOperation extends ETypedElement {
  eParameters?: EParameter[];
}

export interface EParameter extends ETypedElement {}

export interface EAnnotation {
  source: string;
}

// NEW EMF ECORE MODEL - END

// NEW REPRESENTATION MODEL - START
export interface RepresentationModelFile {
  name: string;
  type: ModelFileType;
  ePackages: EPackageRepresentation[];
}

export interface EPackageRepresentation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
  eClassifiers: EClassRepresentation[];
  eSubpackages: EPackageRepresentation[];
}

export interface EClassRepresentation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
  eAttributes: EAttributeRepresentation[];
  eReferences: EReferenceRepresentation[];
  eOperations?: EOperationRepresentation[];
}

export interface EAttributeRepresentation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
}

export interface EReferenceRepresentation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
}

export interface EOperationRepresentation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
  eParameters?: EParameterRepresentation[];
}

export interface EParameterRepresentation {
  name: string;
  graphicalRepresentation?: NotationRepresentationItem[];
}

// NEW REPRESENTATION MODEL - END
