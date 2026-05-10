export function ProgressBar({ value }: { value: number }) {
  const width = Math.min(100, Math.max(0, value));

  return (
    <div className="h-3 overflow-hidden rounded-full bg-panelSoft">
      <div className="h-full rounded-full bg-action transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}
