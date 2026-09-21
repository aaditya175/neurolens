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
    { id: "t1", label: "T1 (Anatomy)", badge: "T1" },
    { id: "t1ce", label: "T1+Contrast (Tumour Rim)", badge: "T1ce" },
    { id: "t2", label: "T2 (Fluid & Edema)", badge: "T2" },
    { id: "flair", label: "FLAIR (Swelling)", badge: "FLAIR" },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs">
      <div className="flex items-center gap-1 px-2.5 text-xs font-bold text-slate-700 border-r border-slate-200 mr-1">
        <Layers className="w-3.5 h-3.5 text-purple-600" />
        <span>Scan Type:</span>
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isSelected
                ? "bg-purple-600 text-white font-bold shadow-xs"
                : isPresent
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "text-slate-400 cursor-not-allowed line-through"
            }`}
          >
            <span>{seq.label}</span>
          </button>
        );
      })}
    </div>
  );
}
