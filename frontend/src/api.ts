export type Printer = {
  id: number;
  name: string;
  model: string;
  ip_address: string;
  status: string;
};

export type Job = {
  id: number;
  title: string;
  status: string;
  created_at: string;
  printer_id: number;
};

const API_BASE = "/api";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

export const api = {
  health: () => http<{ status: string }>("/health"),
  listPrinters: () => http<Printer[]>("/printers"),
  createPrinter: (payload: Omit<Printer, "id">) =>
    http<Printer>("/printers", { method: "POST", body: JSON.stringify(payload) }),
  listJobs: () => http<Job[]>("/jobs"),
  createJob: (payload: { title: string; printer_id: number }) =>
    http<Job>("/jobs", { method: "POST", body: JSON.stringify(payload) }),
};
