import React from 'react';
import { Bot, Split, Globe, MousePointerClick, Terminal } from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    // We attach the node type and label to the drag event
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    {
      type: 'agent',
      label: 'Agent',
      desc: 'AI agent with tools',
      icon: <Bot className="w-6 h-6 text-purple-500" />
    },
    {
      type: 'condition',
      label: 'Condition',
      desc: 'If/Else logic',
      icon: <Split className="w-6 h-6 text-orange-500" />
    },
    {
      type: 'http',
      label: 'HTTP Request',
      desc: 'Call external APIs',
      icon: <Globe className="w-6 h-6 text-blue-500" />
    },
    {
      type: 'trigger',
      label: 'Manual Trigger',
      desc: 'Start flow manually',
      icon: <MousePointerClick className="w-6 h-6 text-green-500" />
    },
    {
      type: 'custom',
      label: 'Custom Function',
      desc: 'Execute JS code',
      icon: <Terminal className="w-6 h-6 text-pink-500" />
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Add Nodes</h2>
        <p className="text-xs text-slate-500 mt-1">Drag nodes to the canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
            draggable
            className="group flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
          >
            <div className="mt-1 p-1.5 bg-slate-100 rounded-md group-hover:bg-white transition-colors">
              {node.icon}
            </div>
            <div>
              <span className="block font-medium text-sm text-slate-700">{node.label}</span>
              <span className="block text-xs text-slate-500 leading-tight mt-0.5">{node.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}