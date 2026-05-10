"use client";

import type { DecisionDto } from "@execution-os/shared";
import { ArrowRight, Brain, Trash2 } from "lucide-react";
import { useState } from "react";

interface DecisionEngineProps {
  busy: boolean;
  history: DecisionDto[];
  onDecide: (input: string) => Promise<DecisionDto | null>;
  onDeleteDecision: (id: string) => void;
}

export function DecisionEngine({ busy, history, onDecide, onDeleteDecision }: DecisionEngineProps) {
  const [input, setInput] = useState("");
  const [decision, setDecision] = useState<DecisionDto | null>(null);

  const submit = async () => {
    if (input.trim().length < 5) return;
    const result = await onDecide(input.trim());
    if (result) setDecision(result);
  };

  return (
    <section className="space-y-4">
      <div className="panel rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2 text-action">
          <Brain className="h-5 w-5" />
          <p className="text-sm font-black uppercase tracking-[0.18em]">Decision</p>
        </div>
        <textarea
          className="field min-h-36 resize-none py-4"
          placeholder="What is unclear?"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button className="big-button mt-3 w-full bg-action text-slate-950" disabled={busy} onClick={submit}>
          Decide
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {decision ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-action/30 bg-action/10 p-4">
            <p className="text-sm font-bold uppercase text-action">Decision</p>
            <p className="mt-2 text-2xl font-black leading-tight text-textMain">{decision.decision}</p>
          </div>
          <div className="rounded-lg border border-cyan/30 bg-cyan/10 p-4">
            <p className="text-sm font-bold uppercase text-cyan">Action</p>
            <p className="mt-2 text-xl font-black leading-tight text-textMain">{decision.actionStep}</p>
          </div>
        </div>
      ) : null}

      <div className="panel rounded-lg p-4">
        <p className="text-sm font-bold text-textSoft">Decision History</p>
        <div className="mt-3 space-y-2">
          {history.length === 0 ? (
            <p className="rounded-lg bg-panelSoft p-3 text-sm font-bold text-textSoft">No decisions saved yet.</p>
          ) : null}
          {history.slice(0, 8).map((item) => (
            <article key={item.id} className="rounded-lg bg-panelSoft p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-black text-textMain">{item.decision}</p>
                  <p className="mt-1 break-words text-xs font-bold text-cyan">{item.actionStep}</p>
                  <p className="mt-2 text-xs font-bold uppercase text-textSoft">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger"
                  disabled={busy}
                  onClick={() => onDeleteDecision(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
