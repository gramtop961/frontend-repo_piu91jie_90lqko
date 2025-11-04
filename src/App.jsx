import React, { useMemo, useState } from 'react';
import ControlsPanel from './components/ControlsPanel.jsx';
import MembersList from './components/MembersList.jsx';
import TreeCanvas from './components/TreeCanvas.jsx';

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const selected = useMemo(() => members.find(m => m.id === selectedId) || null, [members, selectedId]);

  const addMember = data => {
    const id = uid();
    const parentExists = data.parentId && members.some(m => m.id === data.parentId);
    const newMember = { id, ...data, parentId: parentExists ? data.parentId : null };
    setMembers(prev => [...prev, newMember]);
    setSelectedId(id);
  };

  const deleteMember = id => {
    setMembers(prev => {
      const remaining = prev.filter(m => m.id !== id);
      return remaining.map(m => (m.parentId === id ? { ...m, parentId: null } : m));
    });
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">👨‍👩‍👧‍👦</div>
          <div>
            <div className="font-semibold text-gray-900">Apna Parivaar — Family Tree</div>
            <div className="text-xs text-gray-600">Add members, upload photos, and connect with accurate flow lines</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ControlsPanel
            members={members}
            selected={selected}
            onAdd={addMember}
            onDelete={deleteMember}
            onClearSelection={() => setSelectedId(null)}
          />
          <MembersList
            members={members}
            selectedId={selectedId}
            onSelect={m => setSelectedId(m.id)}
            onDelete={deleteMember}
          />
        </div>
        <div className="lg:col-span-2">
          <TreeCanvas
            members={members}
            selectedId={selectedId}
            onNodeClick={m => setSelectedId(m.id)}
          />
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">Lines are auto-routed to avoid mismatches. Arrange by setting correct parent when adding members.</footer>
    </div>
  );
}
