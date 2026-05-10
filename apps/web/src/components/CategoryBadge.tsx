import type { TaskCategory } from "@execution-os/shared";
import clsx from "clsx";

const styles: Record<TaskCategory, string> = {
  Money: "border-action/30 bg-action/10 text-action",
  "Career Growth": "border-cyan/30 bg-cyan/10 text-cyan",
  Health: "border-amber/30 bg-amber/10 text-amber"
};

export function CategoryBadge({ category }: { category: TaskCategory }) {
  return (
    <span className={clsx("rounded-full border px-3 py-1 text-xs font-black uppercase", styles[category])}>
      {category}
    </span>
  );
}
