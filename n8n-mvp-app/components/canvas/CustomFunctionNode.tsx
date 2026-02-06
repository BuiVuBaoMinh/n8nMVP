import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Code } from 'lucide-react';

const CustomFunctionNode = ({ data, selected }: any) => {
  return (
    <div 
      className={`relative px-4 py-2 shadow-md rounded-md min-w-50 border-2 transition-all duration-200
        hover:cursor-pointer active:cursor-grabbing
        ${selected 
          ? 'border-indigo-700 bg-indigo-200 shadow-indigo-200 shadow-lg' 
          : 'border-indigo-600 bg-white'
        }
      `}
    >
      <div className="flex items-center">
        <Code className={`w-4 h-4 mr-2 ${selected ? 'text-indigo-700' : 'text-indigo-600'}`} />
        <div className="text-sm font-bold text-gray-700">Custom Function</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.label || 'Execute JS code'}</div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-600" />
    </div>
  );
};

export default memo(CustomFunctionNode);