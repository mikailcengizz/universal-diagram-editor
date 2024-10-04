import React, { useState, useCallback, useEffect } from "react";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { parseStringPromise } from "xml2js";
import {
  DiagramNodeData,
  DragData,
  Attribute,
  Classifier,
  Representation,
  Reference,
  Position,
  InstanceModel,
  RepresentationInstanceModel,
  MetaModel,
  Notation,
  InstanceObject,
} from "../../types/types";
import PaletteEditorPanel from "./PaletteEditorPanel";
import configService from "../../services/ConfigService";
import ReactFlowWithInstance from "../ReactFlowWithInstance";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesEdge from "../notation_representations/edges/CombineRelationshipShapesEdge";
import ModalDoubleClickNotation from "../notation_representations/nodes/components/modals/first_layer/ModalDoubleClickNotation";
import typeHelper from "../helpers/TypeHelper";
import { all } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateRepresentationInstanceModel } from "../../redux/actions/representationInstanceModelActions";
import { updateInstanceModel } from "../../redux/actions/objectInstanceModelActions";
import { updateSelectedConfig } from "../../redux/actions/selectedConfigActions";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import ReferenceHelper from "../helpers/ReferenceHelper";

const nodeTypes = {
  ClassNode: CombineObjectShapesNode,
};

const edgeTypes = {
  ClassEdge: CombineRelationshipShapesEdge,
};

interface DiagramEditorProps {
  selectedConfigName: string | null;
  diagramAreaRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const DiagramEditor = ({
  selectedConfigName,
  diagramAreaRef,
  nodes,
  setNodes,
  edges,
  setEdges,
}: DiagramEditorProps) => {
  const dispatch = useDispatch();
  const instanceModel: InstanceModel = useSelector(
    (state: any) => state.metaInstanceModelStore.model
  );
  const representationInstanceModel: RepresentationInstanceModel = useSelector(
    (state: any) => state.representationInstanceModelStore.model
  );

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNotation, setSelectedNotation] = useState<Notation>({
    metaModel: {
      package: {
        name: "",
        uri: "",
        elements: [],
      },
    },
    representationMetaModel: {
      package: {
        uri: "",
        elements: [],
      },
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<DiagramNodeData | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Store the selected edge ID

  useEffect(() => {
    if (selectedConfigName) {
      const fetchMetaConfig = async () => {
        try {
          const response = await configService.getMetaConfigByUri(
            selectedConfigName
          );
          setSelectedNotation({
            ...selectedNotation,
            metaModel: response.data,
          });
          // clear canvas when new config is selected
          setNodes([]);
          setEdges([]);
        } catch (error) {
          console.error("Error fetching configuration: ", error);
        }
      };
      fetchMetaConfig();

      const fetchRepresentationConfig = async () => {
        try {
          const response = await configService.getRepresentationConfigByUri(
            selectedConfigName
          );
          setSelectedNotation({
            ...selectedNotation,
            representationMetaModel: response.data,
          });
        } catch (error) {
          console.error("Error fetching representation configuration: ", error);
        }
      };
      fetchRepresentationConfig();

      dispatch(updateSelectedConfig(selectedConfigName));
    }
  }, [selectedConfigName]);

  const onDoubleClickEdge = (edgeId: string, data: DiagramNodeData) => {
    setModalData(data); // Set the data to be displayed in the modal
    setSelectedEdgeId(edgeId); // Store the selected edge ID
    setIsModalOpen(true); // Open the modal
  };

  const onEdgeDataChange = (edgeId: string, updatedData: any) => {
    console.log("Updating edge:", edgeId, updatedData); // Add this for debugging
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: updatedData, key: Date.now() }
          : edge
      )
    );
  };

  // TODO: set initial nodes and edges from local storage,
  useEffect(() => {
    /* if (config) {
      const initialNodes = [];
      setNodes(initialNodes);
      console.log("Initial nodes set:", initialNodes);
    } */
  }, [selectedNotation.metaModel]);

  // Load the instance models from local storage
  useEffect(() => {
    const metaInstance = JSON.parse(localStorage.getItem("metaInstanceModel")!);
    const representationInstance = JSON.parse(
      localStorage.getItem("representationInstanceModel")!
    );

    if (metaInstance && representationInstance) {
      dispatch(updateInstanceModel(metaInstance));
      dispatch(updateRepresentationInstanceModel(representationInstance));
    }
  }, [dispatch]);

