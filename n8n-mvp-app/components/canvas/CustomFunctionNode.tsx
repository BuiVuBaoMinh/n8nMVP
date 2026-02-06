import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Code } from 'lucide-react';

const CustomFunctionNode = ({ data }: any) => {
  return (
    <div className="relative px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-600 min-w-50">
      <div className="flex items-center">
        <Code className="w-4 h-4 text-indigo-600 mr-2" />
        <div className="text-sm font-bold text-gray-700">Custom Function</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.label || 'Execute JS code'}</div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-600" />
    </div>
  );
};

export default memo(CustomFunctionNode);