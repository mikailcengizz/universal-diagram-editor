import { Config } from "../../../types/types";
import BiDirectionalReferenceEdge from "./BiDirectionalReferenceEdge";
import ReferenceEdge from "./ReferenceEdge";

const createEdgeTypesFromConfig = (config: Config) => {
  const edgeTypes: any = {};

  config.notations.relations.forEach((relation) => {
    const relationType = relation.styleProperties.general!.find(
      (prop) => prop.name === "Shape"
    )?.default;

    switch (relationType) {
      case "reference":
        edgeTypes[relationType] = ReferenceEdge;
        break;
      case "bi-directional":
        edgeTypes[relationType] = BiDirectionalReferenceEdge;
        break;
      // Add more cases for other relation types...
      default:
        edgeTypes[relationType!] = ReferenceEdge; // Fallback to a default edge component
        break;
    }
  });

  return edgeTypes;
};

export default createEdgeTypesFromConfig;
