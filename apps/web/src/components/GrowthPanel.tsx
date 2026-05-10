"use client";

import type { Dispatch, SetStateAction } from "react";
import type { DecisionDto, GrowthView, HabitSummaryDto, RealityDashboardDto } from "@execution-os/shared";
import { Brain, Gauge, Repeat } from "lucide-react";
import clsx from "clsx";
import type { ApiClient } from "@/lib/api";
import { DecisionEngine } from "@/components/DecisionEngine";
import { HabitBuilder } from "@/components/HabitBuilder";
import { RealityDashboard } from "@/components/RealityDashboard";

const views: Array<{ id: GrowthView; label: string; icon: typeof Repeat }> = [
  { id: "habits", label: "Habits", icon: Repeat },
  { id: "decision", label: "Decide", icon: Brain },
  { id: "reality", label: "Reality", icon: Gauge }
];

interface GrowthPanelProps {
  api: ApiClient;
  busy: boolean;
  decisions: DecisionDto[];
  growthView: GrowthView;
  habits: HabitSummaryDto;
  reality: RealityDashboardDto;
  setGrowthView: (view: GrowthView) => void;
  refresh: () => Promise<void>;
  setError: Dispatch<SetStateAction<string | null>>;
  setBusy: Dispatch<SetStateAction<boolean>>;
}

export function GrowthPanel({
  api,
  busy,
  decisions,
  growthView,
  habits,
  reality,
  setGrowthView,
  refresh,
  setError,
  setBusy
}: GrowthPanelProps) {
  const runAction = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              className={clsx(
                "flex min-h-12 items-center justify-center gap-2 rounded-lg text-sm font-black transition",
                growthView === view.id ? "bg-action text-slate-950" : "border border-line bg-panel text-textSoft"
              )}
              onClick={() => setGrowthView(view.id)}
            >
              <Icon className="h-4 w-4" />
              {view.label}
            </button>
          );
        })}
      </div>

      {growthView === "habits" ? (
        <HabitBuilder
          busy={busy}
          summary={habits}
          onAddHabit={(name) => runAction(async () => void (await api.addHabit(name)))}
          onToggleHabit={(id, done) => runAction(async () => void (await api.logHabit(id, done)))}
          onUpdateHabit={(id, name) => runAction(async () => void (await api.updateHabit(id, name)))}
          onDeleteHabit={(id) => runAction(async () => void (await api.deleteHabit(id)))}
        />
      ) : null}

      {growthView === "decision" ? (
        <DecisionEngine
          busy={busy}
          onDecide={async (input) => {
            setBusy(true);
            setError(null);
            try {
              const result = await api.decide(input);
              await refresh();
              return result;
            } catch (error) {
              setError(error instanceof Error ? error.message : "Decision failed.");
              return null;
            } finally {
              setBusy(false);
            }
          }}
          history={decisions}
          onDeleteDecision={(id) => runAction(async () => void (await api.deleteDecision(id)))}
        />
      ) : null}

      {growthView === "reality" ? <RealityDashboard reality={reality} /> : null}
    </section>
  );
}
