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
  const [sectionBusy, setSectionBusy] = useState<Record<NavSection, boolean>>({
    dashboard: false,
    today: false,
    money: false,
    growth: false
  });
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (silent = false) => {
    setError(null);
    if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runAction = async (section: NavSection, action: () => Promise<void>, optimistic?: () => void) => {
    setSectionBusy((prev) => ({ ...prev, [section]: true }));
    setError(null);
    try {
      if (optimistic) optimistic();
      await action();
      void refresh(true);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed.");
      await refresh(true);
    } finally {
      setSectionBusy((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleFocus = (task: TaskDto) =>
    runAction("today", async () => {
      const focused = await api.focusTask(task.id);
      setFocusTask(focused);
    });

  const handleComplete = (task: TaskDto) =>
    runAction(
      "today",
      async () => {
        await api.completeTask(task.id);
        setFocusTask(null);
      },
      () => {
        setTasks((prev) => prev.filter((item) => item.id !== task.id));
        setTaskHistory((prev) => [{ ...task, status: "completed", completedAt: new Date().toISOString() }, ...prev]);
        setReality((prev) =>
          prev
            ? {
                ...prev,
                tasksCompleted: prev.tasksCompleted + 1,
                points: prev.points + task.points
              }
            : prev
        );
      }
    );

  const handleSkip = (task: TaskDto) =>
    runAction(
      "today",
      async () => {
        await api.skipTask(task.id);
        setFocusTask(null);
      },
      () => {
        const penalty = Math.max(5, Math.round(task.points * 0.7));
        setTasks((prev) => prev.filter((item) => item.id !== task.id));
        setTaskHistory((prev) => [{ ...task, status: "skipped", skippedAt: new Date().toISOString() }, ...prev]);
        setReality((prev) =>
          prev
            ? {
                ...prev,
                daysWasted: prev.daysWasted + 1,
                points: Math.max(0, prev.points - penalty)
              }
            : prev
        );
      }
    );

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
          busy={sectionBusy.today}
          profile={profile}
          reality={reality}
          tasks={tasks}
          history={taskHistory}
          onComplete={handleComplete}
          onFocus={handleFocus}
          onSkip={handleSkip}
          onAddTask={(input) =>
            runAction("today", async () => {
              await api.addTask(input);
            })
          }
          onUndoTask={(task) =>
            runAction(
              "today",
              async () => {
                await api.undoTask(task.id);
              },
              () => {
                setTaskHistory((prev) => prev.filter((item) => item.id !== task.id));
                setTasks((prev) =>
                  [{ ...task, status: "pending" as const, completedAt: undefined, skippedAt: undefined }, ...prev].slice(0, 3)
                );
              }
            )
          }
          onDeleteTask={(task) =>
            runAction(
              "today",
              async () => {
                await api.deleteTask(task.id);
              },
              () => {
                setTaskHistory((prev) => prev.filter((item) => item.id !== task.id));
                setTasks((prev) => prev.filter((item) => item.id !== task.id));
              }
            )
          }
        />
      ) : null}

      {!loading && active === "dashboard" && money && habits && reality ? (
        <DashboardOverview tasks={tasks} money={money} habits={habits} reality={reality} onNavigate={setActive} />
      ) : null}

      {!loading && active === "money" && money ? (
        <MoneyTracker
          busy={sectionBusy.money}
          money={money}
          onAddExpense={(input) =>
            runAction(
              "money",
              async () => {
                await api.addExpense(input);
              },
              () => {
                setMoney((prev) => {
                  if (!prev) return prev;
                  const amount = input.amount;
                  const nowIso = new Date().toISOString();
                  const recent = [
                    { id: `tmp-${Date.now()}`, amount, note: input.note, category: input.category, kind: input.kind, spentAt: nowIso },
                    ...prev.recentExpenses
                  ].slice(0, 5);
                  const next = { ...prev, recentExpenses: recent };
                  if (input.kind === "income") {
                    next.dailyIncome += amount;
                    next.monthlyIncome += amount;
                    next.monthlyNet += amount;
                  } else {
                    next.dailySpending += amount;
                    next.monthlySpending += amount;
                    next.monthlyNet -= amount;
                  }
                  return next;
                });
              }
            )
          }
          onUpdateExpense={(id, input) =>
            runAction(
              "money",
              async () => {
                await api.updateExpense(id, input);
              },
              () => {
                setMoney((prev) =>
                  prev
                    ? {
                        ...prev,
                        recentExpenses: prev.recentExpenses.map((item) =>
                          item.id === id ? { ...item, ...input, kind: input.kind ?? item.kind } : item
                        )
                      }
                    : prev
                );
              }
            )
          }
          onDeleteExpense={(id) =>
            runAction(
              "money",
              async () => {
                await api.deleteExpense(id);
              },
              () => {
                setMoney((prev) =>
                  prev ? { ...prev, recentExpenses: prev.recentExpenses.filter((item) => item.id !== id) } : prev
                );
              }
            )
          }
        />
      ) : null}

      {!loading && active === "growth" && habits && reality ? (
        <GrowthPanel
          api={api}
          busy={sectionBusy.growth}
          decisions={decisions}
          growthView={growthView}
          habits={habits}
          reality={reality}
          setGrowthView={setGrowthView}
          refresh={() => refresh(true)}
          setError={setError}
          setBusy={(value) =>
            setSectionBusy((prev) => ({
              ...prev,
              growth: typeof value === "function" ? value(prev.growth) : value
            }))
          }
        />
      ) : null}

      <BottomNav active={active} onChange={setActive} />

      {focusTask ? (
        <FocusMode
          busy={sectionBusy.today}
          task={focusTask}
          onClose={() => setFocusTask(null)}
          onComplete={() => handleComplete(focusTask)}
          onSkip={() => handleSkip(focusTask)}
        />
      ) : null}
    </main>
  );
}
