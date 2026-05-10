import type { TaskDto } from "@execution-os/shared";
import { Check, X } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";

interface FocusModeProps {
  busy: boolean;
  task: TaskDto;
  onClose: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

export function FocusMode({ busy, task, onClose, onComplete, onSkip }: FocusModeProps) {
  return (
    <section className="fixed inset-0 z-40 flex flex-col justify-between bg-base px-5 py-6">
      <div>
        <div className="flex items-center justify-between">
          <CategoryBadge category={task.category} />
          <button className="icon-button" onClick={onClose} aria-label="Close focus">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-16">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-action">Do Now</p>
          <h2 className="mt-4 text-5xl font-black leading-none text-textMain">{task.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="big-button bg-action text-slate-950" disabled={busy} onClick={onComplete}>
          <Check className="h-5 w-5" />
          Done
        </button>
        <button
          className="big-button border border-danger/40 bg-danger/10 text-danger"
          disabled={busy}
          onClick={onSkip}
        >
          <X className="h-5 w-5" />
          Skip
        </button>
      </div>
    </section>
  );
}
