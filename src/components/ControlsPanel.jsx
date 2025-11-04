import React, { useEffect, useRef, useState } from 'react';
import { Plus, ImageUp, Trash2 } from 'lucide-react';

const roles = ['Super Admin', 'Family Admin', 'Sub Admin', 'Member'];

export default function ControlsPanel({ members, selected, onAdd, onDelete, onClearSelection }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Member');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [parentId, setParentId] = useState('');
  const [photo, setPhoto] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (selected) {
      // Show selected info in read-only view; do not populate form to avoid accidental edits
    }
  }, [selected]);

  const handlePhoto = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(String(ev.target?.result || ''));
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setName('');
    setRole('Member');
    setGender('');
    setBio('');
    setParentId('');
    setPhoto('');
    fileRef.current && (fileRef.current.value = '');
  };

  const submit = e => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), role, gender, bio, parentId: parentId || null, photo });
    reset();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="rounded-xl border bg-white/70 backdrop-blur p-4 space-y-3">
        <div className="text-sm font-semibold text-gray-800">Add Member</div>
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
            <label className="text-xs text-gray-600">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Gender</label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-600">Parent</label>
            <select
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">None (root)</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-600">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Few lines about the member"
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
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </form>

      {selected && (
        <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">Selected Member</div>
            <button
              onClick={onClearSelection}
              className="text-xs text-indigo-600 hover:underline"
            >Clear</button>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <img src={selected.photo || ''} alt={selected.name} className="w-16 h-16 object-cover rounded-lg border bg-gray-100" />
            <div>
              <div className="font-semibold">{selected.name}</div>
              <div className="text-sm text-gray-600">{selected.role} · {selected.gender || '—'}</div>
              <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{selected.bio || 'No bio'}</div>
            </div>
          </div>
          <button
            onClick={() => onDelete(selected.id)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" /> Delete Member
          </button>
        </div>
      )}
    </div>
  );
}
