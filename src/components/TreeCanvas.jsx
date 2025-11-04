import React, { useMemo } from 'react';
import MemberCard from './MemberCard.jsx';

const NODE_W = 180;
const NODE_H = 120;
const NODE_GAP_X = 60;
const LEVEL_GAP_Y = 160;
const PADDING = 40;

function buildMaps(members) {
  const byId = new Map(members.map(m => [m.id, m]));
  const childrenMap = new Map();
  members.forEach(m => {
    (m.children || []).forEach(cid => {
      if (!childrenMap.has(m.id)) childrenMap.set(m.id, new Set());
      childrenMap.get(m.id).add(cid);
    });
  });
  const parentsMap = new Map();
  members.forEach(m => {
    (m.parents || []).forEach(pid => {
      if (!parentsMap.has(m.id)) parentsMap.set(m.id, new Set());
      parentsMap.get(m.id).add(pid);
    });
  });
  const spousesMap = new Map();
  members.forEach(m => {
    (m.spouses || []).forEach(sid => {
      if (!spousesMap.has(m.id)) spousesMap.set(m.id, new Set());
      spousesMap.get(m.id).add(sid);
    });
  });
  return { byId, childrenMap, parentsMap, spousesMap };
}

function computeLevels(members) {
  const { parentsMap } = buildMaps(members);
  const level = new Map();
  const roots = members.filter(m => !parentsMap.get(m.id) || parentsMap.get(m.id).size === 0);
  // Initialize roots at level 0
  const queue = [];
  roots.forEach(r => { level.set(r.id, 0); queue.push(r.id); });

  // Multi-pass to settle levels
  for (let pass = 0; pass < members.length + 5; pass++) {
    members.forEach(m => {
      const parents = Array.from(parentsMap.get(m.id) || []);
      if (parents.length === 0) {
        if (!level.has(m.id)) level.set(m.id, 0);
      } else {
        const parentLevels = parents.map(pid => level.get(pid)).filter(v => v !== undefined);
        if (parentLevels.length > 0) {
          const l = Math.max(...parentLevels) + 1;
          const cur = level.get(m.id);
          if (cur === undefined || l > cur) level.set(m.id, l);
        }
      }
    });
  }

  // Group by level
  const maxLevel = Math.max(0, ...Array.from(level.values()));
  const levels = Array.from({ length: maxLevel + 1 }, () => []);
  members.forEach(m => {
    const l = level.get(m.id) ?? 0;
    levels[l].push(m);
  });
  return levels;
}

function groupSpouses(levelMembers) {
  // Build groups where a group is either a pair [a,b] (spouses) or single [a]
  const used = new Set();
  const groups = [];
  const spousesIndex = new Map(levelMembers.map(m => [m.id, new Set(m.spouses || [])]));
  levelMembers.forEach(m => {
    if (used.has(m.id)) return;
    const spouses = Array.from(spousesIndex.get(m.id) || []);
    const partner = spouses.find(sid => levelMembers.some(x => x.id === sid));
    if (partner && !used.has(partner)) {
      used.add(m.id); used.add(partner);
      groups.push([m, levelMembers.find(x => x.id === partner)]);
    } else {
      used.add(m.id);
      groups.push([m]);
    }
  });
  return groups;
}

export default function TreeCanvas({ members, selectedId, onNodeClick }) {
  const { levels, positions, canvasSize, connections, spouseLinks } = useMemo(() => {
    const levels = computeLevels(members);
    const positions = new Map();

    // Layout by levels with spouse grouping
    let canvasWidth = 800;
    const levelGroupings = levels.map(level => groupSpouses(level));
    const levelWidths = levelGroupings.map(groups => {
      const groupsCount = groups.length;
      if (groupsCount === 0) return 0;
      const width = groups.reduce((acc, g) => acc + (g.length === 2 ? NODE_W * 2 + 20 : NODE_W), 0) + (groupsCount - 1) * NODE_GAP_X;
      return width;
    });
    canvasWidth = Math.max(canvasWidth, ...levelWidths) + PADDING * 2;
    const canvasHeight = levels.length * NODE_H + Math.max(levels.length - 1, 0) * LEVEL_GAP_Y + PADDING * 2;

    levels.forEach((level, levelIndex) => {
      const groups = levelGroupings[levelIndex];
      const levelWidth = levelWidths[levelIndex] || 0;
      const startX = (canvasWidth - levelWidth) / 2;
      let cursorX = startX;
      const y = PADDING + levelIndex * (NODE_H + LEVEL_GAP_Y);
      groups.forEach(g => {
        if (g.length === 2) {
          positions.set(g[0].id, { x: cursorX, y });
          positions.set(g[1].id, { x: cursorX + NODE_W + 20, y });
          cursorX += NODE_W * 2 + 20 + NODE_GAP_X;
        } else {
          positions.set(g[0].id, { x: cursorX, y });
          cursorX += NODE_W + NODE_GAP_X;
        }
      });
    });

    // Connections: parent -> child. If two parents are spouses, draw from midpoint between them
    const parentsMap = new Map(members.map(m => [m.id, new Set(m.parents || [])]));
    const spouseSet = new Set();
    members.forEach(m => (m.spouses || []).forEach(sid => {
      const key = [m.id, sid].sort().join('::');
      spouseSet.add(key);
    }));

    const connections = [];
    members.forEach(child => {
      const parents = Array.from(parentsMap.get(child.id) || []);
      if (parents.length === 0) return;
      if (parents.length === 2) {
        const key = parents.slice().sort().join('::');
        if (spouseSet.has(key)) {
          // draw single connection from midpoint between spouses
          const p1 = positions.get(parents[0]);
          const p2 = positions.get(parents[1]);
          const ch = positions.get(child.id);
          if (p1 && p2 && ch) {
            const x1 = Math.min(p1.x, p2.x) + NODE_W + 10; // midpoint between spouses
            const y1 = p1.y + NODE_H;
            const x2 = ch.x + NODE_W / 2;
            const y2 = ch.y;
            const midY = (y1 + y2) / 2;
            connections.push({ x1, y1, x2, y2, midY });
            return;
          }
        }
      }
      // Fallback: draw from each parent individually
      parents.forEach(pid => {
        const p = positions.get(pid);
        const ch = positions.get(child.id);
        if (!p || !ch) return;
        const x1 = p.x + NODE_W / 2;
        const y1 = p.y + NODE_H;
        const x2 = ch.x + NODE_W / 2;
        const y2 = ch.y;
        const midY = (y1 + y2) / 2;
        connections.push({ x1, y1, x2, y2, midY });
      });
    });

    const spouseLinks = Array.from(spouseSet).map(key => {
      const [a, b] = key.split('::');
      const p1 = positions.get(a);
      const p2 = positions.get(b);
      if (!p1 || !p2) return null;
      return { x1: p1.x + NODE_W, y1: p1.y + NODE_H / 2, x2: p2.x, y2: p2.y + NODE_H / 2 };
    }).filter(Boolean);

    return {
      levels,
      positions,
      canvasSize: { width: Math.max(canvasWidth, 900), height: Math.max(canvasHeight, 500) },
      connections,
      spouseLinks,
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
            const d = `M ${c.x1} ${c.y1} L ${c.x1} ${c.midY} L ${c.x2} ${c.midY} L ${c.x2} ${c.y2}`;
            return <path key={`pc-${idx}`} d={d} stroke="#94a3b8" strokeWidth="2" fill="none" />;
          })}
          {spouseLinks.map((s, idx) => (
            <line key={`sp-${idx}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
          ))}
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
