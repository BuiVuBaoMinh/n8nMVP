"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import ConditionNode from './ConditionNode';


const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 250, y: 150 }, 
    data: { label: 'Start Webhook', jobType: 'trigger' }, 
    type: 'input',
    style: { background: '#fff', border: '1px solid #777', borderRadius: '8px', padding: '10px', width: 150 }
  },
];

function FlowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: type === 'condition' ? 'condition' : (type === 'trigger' ? 'input' : 'default'),
        position,
        data: { label: label, jobType: type },
        style: type === 'condition' ? {} : { 
          background: '#fff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '10px', 
          width: 150 
        }
      };

      console.log(newNode);

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const nodeTypes = useMemo(() => ({
    condition: ConditionNode,
  }), []);

  const [workflowId, setWorkflowId] = useState<string | null> (null);

  const handleSave = async () => {
    const workflowData = {
      _id: workflowId,
      name: "Example Workflow",
      nodes,
      edges,
    };

    const res = await fetch('/api/workflows', {
      method: 'POST',
      body: JSON.stringify(workflowData),
    });

    const data = await res.json();
    if (res.ok) {
      setWorkflowId(data._id);
      alert(`Workflow Saved! ID: ${data._id}`);
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
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 z-10 shrink-0">
        <h1 className="font-bold text-xl text-slate-800">n8n Minimal</h1>
        <div className="flex gap-3">
          <button onClick={handleSave} className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 font-medium transition">
            Save
          </button>
          <button onClick={handleRun} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition shadow-sm">
            Run Workflow
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 bg-slate-50 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background color="#94a3b8" gap={16} size={1} variant={BackgroundVariant.Dots}/>
            <Controls />
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