"use client";

import type { HabitSummaryDto } from "@execution-os/shared";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { percent } from "@/lib/format";

interface HabitBuilderProps {
  busy: boolean;
  summary: HabitSummaryDto;
  onAddHabit: (name: string) => void;
  onToggleHabit: (id: string, done: boolean) => void;
  onUpdateHabit: (id: string, name: string) => void;
  onDeleteHabit: (id: string) => void;
}

export function HabitBuilder({
  busy,
  summary,
  onAddHabit,
  onToggleHabit,
  onUpdateHabit,
  onDeleteHabit
}: HabitBuilderProps) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const submit = () => {
    if (name.trim().length < 2) return;
    onAddHabit(name.trim());
    setName("");
  };

  return (
    <section className="space-y-4">
      <div className="panel rounded-lg p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-textSoft">Weekly</p>
            <p className="text-3xl font-black text-textMain">{percent(summary.completionRate)}</p>
          </div>
          <div className="rounded-lg bg-panelSoft px-3 py-2 text-right">
            <p className="text-xl font-black text-action">{summary.remainingSlots}</p>
            <p className="text-xs font-bold uppercase text-textSoft">slots</p>
          </div>
        </div>
        <ProgressBar value={summary.completionRate} />
      </div>

      <div className="space-y-2">
        {summary.habits.map((habit) => (
          <div
            key={habit.id}
            className={clsx(
              "min-h-16 rounded-lg border p-3 transition",
              habit.doneToday ? "border-action bg-action/10" : "border-line bg-panel"
            )}
          >
            {editingId === habit.id ? (
              <div className="space-y-2">
                <input
                  className="field"
                  maxLength={40}
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="big-button bg-action text-slate-950"
                    disabled={busy}
                    onClick={() => {
                      if (editName.trim().length < 2) return;
                      onUpdateHabit(habit.id, editName.trim());
                      setEditingId(null);
                    }}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button className="big-button border border-line bg-panelSoft" onClick={() => setEditingId(null)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <button
                  className="min-w-0 flex-1 text-left"
                  disabled={busy}
                  onClick={() => onToggleHabit(habit.id, !habit.doneToday)}
                >
                  <span className="break-words font-black text-textMain">{habit.name}</span>
                </button>
                <button
                  className={clsx(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    habit.doneToday ? "bg-action text-slate-950" : "bg-panelSoft text-textSoft"
                  )}
                  disabled={busy}
                  onClick={() => onToggleHabit(habit.id, !habit.doneToday)}
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-panelSoft text-textSoft"
                  onClick={() => {
                    setEditingId(habit.id);
                    setEditName(habit.name);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger"
                  disabled={busy}
                  onClick={() => onDeleteHabit(habit.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {summary.remainingSlots > 0 ? (
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input
            className="field"
            maxLength={40}
            placeholder="New habit"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className="big-button bg-action px-5 text-slate-950" disabled={busy} onClick={submit}>
            <Plus className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
