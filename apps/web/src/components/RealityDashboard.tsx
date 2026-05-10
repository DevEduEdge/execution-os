import type { RealityDashboardDto } from "@execution-os/shared";
import { Flame, Gauge, PiggyBank, TimerReset } from "lucide-react";
import { money, percent } from "@/lib/format";

const statClass = "panel rounded-lg p-4";

export function RealityDashboard({ reality }: { reality: RealityDashboardDto }) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className={statClass}>
          <TimerReset className="h-5 w-5 text-danger" />
          <p className="mt-4 text-3xl font-black text-textMain">{reality.daysWasted}</p>
          <p className="text-sm font-bold text-textSoft">Days wasted</p>
        </div>
        <div className={statClass}>
          <Gauge className="h-5 w-5 text-action" />
          <p className="mt-4 text-3xl font-black text-textMain">{reality.tasksCompleted}</p>
          <p className="text-sm font-bold text-textSoft">Tasks done</p>
        </div>
        <div className={statClass}>
          <PiggyBank className="h-5 w-5 text-cyan" />
          <p className="mt-4 text-3xl font-black text-textMain">{money(reality.moneySaved)}</p>
          <p className="text-sm font-bold text-textSoft">Money saved</p>
        </div>
        <div className={statClass}>
          <Flame className="h-5 w-5 text-amber" />
          <p className="mt-4 text-3xl font-black text-textMain">{reality.growthScore}</p>
          <p className="text-sm font-bold text-textSoft">Growth score</p>
        </div>
      </div>

      <div className="panel rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="font-black text-textMain">Habit week</p>
          <p className="font-black text-action">{percent(reality.weeklyHabitCompletionRate)}</p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-panelSoft">
          <div
            className="h-full rounded-full bg-action"
            style={{ width: `${Math.min(100, Math.max(0, reality.weeklyHabitCompletionRate))}%` }}
          />
        </div>
      </div>
    </section>
  );
}
