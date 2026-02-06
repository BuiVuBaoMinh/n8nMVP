import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MousePointerClick } from 'lucide-react';

const ManualTriggerNode = ({ data }: any) => {
  return (
    <div className="relative px-4 py-2 shadow-md rounded-md bg-white border-2 border-cyan-500 min-w-50">
      <div className="flex items-center">
        <MousePointerClick className="w-4 h-4 text-cyan-500 mr-2" />
        <div className="text-sm font-bold text-gray-700">Manual Trigger</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.label || 'Start flow manually'}</div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-cyan-500" />
    </div>
  );
};

export default memo(ManualTriggerNode);