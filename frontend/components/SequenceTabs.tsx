"use client";

import React from "react";
import { Layers } from "lucide-react";

interface SequenceTabsProps {
  currentSequence: string;
  onSelectSequence: (seq: string) => void;
  availableSequences?: string[];
}

export function SequenceTabs({
  currentSequence,
  onSelectSequence,
  availableSequences = ["t1", "t1ce", "t2", "flair"],
}: SequenceTabsProps) {
  const sequences = [
    { id: "t1", label: "T1 Pre", desc: "Anatomy", badge: "T1" },
    { id: "t1ce", label: "T1ce", desc: "Contrast ET", badge: "T1+C" },
    { id: "t2", label: "T2", desc: "Fluid/Edema", badge: "T2" },
    { id: "flair", label: "FLAIR", desc: "Edema Infiltration", badge: "FLAIR" },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-clinical-surface border border-slate-800">
      <div className="flex items-center gap-1 px-2 text-xs font-semibold text-slate-400 border-r border-slate-800 mr-1">
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span>Sequence</span>
      </div>
      {sequences.map((seq) => {
        const isSelected = currentSequence.toLowerCase() === seq.id;
        const isPresent = availableSequences.map((s) => s.toLowerCase()).includes(seq.id);

        return (
          <button
            key={seq.id}
            type="button"
            disabled={!isPresent}
            onClick={() => onSelectSequence(seq.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              isSelected
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : isPresent
                ? "text-slate-300 hover:text-white hover:bg-slate-800/80"
                : "text-slate-600 cursor-not-allowed line-through"
            }`}
          >
            <span>{seq.label}</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                isSelected ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              {seq.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
