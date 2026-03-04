import { useEffect, useMemo, useState } from "react";
import { api, Job, Printer } from "./api";

export function App() {
  const [health, setHealth] = useState<string>("…");
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string>("");

  const [printerName, setPrinterName] = useState("Office Printer");
  const [printerModel, setPrinterModel] = useState("BambuLab (mock)");
  const [printerIp, setPrinterIp] = useState("192.168.0.10");

  const [jobTitle, setJobTitle] = useState("Test job");
  const [jobPrinterId, setJobPrinterId] = useState<number | "">("");

  const printerOptions = useMemo(() => printers.map(p => ({ id: p.id, label: `${p.id}: ${p.name}` })), [printers]);

  async function refresh() {
    setError("");
    try {
      const h = await api.health();
      setHealth(h.status);
      const ps = await api.listPrinters();
      setPrinters(ps);
      const js = await api.listJobs();
      setJobs(js);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreatePrinter() {
    setError("");
    try {
      await api.createPrinter({
        name: printerName,
        model: printerModel,
        ip_address: printerIp,
        status: "idle",
      });
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function onCreateJob() {
    setError("");
    try {
      if (jobPrinterId === "") {
        setError("Выберите printer_id");
        return;
      }
      await api.createJob({ title: jobTitle, printer_id: jobPrinterId });
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial", padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>PrinterHub MVP</h1>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12, minWidth: 260 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Backend /health</div>
          <div style={{ fontSize: 20, marginTop: 6 }}>{health}</div>
          <button onClick={refresh} style={{ marginTop: 12 }}>Обновить</button>
        </div>

        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12, flex: 1, minWidth: 320 }}>
          <h2 style={{ marginTop: 0 }}>Добавить принтер</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <input value={printerName} onChange={(e) => setPrinterName(e.target.value)} placeholder="name" />
            <input value={printerModel} onChange={(e) => setPrinterModel(e.target.value)} placeholder="model" />
            <input value={printerIp} onChange={(e) => setPrinterIp(e.target.value)} placeholder="ip_address" />
            <button onClick={onCreatePrinter}>Создать</button>
          </div>
        </div>

        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12, flex: 1, minWidth: 320 }}>
          <h2 style={{ marginTop: 0 }}>Создать задание</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="title" />
            <select
              value={jobPrinterId}
              onChange={(e) => setJobPrinterId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">printer_id…</option>
              {printerOptions.map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <button onClick={onCreateJob}>Создать</button>
          </div>
        </div>
      </div>

      {error ? (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#ffe6e6", border: "1px solid #ffb3b3" }}>
          <b>Ошибка:</b> {error}
        </div>
      ) : null}

      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Printers</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">id</th>
                <th align="left">name</th>
                <th align="left">model</th>
                <th align="left">ip</th>
                <th align="left">status</th>
              </tr>
            </thead>
            <tbody>
              {printers.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.model}</td>
                  <td>{p.ip_address}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
              {printers.length === 0 ? (
                <tr><td colSpan={5} style={{ opacity: 0.7 }}>Пока пусто</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Jobs</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">id</th>
                <th align="left">title</th>
                <th align="left">status</th>
                <th align="left">created_at</th>
                <th align="left">printer_id</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td>{j.id}</td>
                  <td>{j.title}</td>
                  <td>{j.status}</td>
                  <td>{new Date(j.created_at).toLocaleString()}</td>
                  <td>{j.printer_id}</td>
                </tr>
              ))}
              {jobs.length === 0 ? (
                <tr><td colSpan={5} style={{ opacity: 0.7 }}>Пока пусто</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 18, opacity: 0.7, fontSize: 12 }}>
        UI обращается к backend по <code>/api</code> (nginx proxy) → backend работает с PostgreSQL.
      </div>
    </div>
  );
}
