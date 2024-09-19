export type Callback = (error: Error | null, success?: any) => void;

export type ModelFileType = "representation" | "meta";

// NEW EMF ECORE MODEL - START
export interface MetaModelFile {
  name: string;
  type: ModelFileType;
  ePackages: EPackage[];
}

export interface ENamedElement {
  name: string;
}

export interface EPackage extends ENamedElement {
  eClassifiers: EClassifier[];
  eSubpackages: EPackage[];
}

export interface EClassifier extends ENamedElement {}

export interface EClass extends EClassifier {
  eAttributes: EAttribute[];
  eReferences: EReference[];
  eOperations?: EOperation[];
  eSuperTypes?: EClass[];
}

export interface EDataType extends EClassifier {
  // represents data types like EString, EInt, etc.
}

export interface EAttribute {
  name: string;
  eAttributeType: EDataType; // Name of the data type
  defaultValue?: any;
  isUnique?: boolean;
  lowerBound?: number;
  upperBound?: number;
}

export interface EReference {
  name: string;
  eType: string;
  containment?: boolean;
  upperBound?: string;
}

export interface ETypedElement extends ENamedElement {
  eType: EClassifier; // Name of the data type
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

export type DataType = "String" | "Collection" | "Package" | "Boolean" | "Text";

