import { Config } from "../../../types/types";
import BiDirectionalReferenceEdge from "./BiDirectionalReferenceEdge";
import ReferenceEdge from "./ReferenceEdge";

const createEdgeTypesFromConfig = (config: Config) => {
  const edgeTypes: any = {};

  config.notations.relationships.forEach((relation) => {
    const relationType = relation.name;

    switch (relationType) {
      case "Association":
        edgeTypes[relationType] = ReferenceEdge;
        break;
      case "bi-directional":
        edgeTypes[relationType] = BiDirectionalReferenceEdge;
        break;
      default:
        edgeTypes[relationType!] = ReferenceEdge;
        break;
    }
  });

  return edgeTypes;
};

export default createEdgeTypesFromConfig;
