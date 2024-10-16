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
  ReactFlowInstance,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  DiagramNodeData,
  DragData,
  InstanceModel,
  RepresentationInstanceModel,
  MetaModel,
  InstanceObject,
  Class,
  RepresentationMetaModel,
  RepresentationInstanceObject,
} from "../../types/types";
import PaletteEditorPanel from "./PaletteEditorPanel";
import configService from "../../services/ConfigService";
import ReactFlowWithInstance from "../ReactFlowWithInstance";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineLinkShapesEdge from "../notation_representations/edges/CombineLinkShapesNode";
import ModalDoubleClickNotation from "../notation_representations/nodes/components/modals/first_layer/ModalDoubleClickNotation";
import { useDispatch, useSelector } from "react-redux";
import { updateRepresentationInstanceModel } from "../../redux/actions/representationInstanceModelActions";
import { updateInstanceModel } from "../../redux/actions/objectInstanceModelActions";
import { updateSelectedMetaModel } from "../../redux/actions/selectedConfigActions";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import ModelHelperFunctions from "../helpers/ModelHelperFunctions";
import OnNodesChangeHelper from "../helpers/react-flow-helpers/OnNodesChangeHelper";
import OnLoadHelper from "../helpers/react-flow-helpers/OnLoadHelper";

const nodeTypes = {
  ClassNode: CombineObjectShapesNode,
};

const edgeTypes = {
  ClassEdge: CombineLinkShapesEdge,
};

interface DiagramEditorProps {
  selectedMetaModelURI: string;
  showGrid: boolean;
  diagramAreaRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const DiagramEditor = ({
  selectedMetaModelURI,
  showGrid,
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
  selectedMetaModelURI =
    localStorage.getItem("selectedMetaModel") || selectedMetaModelURI;

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
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
        name: "",
        uri: "",
        elements: [],
      },
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<DiagramNodeData | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Store the selected edge ID

  useEffect(() => {
    // onLoad react flow functionality
    if (reactFlowInstance) {
      // Perform any additional actions when the instance is available
    }
  }, [reactFlowInstance]);

  useEffect(() => {
    if (selectedMetaModelURI) {
      const fetchMetaConfig = async () => {
        try {
          const response = await configService.getMetaConfigByUri(
            encodeURIComponent(selectedMetaModelURI)
          );
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
          setSelectedRepresentationMetaModel(response.data);
        } catch (error) {
          console.error("Error fetching representation configuration: ", error);
        }
      };
      fetchRepresentationConfig();

      dispatch(updateSelectedMetaModel(selectedMetaModelURI));
    }
  }, [selectedMetaModelURI, dispatch, setNodes, setEdges]);

  const onDoubleClickEdge = (edgeId: string, data: DiagramNodeData) => {
    console.log("Double clicked on edge:", edgeId, data);
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
      console.log("dispatching instance models from local storage");
      dispatch(updateInstanceModel(metaInstance));
      dispatch(updateRepresentationInstanceModel(representationInstance));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!reactFlowInstance) {
      console.log("React Flow instance not set.");
      return;
    }

    if (nodes.length === 0) {
      const initialNodes = OnLoadHelper.initializeNodes(
        representationInstanceModel,
        instanceModel,
        selectedMetaModel,
        selectedRepresentationMetaModel
      );
      setNodes(initialNodes);
    }
  }, [
    instanceModel,
    nodes.length,
    representationInstanceModel,
    selectedMetaModel,
    reactFlowInstance,
    selectedRepresentationMetaModel,
    setNodes,
  ]);

  useEffect(() => {
    if (!reactFlowInstance) {
      console.log("React Flow instance not set.");
      return;
    }
    console.log("reactflow instance set", reactFlowInstance);

    if (edges.length === 0 && nodes.length > 0) {
      const initialEdges = OnLoadHelper.initializeEdges(
        nodes,
        onDoubleClickEdge,
        representationInstanceModel,
        instanceModel,
        selectedMetaModel,
        selectedRepresentationMetaModel
      );
      console.log("initializing Edges", initialEdges);
      setEdges(initialEdges);
    }
  }, [
    edges.length,
    instanceModel,
    nodes,
    reactFlowInstance,
    representationInstanceModel,
    selectedMetaModel,
    selectedRepresentationMetaModel,
    setEdges,
  ]);

  const updateInstanceModelWithNewNode = useCallback(
    (
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
    },
    [instanceModel, selectedMetaModel, nodes, dispatch]
  );

  const updateRepresentationInstanceModelWithNewNode = useCallback(
    (
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

      dispatch(
        updateRepresentationInstanceModel(newRepresentationInstanceModel)
      );
    },
    [representationInstanceModel, selectedRepresentationMetaModel, dispatch]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      console.log("onConnect called");
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
      const [modelUri] = metaRepresentationRef.split("#"); // use base URI to construct new URI
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
        type: "ClassEdge",
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
    [
      setEdges,
      selectedMetaModel,
      selectedRepresentationMetaModel,
      nodes,
      instanceModel,
      updateInstanceModelWithNewNode,
      updateRepresentationInstanceModelWithNewNode,
    ]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // first apply the changes to the nodes
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);

        // then apply the changes to the instance models
        changes.forEach((change) => {
          OnNodesChangeHelper.updateNodePosition(
            updatedNodes,
            change,
            instanceModel,
            representationInstanceModel,
            dispatch
          );
          OnNodesChangeHelper.removeNode(
            nds,
            change,
            instanceModel,
            representationInstanceModel,
            dispatch
          );
        });

        return updatedNodes;
      });
    },

    [representationInstanceModel, dispatch, instanceModel, setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      console.log("on Edge change:", changes);
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("onDragOver triggered"); // log drag over event
  }, []);

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

      const nodeHandles = representationInstanceObject.graphicalRepresentation
        ?.filter(
          (representationItem) => representationItem.shape === "connector"
        )
        .map((representationItem) => {
          return {
            id:
              representationItem.style.alignment === "left"
                ? "target-handle-" + instanceObject.name
                : "source-handle-" + instanceObject.name,
            position:
              representationItem.style.alignment === "left"
                ? Position.Left
                : Position.Right,
            x: representationItem.position.x,
            y: representationItem.position.y,
            type:
              representationItem.style.alignment === "left"
                ? ("target" as "target")
                : ("source" as "source"),
          };
        });

      const newNode: Node = {
        id: uniqueId,
        type: notationElementRepresentation.type, // ClassNode, EdgeNode
        handles: nodeHandles,
        position: position,
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

      console.log("nodes after drop:", nodes);
    },
    [
      nodes,
      selectedMetaModel,
      selectedRepresentationMetaModel,
      reactFlowInstance,
      representationInstanceModel,
      setNodes,
      updateInstanceModelWithNewNode,
      updateRepresentationInstanceModelWithNewNode,
    ]
  );

  console.log("current nodes:", nodes);
  console.log("current edges:", edges);

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
              setReactFlowInstance={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              snapToGrid={true}
              snapGrid={[15, 15]}
              showGrid={showGrid}
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
    </div>
  );
};

export default DiagramEditor;