  useEffect(() => {
    const initializeNodes = (): Node[] => {
      if (
        !representationInstanceModel ||
        !instanceModel ||
        representationInstanceModel.package.objects.length === 0
      )
        return [];

      const returnNodes = instanceModel.package.objects
        .map((instanceObj) => {
          const representationInstanceObj =
            ReferenceHelper.dereferenceRepresentation(
              instanceObj.representation?.$ref!
            );

          if (
            !instanceObj ||
            !selectedNotation.metaModel ||
            selectedNotation.metaModel.package.elements.length === 0 ||
            !representationInstanceObj
          )
            return null;

          const position = representationInstanceObj.position || {
            x: 0,
            y: 0,
          };

          const nodeData: DiagramNodeData = {
            notation: selectedNotation,
            instance: {
              instanceObject: instanceObj,
              representationInstanceObject: representationInstanceObj,
            },
            position: position,
          };

          if (representationInstanceObj.type === "ClassEdge") {
            // temporary fix for edge nodes, this needs to be done by not having edges in the eClassifiers array
            // but instead in eFeatures array
          } else {
            const returnNode: Node = {
              id: uuidv4(),
              type: "ClassNode", // as it is a classifer node
              position: representationInstanceObj.position!,
              data: nodeData as any,
            };

            return returnNode;
          }
        })
        .filter(Boolean); // Filter out null values

      return returnNodes as Node[];
    };

    const initialNodes = initializeNodes();
    setNodes(initialNodes);
  }, [representationInstanceModel, instanceModel, setNodes, selectedNotation]);

