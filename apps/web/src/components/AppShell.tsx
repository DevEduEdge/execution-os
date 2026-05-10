"use client";

import type {
  DecisionDto,
  GrowthView,
  HabitSummaryDto,
  MoneySummaryDto,
  NavSection,
  RealityDashboardDto,
  TaskDto,
  UserProfile
} from "@execution-os/shared";
import { LogOut, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiClient } from "@/lib/api";
import { BottomNav } from "@/components/BottomNav";
import { CommandCenter } from "@/components/CommandCenter";
import { DashboardOverview } from "@/components/DashboardOverview";
import { FocusMode } from "@/components/FocusMode";
import { GrowthPanel } from "@/components/GrowthPanel";
import { MoneyTracker } from "@/components/MoneyTracker";

interface AppShellProps {
  displayName: string;
  getToken: () => Promise<string | null>;
  onSignOut: () => Promise<void>;
}

export function AppShell({ displayName, getToken, onSignOut }: AppShellProps) {
  const api = useMemo(() => new ApiClient(getToken), [getToken]);
  const [active, setActive] = useState<NavSection>("dashboard");
  const [growthView, setGrowthView] = useState<GrowthView>("habits");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskDto[]>([]);
  const [money, setMoney] = useState<MoneySummaryDto | null>(null);
  const [habits, setHabits] = useState<HabitSummaryDto | null>(null);
  const [decisions, setDecisions] = useState<DecisionDto[]>([]);
  const [reality, setReality] = useState<RealityDashboardDto | null>(null);
  const [focusTask, setFocusTask] = useState<TaskDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const currentProfile = await api.session();
      const [todayTasks, moneySummary, habitSummary, realitySummary, decisionHistory] = await Promise.all([
        api.todayTasks(),
        api.moneySummary(),
        api.habitSummary(),
        api.reality(),
        api.decisionHistory()
      ]);
      const history = await api.taskHistory();
      setProfile(currentProfile);
      setTasks(todayTasks);
      setTaskHistory(history);
      setMoney(moneySummary);
      setHabits(habitSummary);
      setDecisions(decisionHistory);
      setReality(realitySummary);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Unable to load Execution OS.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runAction = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleFocus = (task: TaskDto) =>
    runAction(async () => {
      const focused = await api.focusTask(task.id);
      setFocusTask(focused);
    });

  const handleComplete = (task: TaskDto) =>
    runAction(async () => {
      await api.completeTask(task.id);
      setFocusTask(null);
    });

  const handleSkip = (task: TaskDto) =>
    runAction(async () => {
      await api.skipTask(task.id);
      setFocusTask(null);
    });

  return (
    <main className="screen">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-action">Execution OS</p>
          <h1 className="mt-1 max-w-[15rem] truncate text-2xl font-black text-textMain">{displayName}</h1>
        </div>
        <div className="flex gap-2">
          <button className="icon-button" onClick={() => void refresh()} aria-label="Refresh">
            <RefreshCw className="h-5 w-5" />
          </button>
          <button className="icon-button" onClick={() => void onSignOut()} aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {error ? <div className="mb-4 rounded-lg border border-danger/50 bg-danger/10 p-3 text-sm">{error}</div> : null}

      {loading ? (
        <div className="space-y-3">
          <div className="h-36 animate-pulse rounded-lg bg-panel" />
          <div className="h-28 animate-pulse rounded-lg bg-panel" />
          <div className="h-28 animate-pulse rounded-lg bg-panel" />
        </div>
      ) : null}

      {!loading && active === "today" && reality ? (
        <CommandCenter
          busy={busy}
          profile={profile}
          reality={reality}
          tasks={tasks}
          history={taskHistory}
          onComplete={handleComplete}
          onFocus={handleFocus}
          onSkip={handleSkip}
          onAddTask={(input) =>
            runAction(async () => {
              await api.addTask(input);
            })
          }
          onUndoTask={(task) =>
            runAction(async () => {
              await api.undoTask(task.id);
            })
          }
          onDeleteTask={(task) =>
            runAction(async () => {
              await api.deleteTask(task.id);
            })
          }
        />
      ) : null}

      {!loading && active === "dashboard" && money && habits && reality ? (
        <DashboardOverview tasks={tasks} money={money} habits={habits} reality={reality} onNavigate={setActive} />
      ) : null}

      {!loading && active === "money" && money ? (
        <MoneyTracker
          busy={busy}
          money={money}
          onAddExpense={(input) =>
            runAction(async () => {
              await api.addExpense(input);
            })
          }
          onUpdateExpense={(id, input) =>
            runAction(async () => {
              await api.updateExpense(id, input);
            })
          }
          onDeleteExpense={(id) =>
            runAction(async () => {
              await api.deleteExpense(id);
            })
          }
        />
      ) : null}

      {!loading && active === "growth" && habits && reality ? (
        <GrowthPanel
          api={api}
          busy={busy}
          decisions={decisions}
          growthView={growthView}
          habits={habits}
          reality={reality}
          setGrowthView={setGrowthView}
          refresh={refresh}
          setError={setError}
          setBusy={setBusy}
        />
      ) : null}

      <BottomNav active={active} onChange={setActive} />

      {focusTask ? (
        <FocusMode
          busy={busy}
          task={focusTask}
          onClose={() => setFocusTask(null)}
          onComplete={() => handleComplete(focusTask)}
          onSkip={() => handleSkip(focusTask)}
        />
      ) : null}
    </main>
  );
}
