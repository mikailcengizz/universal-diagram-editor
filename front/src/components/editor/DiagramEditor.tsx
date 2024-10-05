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
  InstanceObject,
  Class,
  ReferenceValue,
  RepresentationMetaModel,
  RepresentationInstanceObject,
} from "../../types/types";
import PaletteEditorPanel from "./PaletteEditorPanel";
import configService from "../../services/ConfigService";
import ReactFlowWithInstance from "../ReactFlowWithInstance";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesEdge from "../notation_representations/edges/CombineLinkShapesNode";
import ModalDoubleClickNotation from "../notation_representations/nodes/components/modals/first_layer/ModalDoubleClickNotation";
import typeHelper from "../helpers/TypeHelper";
import { all } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateRepresentationInstanceModel } from "../../redux/actions/representationInstanceModelActions";
import { updateInstanceModel } from "../../redux/actions/objectInstanceModelActions";
import { updateSelectedMetaModel } from "../../redux/actions/selectedConfigActions";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import ReferenceHelper from "../helpers/ReferenceHelper";
import ModelHelperFunctions from "../helpers/ModelHelperFunctions";

const nodeTypes = {
  ClassNode: CombineObjectShapesNode,
};

const edgeTypes = {
  ClassEdge: CombineRelationshipShapesEdge,
};

