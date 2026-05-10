"use client";

import type { MoneySummaryDto } from "@execution-os/shared";
import { AlertTriangle, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { money as formatMoney } from "@/lib/format";

type MoneyKind = "expense" | "income";
type MoneyCategory = "Food" | "Bills" | "Growth" | "Salary" | "Bonus" | "Other";
const expenseCategories: MoneyCategory[] = ["Food", "Bills", "Growth"];
const incomeCategories: MoneyCategory[] = ["Salary", "Bonus", "Other"];

interface MoneyTrackerProps {
  busy: boolean;
  money: MoneySummaryDto;
  onAddExpense: (input: { amount: number; note: string; category: string; kind: MoneyKind }) => void;
  onUpdateExpense: (
    id: string,
    input: Partial<{ amount: number; note: string; category: string; kind: MoneyKind }>
  ) => void;
  onDeleteExpense: (id: string) => void;
}

export function MoneyTracker({ busy, money, onAddExpense, onUpdateExpense, onDeleteExpense }: MoneyTrackerProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [kind, setKind] = useState<MoneyKind>("expense");
  const [category, setCategory] = useState<MoneyCategory>("Food");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");

  const submit = () => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    onAddExpense({ amount: parsed, note, category, kind });
    setAmount("");
    setNote("");
  };

  const categories = kind === "expense" ? expenseCategories : incomeCategories;

  const changeKind = (nextKind: MoneyKind) => {
    setKind(nextKind);
    setCategory(nextKind === "expense" ? "Food" : "Salary");
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="panel rounded-lg p-4">
          <p className="text-sm font-bold text-textSoft">Spent Today</p>
          <p className="mt-2 text-3xl font-black text-textMain">{formatMoney(money.dailySpending)}</p>
        </div>
        <div className="panel rounded-lg p-4">
          <p className="text-sm font-bold text-textSoft">Earned Today</p>
          <p className="mt-2 text-3xl font-black text-action">{formatMoney(money.dailyIncome)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="panel rounded-lg p-3">
          <p className="text-xs font-bold text-textSoft">Monthly Spent</p>
          <p className="mt-1 text-xl font-black">{formatMoney(money.monthlySpending)}</p>
        </div>
        <div className="panel rounded-lg p-3">
          <p className="text-xs font-bold text-textSoft">Earned</p>
          <p className="mt-1 text-xl font-black text-action">{formatMoney(money.monthlyIncome)}</p>
        </div>
        <div className="panel rounded-lg p-3">
          <p className="text-xs font-bold text-textSoft">Net</p>
          <p className={clsx("mt-1 text-xl font-black", money.monthlyNet >= 0 ? "text-action" : "text-danger")}>
            {formatMoney(money.monthlyNet)}
          </p>
        </div>
      </div>

      {money.warning ? (
        <div className="flex gap-3 rounded-lg border border-amber/40 bg-amber/10 p-4 text-amber">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">{money.warningMessage}</p>
        </div>
      ) : null}

      <div className="panel rounded-lg p-4">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            className={clsx(
              "min-h-11 rounded-lg text-sm font-black",
              kind === "expense" ? "bg-danger/20 text-danger" : "border border-line bg-panelSoft text-textSoft"
            )}
            onClick={() => changeKind("expense")}
          >
            Spend
          </button>
          <button
            className={clsx(
              "min-h-11 rounded-lg text-sm font-black",
              kind === "income" ? "bg-action text-slate-950" : "border border-line bg-panelSoft text-textSoft"
            )}
            onClick={() => changeKind("income")}
          >
            Earn
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input
            className="field"
            inputMode="decimal"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <button className="big-button bg-action px-5 text-slate-950" disabled={busy} onClick={submit}>
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <input
          className="field mt-3"
          placeholder="Label"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />

        <div className="mt-3 grid grid-cols-3 gap-2">
          {categories.map((item) => (
            <button
              key={item}
              className={clsx(
                "min-h-11 rounded-lg text-sm font-black transition",
                category === item ? "bg-action text-slate-950" : "border border-line bg-panelSoft text-textSoft"
              )}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {money.recentExpenses.map((expense) => (
          <div key={expense.id} className="rounded-lg bg-panel p-3">
            {editingId === expense.id ? (
              <div className="space-y-2">
                <input
                  className="field"
                  inputMode="decimal"
                  value={editAmount}
                  onChange={(event) => setEditAmount(event.target.value)}
                />
                <input className="field" value={editNote} onChange={(event) => setEditNote(event.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="big-button bg-action text-slate-950"
                    disabled={busy}
                    onClick={() => {
                      const parsed = Number(editAmount);
                      if (!Number.isFinite(parsed) || parsed <= 0) return;
                      onUpdateExpense(expense.id, { amount: parsed, note: editNote });
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
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-bold text-textMain">{expense.note || expense.category}</p>
                  <p className="text-xs font-bold uppercase text-textSoft">
                    {expense.kind} · {expense.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className={clsx("text-lg font-black", expense.kind === "income" ? "text-action" : "text-textMain")}>
                    {expense.kind === "income" ? "+" : "-"}
                    {formatMoney(expense.amount)}
                  </p>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-panelSoft text-textSoft"
                    onClick={() => {
                      setEditingId(expense.id);
                      setEditAmount(String(expense.amount));
                      setEditNote(expense.note);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger"
                    disabled={busy}
                    onClick={() => onDeleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
