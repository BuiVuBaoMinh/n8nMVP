"use client";
import React, { useCallback, useRef, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  Node,
  OnNodesDelete // Import type for delete handler
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Trash2 } from 'lucide-react'; // Import Trash icon

import Sidebar from './Sidebar'; 
import Navbar from '@/components/layout/Navbar'; 

import ConditionNode from './ConditionNode';
import AgentNode from './AgentNode';
import ManualTriggerNode from './ManualTriggerNode';
import CustomFunctionNode from './CustomFunctionNode';
import HttpRequestNode from './HttpRequestNode';

// Define nodeTypes outside the component to prevent re-renders
const nodeTypes = { 
  condition: ConditionNode,
  agent: AgentNode,
  trigger: ManualTriggerNode,
  customFunction: CustomFunctionNode,
  httpRequest: HttpRequestNode
};

const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 250, y: 150 }, 
    data: { label: 'Start Webhook', jobType: 'trigger' }, 
    type: 'trigger',
  },
];

function FlowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Destructure deleteElements to handle manual deletion
  const { screenToFlowPosition, deleteElements } = useReactFlow();
  
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: type,
        position,
        data: { label: label, jobType: type },
        style: {}
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Handler for when nodes are deleted via Keyboard (Backspace/Delete)
  const onNodesDelete = useCallback<OnNodesDelete>((deleted) => {
    // If the currently selected node is among the deleted ones, clear selection
    if (deleted.some(node => node.id === selectedNodeId)) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  // Handler for the Manual Delete Button
  const handleDeleteSelected = useCallback(() => {
    if (selectedNodeId) {
      deleteElements({ nodes: [{ id: selectedNodeId }] });
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, deleteElements]);

  const handleSave = async () => {
    const workflowData = {
      ...(workflowId && { _id: workflowId }),
      name: "Example Workflow",
      nodes,
      edges,
    };

    const method = 'POST';

    const res = await fetch('/api/workflows', {
      method: method, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflowData),
    });

    const data = await res.json();
    
    if (res.ok) {
      setWorkflowId(data._id);
      alert(`Workflow Saved! ID: ${data._id}`);
    } else {
        alert("Error saving workflow");
    }
  };

  const handleRun = async () => {
    if (!workflowId) {
      alert("Please save the workflow first!");
      return;
    }

    const res = await fetch('/api/execution', { 
      method: 'POST', 
      body: JSON.stringify({ workflowId })
    });

    if (res.ok) alert('Execution Started!');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#ebf4f6]"> 
      <Navbar 
        onSave={handleSave} 
        onRun={handleRun} 
        isSaved={!!workflowId} 
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 bg-[#ebf4f6] relative" ref={reactFlowWrapper}>
          
          {/* Floating Delete Button - visible only when a node is selected */}
          {selectedNodeId && (
            <div className="absolute top-4 right-4 z-10 animate-fade-in">
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-white text-red-500 rounded-md shadow-md border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Node
              </button>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onNodesDelete={onNodesDelete} // Sync state on keyboard delete
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            deleteKeyCode={['Backspace', 'Delete']} // Ensure keys work
          >
            <Background color="#7ab2b2" gap={20} size={1} variant={BackgroundVariant.Dots}/>
            <Controls className="bg-white border-none shadow-md rounded-lg text-[#09637e] fill-[#09637e]" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}