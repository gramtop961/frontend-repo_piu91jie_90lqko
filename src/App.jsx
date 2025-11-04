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

  const upsertMember = (member) => {
    setMembers(prev => {
      const idx = prev.findIndex(m => m.id === member.id);
      if (idx === -1) return [...prev, member];
      const next = [...prev];
      next[idx] = member;
      return next;
    });
  };

  const addMemberWithRelation = ({ name, gender, bio, photo, anchorId, relation, siblingParentId }) => {
    const id = uid();
    const anchor = members.find(m => m.id === anchorId) || null;
    const newMember = { id, name: name.trim(), gender, bio, photo, parents: [], spouses: [] };

    const byId = (id) => members.find(m => m.id === id);

    const updateMember = (m) => setMembers(prev => prev.map(x => (x.id === m.id ? m : x)));

    const addParentChildLink = (parentId, childId) => {
      setMembers(prev => prev.map(m => {
        if (m.id === parentId) {
          const children = new Set([...(m.children || [])]);
          children.add(childId);
          return { ...m, children: Array.from(children) };
        }
        if (m.id === childId) {
          const parents = new Set([...(m.parents || [])]);
          parents.add(parentId);
          return { ...m, parents: Array.from(parents) };
        }
        return m;
      }));
    };

    const addSpouseLink = (aId, bId) => {
      setMembers(prev => prev.map(m => {
        if (m.id === aId) {
          const spouses = new Set([...(m.spouses || [])]);
          spouses.add(bId);
          return { ...m, spouses: Array.from(spouses) };
        }
        if (m.id === bId) {
          const spouses = new Set([...(m.spouses || [])]);
          spouses.add(aId);
          return { ...m, spouses: Array.from(spouses) };
        }
        return m;
      }));
    };

    // First, insert the new member
    setMembers(prev => [...prev, newMember]);

    // Then, wire up relations against the anchor
    if (anchor && relation) {
      if (relation === 'Father of' || relation === 'Mother of') {
        // New member becomes a parent of anchor
        addParentChildLink(id, anchor.id);
      }
      if (relation === 'Spouse of') {
        addSpouseLink(id, anchor.id);
      }
      if (relation === 'Son of' || relation === 'Daughter of') {
        // New member becomes child of anchor
        addParentChildLink(anchor.id, id);
      }
      if (relation === 'Brother of' || relation === 'Sister of') {
        // Share the same parents if anchor has them
        const parents = anchor.parents || [];
        parents.forEach(pId => addParentChildLink(pId, id));
      }
      if (relation === 'Nephew of' || relation === 'Niece of') {
        // Child of a selected sibling of anchor (siblingParentId required)
        if (siblingParentId) {
          addParentChildLink(siblingParentId, id);
        }
      }
    }

    setSelectedId(id);
  };

  const deleteMember = id => {
    setMembers(prev => {
      // Remove the member and clean relations
      const remaining = prev.filter(m => m.id !== id).map(m => ({
        ...m,
        parents: (m.parents || []).filter(pid => pid !== id),
        spouses: (m.spouses || []).filter(sid => sid !== id),
        children: (m.children || []).filter(cid => cid !== id),
      }));
      return remaining;
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
            <div className="text-xs text-gray-600">Add relatives (father, mother, spouse, son, daughter, etc.) and see a proper flowchart</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ControlsPanel
            members={members}
            selected={selected}
            onAdd={addMemberWithRelation}
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

      <footer className="py-8 text-center text-xs text-gray-500">Use relation types like Father/Mother/Spouse/Son/Daughter for accurate connections. Siblings inherit the same parents.</footer>
    </div>
  );
}
