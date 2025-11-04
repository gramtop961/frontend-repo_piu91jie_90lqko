import React from 'react';
import { Trash2 } from 'lucide-react';

export default function MembersList({ members, onSelect, onDelete, selectedId }) {
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur">
      <div className="px-4 py-3 text-sm font-semibold text-gray-800 border-b">Members ({members.length})</div>
      <ul className="max-h-64 overflow-auto divide-y">
        {members.map(m => (
          <li key={m.id} className={`flex items-center justify-between px-4 py-2 gap-3 ${selectedId === m.id ? 'bg-indigo-50' : ''}`}>
            <button onClick={() => onSelect(m)} className="flex items-center gap-3 flex-1 text-left">
              <img src={m.photo || ''} alt={m.name} className="w-10 h-10 rounded-lg object-cover border bg-gray-100" />
              <div>
                <div className="text-sm font-medium text-gray-800">{m.name}</div>
                <div className="text-xs text-gray-500">{m.gender || ''}</div>
              </div>
            </button>
            <button
              onClick={() => onDelete(m.id)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
        {!members.length && (
          <li className="px-4 py-6 text-sm text-gray-500">No members yet. Add from the form above.</li>
        )}
      </ul>
    </div>
  );
}
