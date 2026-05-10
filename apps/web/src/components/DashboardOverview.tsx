import type {
  HabitSummaryDto,
  MoneySummaryDto,
  NavSection,
  RealityDashboardDto,
  TaskDto
} from "@execution-os/shared";
import { ArrowRight, BarChart3, CheckCircle2, Wallet } from "lucide-react";
import { money as formatMoney, percent } from "@/lib/format";

interface DashboardOverviewProps {
  tasks: TaskDto[];
  money: MoneySummaryDto;
  habits: HabitSummaryDto;
  reality: RealityDashboardDto;
  onNavigate: (section: NavSection) => void;
}

export function DashboardOverview({ tasks, money, habits, reality, onNavigate }: DashboardOverviewProps) {
  const topTask = tasks[0];

  return (
    <section className="space-y-4">
      <div className="panel rounded-lg p-4">
        <p className="text-sm font-bold text-textSoft">Today Highlight</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-textMain">
          {topTask ? topTask.title : "No command waiting"}
        </h2>
        <button className="big-button mt-4 w-full bg-action text-slate-950" onClick={() => onNavigate("today")}>
          Today
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="panel rounded-lg p-4 text-left" onClick={() => onNavigate("money")}>
          <Wallet className="h-5 w-5 text-action" />
          <p className="mt-4 text-sm font-bold text-textSoft">Net this month</p>
          <p className="text-2xl font-black text-textMain">{formatMoney(money.monthlyNet)}</p>
        </button>

        <button className="panel rounded-lg p-4 text-left" onClick={() => onNavigate("growth")}>
          <BarChart3 className="h-5 w-5 text-cyan" />
          <p className="mt-4 text-sm font-bold text-textSoft">Growth score</p>
          <p className="text-2xl font-black text-textMain">{reality.growthScore}</p>
        </button>
      </div>

      <div className="panel rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-textSoft">Habit week</p>
            <p className="text-2xl font-black text-textMain">{percent(habits.completionRate)}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-action" />
        </div>
      </div>
    </section>
  );
}
