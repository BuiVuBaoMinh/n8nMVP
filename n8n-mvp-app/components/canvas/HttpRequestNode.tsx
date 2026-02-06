import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Globe } from 'lucide-react';

const HttpRequestNode = ({ data }: any) => {
  return (
    <div className="relative px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 min-w-50">
      <div className="flex items-center">
        <Globe className="w-4 h-4 text-blue-500 mr-2" />
        <div className="text-sm font-bold text-gray-700">HTTP Request</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.label || 'Send HTTP request'}</div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  );
};

export default memo(HttpRequestNode);