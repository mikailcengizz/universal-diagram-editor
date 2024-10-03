import {
  InstanceNotation,
  EPackage,
  EClass,
  EPackageRepresentation,
  EPackageInstance,
  MetaNotation,
} from "../../types/types";

class TypeHelper {
  determineInputFieldType(dataType: string) {
    switch (dataType) {
      case "String":
        return "text";
      case "Boolean":
        return "checkbox";
      case "Text":
        return "textarea";
      default:
        return "text";
    }
  }
  determineVisibilityIcon(visibility: string): string {
    switch (visibility) {
      case "public":
        return "+";
      case "protected":
        return "#";
      case "private":
        return "-";
      case "package":
        return "~";
      default:
        return "+";
    }
  }

  /**
   * Merges the metaModelNotations with the representationModelNotations into a Notation array.
   */
  mergeMetaAndRepresentation(
    metaPackages: EPackage[],
    representationPackages: EPackageRepresentation[]
  ): MetaNotation[] {
    return metaPackages.flatMap((metaPackage) => {
      // Find corresponding representation package for each meta package
      const representationPackage = representationPackages.find(
        (pkg) => pkg.name === metaPackage.name
      );

      const mergedClassifiers: MetaNotation[] = metaPackage.eClassifiers.map(
        (metaClassifier) => {
          // Find the corresponding classifier's graphical representation
          const representationClassifier =
            representationPackage?.eClassifiers.find(
              (repClassifier) => repClassifier.name === metaClassifier.name
            );

          return {
            ...metaClassifier, // Meta model classifier (name, attributes, references, etc.)
            name: metaClassifier.name!,
            graphicalRepresentation:
              representationClassifier?.graphicalRepresentation || [], // Graphical representation, if it exists
          };
        }
      );

      const mergedSubPackages: MetaNotation[] = metaPackage.eSubpackages.map(
        (metaSubpackage) => {
          // Find corresponding subpackage representation
          const representationSubpackage =
            representationPackage?.eSubpackages.find(
              (repSubpackage) => repSubpackage.name === metaSubpackage.name
            );

          return {
            ...metaSubpackage, // Meta model subpackage
            name: metaSubpackage.name!,
            graphicalRepresentation:
              representationSubpackage?.graphicalRepresentation || [], // Graphical representation for subpackage
          };
        }
      );

      return [...mergedClassifiers, ...mergedSubPackages];
    });
  }
}

const typeHelper = new TypeHelper();

export default typeHelper;
