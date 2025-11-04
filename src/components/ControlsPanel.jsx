import React, { useMemo, useRef, useState } from 'react';
import { Plus, ImageUp, Trash2 } from 'lucide-react';

const relationOptions = [
  'Father of',
  'Mother of',
  'Spouse of',
  'Son of',
  'Daughter of',
  'Brother of',
  'Sister of',
  'Nephew of',
  'Niece of',
];

export default function ControlsPanel({ members, selected, onAdd, onDelete, onClearSelection }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [anchorId, setAnchorId] = useState('');
  const [relation, setRelation] = useState('Son of');
  const [siblingParentId, setSiblingParentId] = useState('');
  const fileRef = useRef(null);

  const anchor = useMemo(() => members.find(m => m.id === anchorId) || null, [members, anchorId]);
  const anchorSiblings = useMemo(() => {
    if (!anchor) return [];
    const parents = anchor.parents || [];
    if (!parents.length) return [];
    const siblingsSet = new Set();
    members.forEach(m => {
      if (m.id !== anchor.id) {
        const p = m.parents || [];
        if (p.some(pid => parents.includes(pid))) siblingsSet.add(m.id);
      }
    });
    return members.filter(m => siblingsSet.has(m.id));
  }, [anchor, members]);

  const handlePhoto = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(String(ev.target?.result || ''));
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setName('');
    setGender('');
    setBio('');
    setPhoto('');
    setAnchorId('');
    setRelation('Son of');
    setSiblingParentId('');
    fileRef.current && (fileRef.current.value = '');
  };

  const autoGender = useMemo(() => {
    if (relation === 'Father of') return 'Male';
    if (relation === 'Mother of') return 'Female';
    if (relation === 'Son of') return 'Male';
    if (relation === 'Daughter of') return 'Female';
    if (relation === 'Brother of') return 'Male';
    if (relation === 'Sister of') return 'Female';
    if (relation === 'Nephew of') return 'Male';
    if (relation === 'Niece of') return 'Female';
    return '';
  }, [relation]);

  const submit = e => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!relation || !anchorId) {
      // allow root creation by leaving anchor empty and relation ignored
      onAdd({ name: name.trim(), gender: gender || autoGender || '', bio, photo, anchorId: null, relation: null, siblingParentId: null });
      reset();
      return;
    }
    const payload = {
      name: name.trim(),
      gender: gender || autoGender || '',
      bio,
      photo,
      anchorId,
      relation,
      siblingParentId: relation === 'Nephew of' || relation === 'Niece of' ? (siblingParentId || null) : null,
    };
    onAdd(payload);
    reset();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="rounded-xl border bg-white/70 backdrop-blur p-4 space-y-3">
        <div className="text-sm font-semibold text-gray-800">Add Relative</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-600">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Aakash Verma"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600">Gender</label>
            <select
              value={gender || autoGender}
              onChange={e => setGender(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">{autoGender ? `Auto: ${autoGender}` : 'Select'}</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600">Relation</label>
            <select
              value={relation}
              onChange={e => setRelation(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {relationOptions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-600">Relative Person</label>
            <select
              value={anchorId}
              onChange={e => setAnchorId(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">None (create as root)</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {(relation === 'Nephew of' || relation === 'Niece of') && anchor && anchorSiblings.length > 0 && (
            <div className="col-span-2">
              <label className="text-xs text-gray-600">Select the sibling who is the parent</label>
              <select
                value={siblingParentId}
                onChange={e => setSiblingParentId(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose sibling</option>
                {anchorSiblings.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-span-2">
            <label className="text-xs text-gray-600">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Few lines about the person"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-600">Photo</label>
            <div className="mt-1 flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="block w-full text-sm" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                <ImageUp className="w-4 h-4" /> Upload
              </button>
            </div>
            {photo && (
              <div className="mt-2">
                <img src={photo} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {selected && (
        <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">Selected</div>
            <button
              onClick={onClearSelection}
              className="text-xs text-indigo-600 hover:underline"
            >Clear</button>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <img src={selected.photo || ''} alt={selected.name} className="w-16 h-16 object-cover rounded-lg border bg-gray-100" />
            <div>
              <div className="font-semibold">{selected.name}</div>
              <div className="text-sm text-gray-600">{selected.gender || '—'}</div>
              <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{selected.bio || 'No bio'}</div>
            </div>
          </div>
          <button
            onClick={() => onDelete(selected.id)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
