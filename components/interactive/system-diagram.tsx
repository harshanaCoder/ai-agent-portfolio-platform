"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import type { DiagramEdge, DiagramNode } from "@/lib/mainData";

type SystemDiagramProps = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

const kindStyles: Record<string, string> = {
  sensor: "#35f6b8",
  ai: "#855cff",
  embedded: "#f6cb53",
  control: "#4adeff",
  actuator: "#ff6f91",
  monitor: "#9fb4d5"
};

export function SystemDiagram({ nodes, edges }: SystemDiagramProps) {
  const [activeId, setActiveId] = useState(nodes[0]?.id ?? "");

  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const activeNode = nodeMap.get(activeId) ?? nodes[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="glass-panel rounded-[1.5rem] p-4">
        <svg viewBox="0 0 100 84" className="h-[19rem] w-full">
          <defs>
            <linearGradient id="edgeGlow" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#4adeff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#855cff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#35f6b8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);

            if (!from || !to) {
              return null;
            }

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="url(#edgeGlow)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
          {nodes.map((node) => {
            const isActive = node.id === activeNode?.id;

            return (
              <g key={node.id} onClick={() => setActiveId(node.id)} className="cursor-pointer">
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 5.8 : 4.5}
                  fill={kindStyles[node.kind] ?? "#4adeff"}
                  animate={{ opacity: isActive ? 1 : 0.75 }}
                />
                <circle cx={node.x} cy={node.y} r={isActive ? 8.5 : 7} fill="none" stroke={kindStyles[node.kind] ?? "#4adeff"} strokeOpacity={isActive ? 0.45 : 0.2} />
                <text x={node.x} y={node.y + 10} fill="#e2e8f0" textAnchor="middle" fontSize="4">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="glass-panel rounded-[1.5rem] p-5">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/80">Component Focus</p>
        <h3 className="mt-3 font-display text-2xl text-white">{activeNode?.label}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{activeNode?.description}</p>
        <div className="mt-6 grid gap-2">
          {nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveId(node.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${node.id === activeNode?.id ? "border-cyan-300/30 bg-cyan-400/10 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"}`}
            >
              <span className="block text-sm font-medium">{node.label}</span>
              <span className="mt-1 block text-xs text-slate-400">{node.kind}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}