interface DiagramEditorProps {
  selectedMetaModelURI: string;
  diagramAreaRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const DiagramEditor = ({
  selectedMetaModelURI,
  diagramAreaRef,
  nodes,
  setNodes,
  edges,
  setEdges,
}: DiagramEditorProps) => {
  const dispatch = useDispatch();
  const instanceModel: InstanceModel = useSelector(
    (state: any) => state.instanceModelStore.model
  );
  const representationInstanceModel: RepresentationInstanceModel = useSelector(
    (state: any) => state.representationInstanceModelStore.model
  );

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedMetaModel, setSelectedMetaModel] = useState<MetaModel>({
    package: {
      name: "",
      uri: "",
      elements: [],
    },
  });
  const [selectedRepresentationMetaModel, setSelectedRepresentationMetaModel] =
    useState<RepresentationMetaModel>({
      package: {
        uri: "",
        elements: [],
      },
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<DiagramNodeData | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Store the selected edge ID

  useEffect(() => {
    if (selectedMetaModelURI) {
      const fetchMetaConfig = async () => {
        try {
          const response = await configService.getMetaConfigByUri(
            encodeURIComponent(selectedMetaModelURI)
          );
          console.log("Selected meta model:", response.data);
          setSelectedMetaModel(response.data);
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
            encodeURIComponent(selectedMetaModelURI + "-representation")
          );
          console.log("Selected representation meta model:", response.data);
          setSelectedRepresentationMetaModel(response.data);
        } catch (error) {
          console.error("Error fetching representation configuration: ", error);
        }
      };
      fetchRepresentationConfig();

      dispatch(updateSelectedMetaModel(selectedMetaModelURI));
    }
  }, [selectedMetaModelURI]);

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
  }, [selectedMetaModel]);

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
            ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
              instanceObj,
              representationInstanceModel
            );

          if (
            !instanceObj ||
            !selectedMetaModel ||
            selectedMetaModel.package.elements.length === 0 ||
            !representationInstanceObj
          )
            return null;

          const position = representationInstanceObj.position || {
            x: 0,
            y: 0,
          };

          const nodeData: DiagramNodeData = {
            notation: {
              representationMetaModel: selectedRepresentationMetaModel,
              metaModel: selectedMetaModel,
            },
            instanceObject: instanceObj,
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
  }, [representationInstanceModel, instanceModel, setNodes, selectedMetaModel]);

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
            ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
              instanceObj,
              representationInstanceModel
            )!.type === "ClassEdge"
        )
        .map((instanceObj) => {
          const edgeRepresentation =
            ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
              instanceObj,
              representationInstanceModel
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
              (node.data as DiagramNodeData).instanceObject!.name ===
              sourceObject?.name
          );

          const targetNode = nodes.find(
            (node) =>
              (node.data as DiagramNodeData).instanceObject!.name ===
              targetObject?.name
          );

          const returnEdge: Edge = {
            id: `edge-${sourceObject?.name}-${targetObject?.name}`,
            source: sourceNode!.id,
            target: targetNode!.id,
            type: "ClassEdge", // Assuming a default edge type
            data: {
              notation: selectedMetaModel,
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
    selectedMetaModel,
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

      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      // Find source and target notations in metaInstanceModel
      const sourceInstanceObject = instanceModel.package.objects.find(
        (obj) =>
          obj.name ===
          (sourceNode!.data as DiagramNodeData).instanceObject?.name
      );
      const targetInstanceObject = instanceModel.package.objects.find(
        (obj) =>
          obj.name ===
          (targetNode!.data as DiagramNodeData).instanceObject?.name
      );

      // Check if the source and target were found
      if (!sourceInstanceObject || !targetInstanceObject) {
        console.error("Source or Target notation not found:", {
          sourceInstanceObject,
          targetInstanceObject,
        });
        return; // Exit early if either instance is not found
      }

      // Find the first Edge type of the notation which we can use as the default edge type
      let edgeNotationElement: Class | null =
        (selectedMetaModel.package.elements as Class[]).find(
          (element) =>
            ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
              element,
              selectedRepresentationMetaModel
            )?.type === "ClassEdge"
        ) || null;
      const edgeNotationElementRepresentation =
        ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
          edgeNotationElement!,
          selectedRepresentationMetaModel
        );

      // No edge types found in the language
      if (!edgeNotationElement) {
        console.error("No edge types found in the language.");
        return;
      }

      const uniqueId = `${edgeNotationElement.name}-${uuidv4()}`;

      console.log("associationRepresentation", edgeNotationElement);

      // Make sure we reference the new edge to the new representation instance that we create after adding the edge to the instance model
      const metaRepresentationRef = edgeNotationElement.representation?.$ref!;
      const [modelUri, jsonPointer] = metaRepresentationRef.split("#"); // use base URI to construct new URI
      const representationUri =
        modelUri + "#/objects/" + instanceModel.package.objects.length;
      // Create a new edge instance object
      const edgeInstanceObject: InstanceObject = {
        name: targetInstanceObject!.name,
        type: {
          $ref:
            selectedMetaModel.package.uri +
            "#/classes/" +
            (selectedMetaModel.package.elements as Class[]).findIndex(
              (element) => element.name === edgeNotationElement!.name
            ),
        },
        attributes: [],
        links: [
          {
            name: "source",
            target: {
              $ref:
                "#/objects/" +
                instanceModel.package.objects.indexOf(sourceInstanceObject),
            },
          },
          {
            name: "target",
            target: {
              $ref:
                "#/objects/" +
                instanceModel.package.objects.indexOf(targetInstanceObject),
            },
          },
        ],
        representation: {
          $ref: representationUri,
        },
      };

      // Ensure graphicalRepresentation exists
      if (!edgeInstanceObject.representation) {
        console.error("Graphical representation is missing for edge");
        return;
      }

      const data: DiagramNodeData = {
        notation: {
          representationMetaModel: selectedRepresentationMetaModel,
          metaModel: selectedMetaModel,
        },
        notationElement: edgeNotationElement,
        instanceObject: edgeInstanceObject,
        position: {
          x: 0,
          y: 0,
        }, // edges don't have positions
      };

      console.log("Edge created:", edgeInstanceObject);

      const newEdge: Edge = {
        ...params,
        id: `edge-${source}-${target}-${uniqueId}`,
        type: "edge",
        // passing data to the combined edge component
        data: data as any,
      };

      setEdges((eds) => addEdge(newEdge, eds));

      // Update meta instance model with new edge
      updateInstanceModelWithNewNode(newEdge, false, edgeInstanceObject);

      const representationInstanceObject: RepresentationInstanceObject = {
        name: uniqueId,
        type: edgeNotationElementRepresentation!.type,
        position: {
          x: 0,
          y: 0,
        },
        graphicalRepresentation: [
          ...edgeNotationElementRepresentation!.graphicalRepresentation!,
        ],
      };

      // Update representation instance model with new edge
      updateRepresentationInstanceModelWithNewNode(
        newEdge,
        false,
        representationInstanceObject
      );
    },
    [setEdges, selectedMetaModel, selectedRepresentationMetaModel]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);

        changes.forEach((change) => {
          if (change.type === "position" && "id" in change) {
            const changedNode = updatedNodes.find(
              (node) => node.id === change.id
            );
            console.log("Node changed:", changedNode);
            console.log("Change:", change);
            console.log("changed node data:", changedNode?.data);
            const nodeName = (changedNode?.data as DiagramNodeData)
              .instanceObject?.name;

            const instanceObjectChanged = instanceModel.package.objects.find(
              (obj) => obj.name === nodeName
            );
            const indexInstanceObjectChanged =
              instanceModel.package.objects.indexOf(instanceObjectChanged!);

            if (instanceObjectChanged) {
              // Ensure the new position is valid, fallback to the last known position if not
              const newPosition: Position = {
                x:
                  change.position &&
                  typeof change.position.x === "number" &&
                  !isNaN(change.position.x)
                    ? change.position.x
                    : ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
                        instanceObjectChanged,
                        representationInstanceModel
                      )!.position!.x,
                y:
                  change.position &&
                  typeof change.position.y === "number" &&
                  !isNaN(change.position.y)
                    ? change.position.y
                    : ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
                        instanceObjectChanged,
                        representationInstanceModel
                      )!.position!.y,
              };

              console.log("New position: ", newPosition);

              const updatedRepresentationInstanceModel = {
                ...representationInstanceModel,
                package: {
                  ...representationInstanceModel.package,
                  objects: representationInstanceModel.package.objects.map(
                    (obj, index) => {
                      // find the representation object that is mapped to the instance object
                      // they have the same index as their relation is always 1:1
                      if (index === indexInstanceObjectChanged) {
                        return {
                          ...obj,
                          position: newPosition, // Update position with valid or fallback position
                        };
                      }
                      return obj;
                    }
                  ),
                },
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

        return updatedNodes;
      });
    },
    [setNodes, representationInstanceModel, dispatch, instanceModel]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onLoad = useCallback((instance: any) => {
    setReactFlowInstance(instance);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("onDragOver triggered"); // log drag over event
  }, []);

  const updateInstanceModelWithNewNode = (
    newNode: Node | Edge,
    isNode: boolean, // boolean to tell if the new node is a node or an edge
    notation: InstanceObject
  ) => {
    let newInstanceModel = { ...instanceModel };

    // if it is the first node we drop, we set the uri
    if (newInstanceModel.package.uri === "") {
      newInstanceModel.package.uri = selectedMetaModel.package.uri;
    }

    // Add the new node to the instance model together with its id
    const uniqueId = newNode.id;
    let newInstanceObject = { ...notation };

    if (!isNode) {
      const newEdge = newNode as Edge;
      const sourceNode = nodes.find((node) => node.id === newEdge.source);
      const targetNode = nodes.find((node) => node.id === newEdge.target);
      // Add source and target references to the edge
      newInstanceObject = {
        ...newInstanceObject,
        links: [
          {
            name: "source",
            target: {
              $ref:
                "#/objects/" +
                instanceModel.package.objects.findIndex(
                  (obj) =>
                    obj.name ===
                    (sourceNode!.data as DiagramNodeData).instanceObject?.name
                ),
            },
          },
          {
            name: "target",
            target: {
              $ref:
                "#/objects/" +
                instanceModel.package.objects.findIndex(
                  (obj) =>
                    obj.name ===
                    (targetNode!.data as DiagramNodeData).instanceObject?.name
                ),
            },
          },
        ],
      };
    }

    newInstanceModel.package.objects.push(newInstanceObject);

    dispatch(updateInstanceModel(newInstanceModel));
  };

  const updateRepresentationInstanceModelWithNewNode = (
    newNode: Node | Edge,
    isNode: boolean, // boolean to tell if the new node is a node or an edge
    notation: RepresentationInstanceObject
  ) => {
    let newRepresentationInstanceModel = { ...representationInstanceModel };

    // if it is the first node we drop, we set the uri
    if (newRepresentationInstanceModel.package.uri === "") {
      newRepresentationInstanceModel.package.uri =
        selectedRepresentationMetaModel.package.uri;
    }

    // Add the new node to the instance model together with its id
    let newRepresentationInstanceObject = { ...notation };

    if (isNode) {
      newNode = newNode as Node;
      newRepresentationInstanceObject = {
        ...newRepresentationInstanceObject,
        position: {
          x: newNode.position.x,
          y: newNode.position.y,
        },
      };
    }

    newRepresentationInstanceModel.package.objects.push(
      newRepresentationInstanceObject
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
      const { notationElement } = dragData;

      const uniqueId = `${notationElement.name}-${uuidv4()}`;
      const nodeType = notationElement.name; // ClassNode, EdgeNode
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const instanceObject: InstanceObject = {
        name: uniqueId,
        type: {
          $ref:
            selectedMetaModel.package.uri +
            "#/classes/" +
            (selectedMetaModel.package.elements as Class[]).findIndex(
              (element) => element.name === notationElement.name
            ),
        },
        attributes: [],
        links: [],
        representation: {
          $ref:
            selectedRepresentationMetaModel.package.uri +
            "#/objects/" +
            representationInstanceModel.package.objects.length,
        },
      };

      const notationElementRepresentation =
        ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
          notationElement,
          selectedRepresentationMetaModel
        )!;
      const representationInstanceObject: RepresentationInstanceObject = {
        name: uniqueId,
        type: notationElementRepresentation.type,
        position: position,
        graphicalRepresentation: [
          ...notationElementRepresentation.graphicalRepresentation!,
        ],
      };

      const nodeData: DiagramNodeData = {
        notation: {
          representationMetaModel: selectedRepresentationMetaModel,
          metaModel: selectedMetaModel,
        },
        notationElement: notationElement,
        instanceObject: instanceObject,
        position: position,
        isNotationSlider: false,
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
      updateInstanceModelWithNewNode(newNode, true, instanceObject);

      // Update representation instance model with new node
      updateRepresentationInstanceModelWithNewNode(
        newNode,
        true,
        representationInstanceObject
      );
    },
    [
      selectedMetaModel,
      selectedRepresentationMetaModel,
      reactFlowInstance,
      instanceModel,
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
          title={selectedMetaModel?.package?.name}
          notationElements={selectedMetaModel?.package?.elements as Class[]}
          selectedMetaModel={selectedMetaModel}
          selectedRepresentationMetaModel={selectedRepresentationMetaModel}
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
