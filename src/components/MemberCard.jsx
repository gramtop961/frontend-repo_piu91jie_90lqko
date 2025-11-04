import React from 'react';
import { User } from 'lucide-react';

export default function MemberCard({ member, onClick, isSelected }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(member)}
      className={`relative w-[180px] h-[120px] rounded-xl border bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition-shadow text-left overflow-hidden ${
        isSelected ? 'ring-2 ring-indigo-500' : 'ring-1 ring-black/5'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/70 to-sky-50/60" />
      <div className="relative z-10 flex h-full">
        <div className="w-20 h-full flex items-center justify-center bg-white/60">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-7 h-7 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-1 p-3">
          <div className="font-semibold text-gray-800 leading-tight line-clamp-1">{member.name}</div>
          <div className="text-xs text-gray-600 line-clamp-2 mt-1">{member.bio || '—'}</div>
          <div className="text-[10px] text-gray-500 mt-2">{member.gender || ''}</div>
        </div>
      </div>
    </button>
  );
}