  useEffect(() => {
    const initializeEdges = () => {
      if (
        !instanceModel ||
        !representationInstanceModel ||
        instanceModel.package.objects.length === 0
      )
        return [];

      const returnEdges = instanceModel.package.objects
        // temporary fix for edge nodes, this needs to be done by not having edges in the eClassifiers array
        // but instead in eFeatures array, and then just reference them by id in the eReferences array
        .filter(
          (instanceObj) =>
            ReferenceHelper.dereferenceRepresentation(
              instanceObj.representation?.$ref!
            )!.type === "ClassEdge"
        )
        .map((instanceObj) => {
          const edgeRepresentation = ReferenceHelper.dereferenceRepresentation(
            instanceObj.representation?.$ref!
          );

          const targetLink = instanceObj.links.find(
            (link) => link.name === "target"
          );
          const sourceLink = instanceObj.links.find(
            (link) => link.name === "source"
          );

          const targetObject: InstanceObject | null =
            targetLink && targetLink.target.$ref
              ? ReferenceHelper.resolveRef(
                  instanceModel.package.objects,
                  targetLink.target.$ref
                )
              : null;

          const sourceObject: InstanceObject | null =
            sourceLink && sourceLink.target.$ref
              ? ReferenceHelper.resolveRef(
                  instanceModel.package.objects,
                  sourceLink.target.$ref
                )
              : null;

          if (!edgeRepresentation) return null;

          const sourceNode = nodes.find(
            (node) =>
              (node.data as DiagramNodeData).instance!.instanceObject!.name ===
              sourceObject?.name
          );

          const targetNode = nodes.find(
            (node) =>
              (node.data as DiagramNodeData).instance!.instanceObject!.name ===
              targetObject?.name
          );

          const returnEdge: Edge = {
            id: `edge-${sourceObject?.name}-${targetObject?.name}`,
            source: sourceNode!.id,
            target: targetNode!.id,
            type: "ClassEdge", // Assuming a default edge type
            data: {
              notation: selectedNotation,
              instanceNotation: instanceObj,
              onDoubleClick: onDoubleClickEdge,
            },
          };

          return returnEdge;
        })
        .filter(Boolean); // Filter out null values

      return returnEdges as Edge[];
    };

    const initialEdges = initializeEdges();

    setEdges(initialEdges);
  }, [
    instanceModel,
    representationInstanceModel,
    setEdges,
    selectedNotation,
    nodes,
  ]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Check if source and target exist
      if (!params.source || !params.target) {
        console.error("Source or Target is missing from params:", params);
        return;
      }

      // Access the source and target node IDs
      const { source, target } = params;

      // Find source and target notations in metaInstanceModel
      const sourceInstanceNotation =
        metaInstanceModel.ePackages[0].eClassifiers.find(
          (cls) => cls.id === source
        ) as EClassInstance;
      const targetInstanceNotation =
        metaInstanceModel.ePackages[0].eClassifiers.find(
          (cls) => cls.id === target
        ) as EClassInstance;

      // Check if the source and target were found
      if (!sourceInstanceNotation || !targetInstanceNotation) {
        console.error("Source or Target notation not found:", {
          sourceInstanceNotation,
          targetInstanceNotation,
        });
        return; // Exit early if either instance is not found
      }

      // Find association in meta and representation
      let associationMeta: MetaNotation = metaConfig!.ePackages[0].eClassifiers
        .map((cls) => cls as EClass)
        .find((cls) => cls.name === "Association") as MetaNotation;
      let associationRepresentation: MetaNotation =
        representationConfig!.ePackages[0].eClassifiers
          .map((cls) => cls as EClassRepresentation)
          .find((cls) => cls.name === "Association") as MetaNotation;

      // Ensure associationMeta and associationRepresentation are found
      if (!associationMeta || !associationRepresentation) {
        console.error("Association meta or representation not found:", {
          associationMeta,
          associationRepresentation,
        });
        return;
      }

      const uniqueId = `${associationMeta.name}-${uuidv4()}`;

      console.log("associationRepresentation", associationRepresentation);

      // Create a new edge instance notation for the association
      const associationClassInstanceNotation: InstanceNotation = {
        id: uniqueId,
        name: targetInstanceNotation!.name,
        abstract: false,
        interface: false,
        eReferences: [
          {
            name: "source",
            id: sourceInstanceNotation.id,
          } as EReferenceInstance,
          {
            name: "target",
            id: targetInstanceNotation.id,
          } as EReferenceInstance,
        ],
        eAttributes: [],
        eOperations: [],
        eSubpackages: [],
        eSuperTypes: [],
        graphicalRepresentation:
          associationRepresentation.graphicalRepresentation,
      };

      // Ensure graphicalRepresentation exists
      if (!associationClassInstanceNotation.graphicalRepresentation) {
        console.error("Graphical representation is missing for association");
        return;
      }

      const allMetaNotations = typeHelper.mergeMetaAndRepresentation(
        metaConfig!.ePackages,
        representationConfig!.ePackages
      );

      const data: CustomNodeData = {
        metaNotations: allMetaNotations,
        instanceNotation: associationClassInstanceNotation,
        position: {
          x: 0,
          y: 0,
        }, // edges don't have positions
        isPalette: false,
        isNotationSlider: false,
      };

      console.log("Association created:", associationClassInstanceNotation);

      const newEdge: Edge = {
        ...params,
        id: `edge-${source}-${target}-${uniqueId}`,
        type: "edge",
        // passing data to the combined edge component
        data: data as any,
      };

      setEdges((eds) => addEdge(newEdge, eds));

      // Update meta instance model with new edge
      updateMetaInstanceModelWithNewNode(
        newEdge,
        false,
        associationClassInstanceNotation
      );

      // Update representation instance model with new edge
      updateRepresentationInstanceModelWithNewNode(
        newEdge,
        false,
        associationClassInstanceNotation
      );
    },
    [setEdges, metaConfig, representationConfig]
  );

  console.log("nodes:", nodes);
  console.log("edges:", edges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));

      changes.forEach((change) => {
        if (change.type === "position" && "id" in change) {
          const classifierInRepresentation =
            representationInstanceModel.ePackages[0].eClassifiers.find(
              (classifier) => classifier.referenceMetaId === change.id
            );

          if (classifierInRepresentation) {
            // Ensure the new position is valid, fallback to the last known position if not
            const newPosition: Position = {
              x:
                change.position &&
                typeof change.position.x === "number" &&
                !isNaN(change.position.x)
                  ? change.position.x
                  : classifierInRepresentation.position.x,
              y:
                change.position &&
                typeof change.position.y === "number" &&
                !isNaN(change.position.y)
                  ? change.position.y
                  : classifierInRepresentation.position.y,
            };

            console.log("New position: ", newPosition);

            const updatedRepresentationInstanceModel = {
              ...representationInstanceModel,
              ePackages: representationInstanceModel.ePackages.map((pkg) => ({
                ...pkg,
                eClassifiers: pkg.eClassifiers.map((classifier) => {
                  if (classifier.referenceMetaId === change.id) {
                    return {
                      ...classifier,
                      position: newPosition, // Update position with valid or fallback position
                    };
                  }
                  return classifier;
                }),
              })),
            };

            dispatch(
              updateRepresentationInstanceModel(
                updatedRepresentationInstanceModel
              )
            );

            console.log("Position saved to localStorage.");
          } else {
            console.error(
              "Classifier not found in representation model for ID: ",
              change.id
            );
          }
        }
      });
    },
    [setNodes, representationInstanceModel, dispatch]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onLoad = useCallback((instance: any) => {
    setReactFlowInstance(instance);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("onDragOver triggered"); // log drag over event
  }, []);

  const updateMetaInstanceModelWithNewNode = (
    newNode: Node | Edge,
    isNode: boolean, // boolean to tell if the new node is a node or an edge
    notation: InstanceNotation
  ) => {
    let newMetaInstanceModel = { ...metaInstanceModel };

    // Initialize root package if it doesn't exist
    if (newMetaInstanceModel.ePackages.length === 0) {
      newMetaInstanceModel.ePackages.push({
        name: metaConfig?.ePackages[0].name!,
        eClassifiers: [],
        eSubpackages: [],
        id: metaConfig?.ePackages[0].name!,
      });
    }

    // Add the new node to the instance model together with its id
    const uniqueId = newNode.id;
    const { graphicalRepresentation, ...restOfNotation } = notation; // excludes graphical representation field from notation
    let newEClassInstance: EClassInstance = {
      ...(restOfNotation as EClassInstance),
      id: uniqueId,
    };

    if (!isNode) {
      const newEdge = newNode as Edge;
      // Add source and target references to the edge
      newEClassInstance = {
        ...newEClassInstance,
        eReferences: [
          {
            name: "source",
            id: newEdge.source,
          },
          {
            name: "target",
            id: newEdge.target,
          },
        ],
      };
    }

    newMetaInstanceModel.ePackages[0].eClassifiers.push(newEClassInstance);

    dispatch(updateMetaInstanceModel(newMetaInstanceModel));
  };

  const updateRepresentationInstanceModelWithNewNode = (
    newNode: Node | Edge,
    isNode: boolean, // boolean to tell if the new node is a node or an edge
    notation: InstanceNotation
  ) => {
    let newRepresentationInstanceModel = { ...representationInstanceModel };

    // Initialize root package if it doesn't exist
    if (
      newRepresentationInstanceModel.ePackages.length === 0 &&
      representationConfig &&
      representationConfig.ePackages[0]
    ) {
      newRepresentationInstanceModel.ePackages.push({
        name: representationConfig?.ePackages[0].name!,
        eSubpackages: [],
        eClassifiers: [],
        id: representationConfig?.ePackages[0].name!,
        position: { x: 0, y: 0 },
        referenceMetaId: metaConfig?.ePackages[0].name!,
      });
    }

    const uniqueRepresentationId = uuidv4(); // unique representation id
    // Add the new node to the instance model together with its id
    let newEClassRepresentationInstance: EClassRepresentationInstance = {
      ...(notation as EClassRepresentationInstance),
      id: uniqueRepresentationId,
      referenceMetaId: newNode.id,
    };

    if (isNode) {
      newNode = newNode as Node;
      newEClassRepresentationInstance = {
        ...newEClassRepresentationInstance,
        position: {
          x: newNode.position.x,
          y: newNode.position.y,
        },
      };
    }

    // Add graphical representation if it exists, and if the representation config exists
    if (representationConfig && representationConfig.ePackages[0] && isNode) {
      newEClassRepresentationInstance = {
        ...newEClassRepresentationInstance,
        graphicalRepresentation: [
          ...(representationConfig?.ePackages[0].eClassifiers
            .map((cls) => cls as EClassRepresentationInstance)
            .find((cls) => cls.name === notation.name)
            ?.graphicalRepresentation || []),
        ],
      };
    }

    newRepresentationInstanceModel.ePackages[0].eClassifiers.push(
      newEClassRepresentationInstance
    );

    dispatch(updateRepresentationInstanceModel(newRepresentationInstanceModel));
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        console.log("React Flow instance not set.");
        return;
      }

      const dragData: DragData = JSON.parse(
        event.dataTransfer.getData("palette-item")
      );
      const { notation } = dragData;

      const uniqueId = `${notation.name}-${uuidv4()}`;

      const nodeType = notation.name + "Node"; // ClassNode, ReferenceNode, etc.

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const allNotations = typeHelper.mergeMetaAndRepresentation(
        metaConfig!.ePackages,
        representationConfig!.ePackages
      );

      const nodeData: CustomNodeData = {
        metaNotations: allNotations,
        instanceNotation: notation,
        position: position,
        isNotationSlider: false,
        isPalette: false,
      };

      const newNode: Node = {
        id: uniqueId,
        type: nodeType,
        position,
        data: nodeData as any,
      };

      console.log("Node dropped:", newNode);
      setNodes((nds) => nds.concat(newNode));

      // Update meta instance model with new node
      updateMetaInstanceModelWithNewNode(newNode, true, notation);

      // Update representation instance model with new node
      updateRepresentationInstanceModelWithNewNode(newNode, true, notation);
    },
    [
      reactFlowInstance,
      metaConfig,
      representationConfig,
      metaInstanceModel,
      representationInstanceModel,
      setNodes,
    ]
  );

  const importFromXMI = async (xmiFile: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const xmiData = event.target?.result as string;
      const result = await parseStringPromise(xmiData);
      const importedNodes: Node[] = result.XMI["UML:Model"][0][
        "UML:Class"
      ]?.map((cls: any, index: number) => ({
        id: `node-${index}`,
        type: cls.$.type,
        data: {
          label: cls.$.name,
          sections: cls["Compartment"]?.map((compartment: any) => {
            return { name: compartment.$.name, default: compartment.$.default };
          }),
        },
        position: {
          x: parseFloat(cls.Position[0].$.x),
          y: parseFloat(cls.Position[0].$.y),
        },
      }));
      const importedEdges: Edge[] = result.XMI["UML:Model"][0][
        "UML:Association"
      ]?.map((assoc: any, index: number) => ({
        id: `edge-${index}`,
        source: assoc.$.source,
        target: assoc.$.target,
      }));
      setNodes(importedNodes);
      setEdges(importedEdges);
    };
    reader.readAsText(xmiFile);
  };

  return (
    <div className="flex h-full bg-white">
      <ReactFlowProvider>
        <PaletteEditorPanel
          title={metaConfig?.name}
          notations={typeHelper.mergeMetaAndRepresentation(
            metaConfig!.ePackages,
            representationConfig!.ePackages
          )}
        />
        <div
          style={{ minHeight: "100%", maxHeight: "100%", width: "100%" }}
          className="border-2 overflow-y-scroll"
          ref={diagramAreaRef}
        >
          <div style={{ flexGrow: 1, height: "100%", cursor: "grab" }}>
            <ReactFlowWithInstance
              nodes={nodes}
              edges={edges.map((edge) => ({
                ...edge,
                data: {
                  ...edge.data,
                  onDoubleClick: onDoubleClickEdge,
                },
              }))}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              snapToGrid={true}
              snapGrid={[15, 15]}
            />
          </div>
        </div>
      </ReactFlowProvider>

      {/* Modal */}
      {isModalOpen && modalData && (
        <ModalDoubleClickNotation
          nodeId=""
          data={modalData}
          isNodeAttributeModalOpen={false}
          isNodeModalOpen={isModalOpen}
          isNodeOperationModalOpen={false}
          setData={(newData) => {
            setModalData(newData);
            onEdgeDataChange(selectedEdgeId!, newData);
          }}
          setIsNodeAttributeModalOpen={() => {}}
          setIsNodeModalOpen={setIsModalOpen}
          setIsNodeOperationModalOpen={() => {}}
          onDataUpdate={(updatedData) => {
            onEdgeDataChange(selectedEdgeId!, updatedData);
          }}
        />
      )}

      <div>
        <h3 className="font-bold">Import from XMI</h3>
        <input
          type="file"
          accept=".xmi"
          alt="Import from XMI"
          placeholder="Import from XMI"
          onChange={(e) => {
            if (e.target.files) {
              importFromXMI(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
};

export default DiagramEditor;
