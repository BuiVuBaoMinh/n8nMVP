import React from 'react';
import { Bot, Split, Globe, MousePointerClick, Terminal, GripVertical } from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'trigger', label: 'Manual Trigger', desc: 'Start flow manually', icon: <MousePointerClick className="w-5 h-5" /> },
    { type: 'agent', label: 'AI Agent', desc: 'LLM with tools', icon: <Bot className="w-5 h-5" /> },
    { type: 'condition', label: 'Condition', desc: 'If/Else logic', icon: <Split className="w-5 h-5" /> },
    { type: 'http', label: 'HTTP Request', desc: 'API & Email', icon: <Globe className="w-5 h-5" /> },
    { type: 'custom', label: 'Custom Code', desc: 'Javascript Function', icon: <Terminal className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#7ab2b2]/20 h-full flex flex-col shadow-sm z-10">
      <div className="p-5 border-b border-[#7ab2b2]/20 bg-[#f8fdfe]">
        <h2 className="font-bold text-[#09637e] flex items-center gap-2">
          Node Palette
        </h2>
        <p className="text-xs text-[#088395]/80 mt-1">Drag nodes to the canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#ebf4f6]/50">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
            draggable
            className="group flex items-start gap-3 p-3 rounded-xl border border-white bg-white shadow-sm hover:border-[#088395] hover:shadow-md hover:translate-x-1 transition-all cursor-grab active:cursor-grabbing"
          >
            <div className={`mt-0.5 p-2 rounded-lg bg-[#ebf4f6] text-[#09637e] group-hover:bg-[#09637e] group-hover:text-white transition-colors`}>
              {node.icon}
            </div>
            <div className="flex-1">
              <span className="block font-bold text-sm text-[#09637e]">{node.label}</span>
              <span className="block text-[11px] text-[#7ab2b2] leading-tight mt-0.5 group-hover:text-[#088395]">{node.desc}</span>
            </div>
            <GripVertical className="w-4 h-4 text-[#7ab2b2]/30 mt-2" />
          </div>
        ))}
      </div>
    </aside>
  );
}