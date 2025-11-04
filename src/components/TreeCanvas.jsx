import React, { useMemo } from 'react';
import MemberCard from './MemberCard.jsx';

const NODE_W = 180;
const NODE_H = 120;
const NODE_GAP_X = 60;
const LEVEL_GAP_Y = 140;
const PADDING = 40;

function computeLevels(members) {
  const map = new Map(members.map(m => [m.id, m]));
  const roots = members.filter(m => !m.parentId || !map.has(m.parentId));
  const levels = [];
  levels.push(roots);
  const assigned = new Set(roots.map(m => m.id));
  let current = roots;
  while (current.length) {
    const next = members.filter(m => m.parentId && assigned.has(m.parentId) && !assigned.has(m.id));
    if (!next.length) break;
    levels.push(next);
    next.forEach(n => assigned.add(n.id));
    current = next;
  }
  // Add any unassigned members as additional root-level nodes
  const remaining = members.filter(m => !assigned.has(m.id));
  if (remaining.length) {
    levels[0] = [...(levels[0] || []), ...remaining];
  }
  return levels;
}

export default function TreeCanvas({ members, selectedId, onNodeClick }) {
  const { levels, positions, canvasSize, connections } = useMemo(() => {
    const levels = computeLevels(members);
    const positions = new Map();

    let canvasWidth = 0;
    const levelWidths = levels.map(level => level.length * NODE_W + Math.max(level.length - 1, 0) * NODE_GAP_X);
    canvasWidth = Math.max(...levelWidths, 0) + PADDING * 2;
    const canvasHeight = levels.length * NODE_H + Math.max(levels.length - 1, 0) * LEVEL_GAP_Y + PADDING * 2;

    levels.forEach((level, levelIndex) => {
      const levelWidth = levelWidths[levelIndex] || 0;
      const startX = (canvasWidth - levelWidth) / 2; // center each level
      level.forEach((member, i) => {
        const x = startX + i * (NODE_W + NODE_GAP_X);
        const y = PADDING + levelIndex * (NODE_H + LEVEL_GAP_Y);
        positions.set(member.id, { x, y });
      });
    });

    const connections = members
      .filter(m => m.parentId)
      .map(child => ({ childId: child.id, parentId: child.parentId }))
      .filter(conn => positions.has(conn.childId) && positions.has(conn.parentId));

    return {
      levels,
      positions,
      canvasSize: { width: Math.max(canvasWidth, 800), height: Math.max(canvasHeight, 400) },
      connections,
    };
  }, [members]);

  return (
    <div className="relative w-full overflow-auto border rounded-xl bg-white/50 backdrop-blur">
      <div
        className="relative"
        style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
      >
        <svg className="absolute inset-0" width={canvasSize.width} height={canvasSize.height}>
          {connections.map((c, idx) => {
            const p = positions.get(c.parentId);
            const ch = positions.get(c.childId);
            const x1 = p.x + NODE_W / 2;
            const y1 = p.y + NODE_H;
            const x2 = ch.x + NODE_W / 2;
            const y2 = ch.y;
            const midY = (y1 + y2) / 2;
            const d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
            return <path key={idx} d={d} stroke="#94a3b8" strokeWidth="2" fill="none" />;
          })}
        </svg>

        {members.map(m => {
          const pos = positions.get(m.id);
          if (!pos) return null;
          return (
            <div
              key={m.id}
              className="absolute"
              style={{ left: pos.x, top: pos.y, width: NODE_W, height: NODE_H }}
            >
              <MemberCard member={m} onClick={onNodeClick} isSelected={selectedId === m.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
