import type {
  ApiEnvelope,
  DecisionDto,
  ExpenseDto,
  HabitSummaryDto,
  MoneySummaryDto,
  RealityDashboardDto,
  TaskDto,
  UserProfile
} from "@execution-os/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const REQUEST_TIMEOUT_MS = 12000;
const MAX_RETRIES = 1;

type TokenProvider = () => Promise<string | null>;

export class ApiClient {
  constructor(private readonly getToken: TokenProvider) {}

  private async fetchWithRetry(url: string, init: RequestInit) {
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(url, {
          ...init,
          signal: controller.signal
        });
        clearTimeout(timeout);
        return response;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;
        if (attempt === MAX_RETRIES) break;
      }
    }

    throw lastError instanceof Error ? lastError : new Error("Network request failed.");
  }

  private async request<T>(path: string, init: RequestInit = {}) {
    const token = await this.getToken();
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await this.fetchWithRetry(`${API_URL}${path}`, { ...init, headers });

    const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T> & {
      error?: string;
    };

    if (!response.ok) {
      throw new Error(payload.error ?? "Request failed.");
    }

    return payload.data;
  }

  session() {
    return this.request<UserProfile>("/auth/session", { method: "POST" });
  }

  todayTasks() {
    return this.request<TaskDto[]>("/tasks/today");
  }

  taskHistory() {
    return this.request<TaskDto[]>("/tasks/history");
  }

  addTask(input: {
    title: string;
    category: "Money" | "Career Growth" | "Health";
    impact?: number;
    effort?: number;
  }) {
    return this.request<TaskDto>("/tasks", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }

  focusTask(id: string) {
    return this.request<TaskDto>(`/tasks/${id}/focus`, { method: "POST" });
  }

  completeTask(id: string) {
    return this.request<TaskDto>(`/tasks/${id}/complete`, { method: "POST" });
  }

  skipTask(id: string) {
    return this.request<TaskDto>(`/tasks/${id}/skip`, { method: "POST" });
  }

  undoTask(id: string) {
    return this.request<TaskDto>(`/tasks/${id}/undo`, { method: "POST" });
  }

  deleteTask(id: string) {
    return this.request<{ ok: boolean }>(`/tasks/${id}`, { method: "DELETE" });
  }

  moneySummary() {
    return this.request<MoneySummaryDto>("/expenses/summary");
  }

  addExpense(input: { amount: number; note: string; category: string; kind: "expense" | "income" }) {
    return this.request<ExpenseDto>("/expenses", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }

  updateExpense(id: string, input: Partial<{ amount: number; note: string; category: string; kind: "expense" | "income" }>) {
    return this.request<ExpenseDto>(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  }

  deleteExpense(id: string) {
    return this.request<{ ok: boolean }>(`/expenses/${id}`, { method: "DELETE" });
  }

  habitSummary() {
    return this.request<HabitSummaryDto>("/habits/week");
  }

  addHabit(name: string) {
    return this.request<HabitSummaryDto>("/habits", {
      method: "POST",
      body: JSON.stringify({ name })
    });
  }

  updateHabit(id: string, name: string) {
    return this.request<HabitSummaryDto>(`/habits/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name })
    });
  }

  deleteHabit(id: string) {
    return this.request<HabitSummaryDto>(`/habits/${id}`, { method: "DELETE" });
  }

  logHabit(id: string, done: boolean) {
    return this.request<HabitSummaryDto>(`/habits/${id}/log`, {
      method: "POST",
      body: JSON.stringify({ done })
    });
  }

  decide(input: string) {
    return this.request<DecisionDto>("/decisions", {
      method: "POST",
      body: JSON.stringify({ input })
    });
  }

  decisionHistory() {
    return this.request<DecisionDto[]>("/decisions/history");
  }

  deleteDecision(id: string) {
    return this.request<{ ok: boolean }>(`/decisions/${id}`, { method: "DELETE" });
  }

  reality() {
    return this.request<RealityDashboardDto>("/reality");
  }

  resetSeed() {
    return this.request<{ ok: boolean }>("/seed/reset", { method: "POST" });
  }
}
