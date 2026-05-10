import type { RealityDashboardDto, TaskDto, UserProfile } from "@execution-os/shared";
import { Check, Flame, Plus, RotateCcw, Trash2, Play, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ProgressBar } from "@/components/ProgressBar";

type NewTaskCategory = "Money" | "Career Growth" | "Health";
const categories: NewTaskCategory[] = ["Money", "Career Growth", "Health"];

interface CommandCenterProps {
  busy: boolean;
  profile: UserProfile | null;
  reality: RealityDashboardDto;
  tasks: TaskDto[];
  history: TaskDto[];
  onFocus: (task: TaskDto) => void;
  onComplete: (task: TaskDto) => void;
  onSkip: (task: TaskDto) => void;
  onAddTask: (input: { title: string; category: NewTaskCategory; impact: number; effort: number }) => void;
  onUndoTask: (task: TaskDto) => void;
  onDeleteTask: (task: TaskDto) => void;
}

export function CommandCenter({
  busy,
  profile,
  reality,
  tasks,
  history,
  onFocus,
  onComplete,
  onSkip,
  onAddTask,
  onUndoTask,
  onDeleteTask
}: CommandCenterProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<NewTaskCategory>("Career Growth");
  const streakProgress = Math.min(100, (reality.currentStreak / 7) * 100);

  const submitTask = () => {
    const cleanTitle = title.trim();
    if (cleanTitle.length < 3) return;
    onAddTask({
      title: cleanTitle,
      category,
      impact: category === "Career Growth" ? 5 : 4,
      effort: 2
    });
    setTitle("");
  };

  return (
    <section className="space-y-4">
      <div className="panel rounded-lg p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-textSoft">Daily Command</p>
            <h2 className="text-3xl font-black text-textMain">Top 3</h2>
          </div>
          <div className="rounded-lg bg-panelSoft px-3 py-2 text-right">
            <div className="text-xl font-black text-action">{profile?.points ?? reality.points}</div>
            <div className="text-xs font-bold uppercase text-textSoft">points</div>
          </div>
        </div>

        <ProgressBar value={streakProgress} />
        <div className="mt-3 flex items-center gap-2 text-sm font-bold text-textSoft">
          <Flame className="h-4 w-4 text-amber" />
          {reality.currentStreak} day streak
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="panel rounded-lg p-5 text-center">
          <p className="text-xl font-black">Clear day.</p>
          <p className="mt-2 text-sm text-textSoft">Reality dashboard will keep the score.</p>
        </div>
      ) : null}

      {tasks.map((task) => (
        <article key={task.id} className="panel rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <CategoryBadge category={task.category} />
            <span className="text-sm font-black text-textSoft">#{task.priorityRank}</span>
          </div>

          <h3 className="text-xl font-black leading-tight text-textMain">{task.title}</h3>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              className="big-button bg-action text-slate-950"
              disabled={busy}
              onClick={() => onFocus(task)}
              aria-label={`Do now: ${task.title}`}
            >
              <Play className="h-5 w-5" />
            </button>
            <button
              className="big-button border border-line bg-panelSoft text-textMain"
              disabled={busy}
              onClick={() => onComplete(task)}
              aria-label={`Complete: ${task.title}`}
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              className="big-button border border-danger/40 bg-danger/10 text-danger"
              disabled={busy}
              onClick={() => onSkip(task)}
              aria-label={`Skip: ${task.title}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </article>
      ))}

      <section className="panel rounded-lg p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-textSoft">Add Command</p>
            <h3 className="text-xl font-black text-textMain">One clear task</h3>
          </div>
          <Plus className="h-5 w-5 text-action" />
        </div>

        <input
          className="field"
          maxLength={90}
          placeholder="What must move today?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <div className="mt-3 grid grid-cols-3 gap-2">
          {categories.map((item) => (
            <button
              key={item}
              className={clsx(
                "min-h-11 rounded-lg px-2 text-xs font-black transition",
                category === item ? "bg-action text-slate-950" : "border border-line bg-panelSoft text-textSoft"
              )}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="big-button mt-3 w-full bg-action text-slate-950" disabled={busy} onClick={submitTask}>
          <Plus className="h-5 w-5" />
          Add
        </button>
      </section>

      <section className="panel rounded-lg p-4">
        <div className="mb-3">
          <p className="text-sm font-bold text-textSoft">History</p>
          <h3 className="text-xl font-black text-textMain">Completed work</h3>
        </div>

        {history.length === 0 ? (
          <p className="rounded-lg bg-panelSoft p-3 text-sm font-bold text-textSoft">No task history yet.</p>
        ) : null}

        <div className="space-y-2">
          {history.slice(0, 10).map((task) => {
            const timestamp = task.completedAt ?? task.skippedAt ?? task.dueDate;
            return (
              <article key={task.id} className="rounded-lg border border-line bg-panelSoft p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-black text-textMain">{task.title}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-textSoft">
                      {task.status} · {new Date(timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {task.status === "completed" ? (
                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-action/10 text-action"
                        disabled={busy}
                        onClick={() => onUndoTask(task)}
                        aria-label={`Undo completed task: ${task.title}`}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    ) : null}
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger"
                      disabled={busy}
                      onClick={() => onDeleteTask(task)}
                      aria-label={`Delete task: ${task.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
