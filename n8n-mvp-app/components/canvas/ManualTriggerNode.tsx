import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MousePointerClick } from 'lucide-react';

const ManualTriggerNode = ({ data, selected }: any) => {
  return (
    <div 
      className={`relative px-4 py-2 shadow-md rounded-md min-w-50 border-2 transition-all duration-200
        hover:cursor-pointer active:cursor-grabbing
        ${selected 
          ? 'border-cyan-600 bg-cyan-200 shadow-cyan-200 shadow-lg' 
          : 'border-cyan-500 bg-white'
        }
      `}
    >
      <div className="flex items-center">
        <MousePointerClick className={`w-4 h-4 mr-2 ${selected ? 'text-cyan-700' : 'text-cyan-500'}`} />
        <div className="text-sm font-bold text-gray-700">Manual Trigger</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.label || 'Start flow manually'}</div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-cyan-500" />
    </div>
  );
};

export default memo(ManualTriggerNode);