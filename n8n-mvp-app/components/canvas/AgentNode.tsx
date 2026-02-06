import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bot } from 'lucide-react';

const AgentNode = ({ data, selected }: any) => {
  return (
    <div 
      className={`relative px-4 py-2 shadow-md rounded-md min-w-50 border-2 transition-all duration-200
        hover:cursor-pointer active:cursor-grabbing
        ${selected 
          ? 'border-violet-600 bg-violet-200 shadow-violet-200 shadow-lg' 
          : 'border-violet-500 bg-white'
        }
      `}
    >
      <div className="flex items-center">
        <Bot className={`w-4 h-4 mr-2 ${selected ? 'text-violet-700' : 'text-violet-500'}`} />
        <div className="text-sm font-bold text-gray-700">Agent</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.label || 'AI Agent'}</div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-violet-500" />
    </div>
  );
};

export default memo(AgentNode);