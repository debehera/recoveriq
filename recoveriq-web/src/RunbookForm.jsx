import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRunbook, updateRunbook, getRunbook } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function RunbookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [systemName, setSystemName] = useState("");
  const [rtoMinutes, setRtoMinutes] = useState("");
  const [rpoMinutes, setRpoMinutes] = useState("");
  const [steps, setSteps] = useState([""]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getRunbook(id).then((rb) => {
        setName(rb.name);
        setSystemName(rb.systemName);
        setRtoMinutes(rb.rtoMinutes);
        setRpoMinutes(rb.rpoMinutes);
        setSteps(rb.steps.map((s) => s.description));
      }).catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  function updateStep(index, value) {
    const copy = [...steps];
    copy[index] = value;
    setSteps(copy);
  }

  function addStep() {
    setSteps([...steps, ""]);
  }

  function removeStep(index) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    if (cleanSteps.length === 0) {
      setError("Add at least one recovery step.");
      return;
    }

    setSaving(true);
    const payload = {
      name,
      systemName,
      rtoMinutes: Number(rtoMinutes),
      rpoMinutes: Number(rpoMinutes),
      steps: cleanSteps,
    };

    try {
      if (isEdit) {
        await updateRunbook(id, payload);
      } else {
        await createRunbook(payload);
      }
      navigate("/runbooks");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <NavBar />
      <div style={styles.page}>
        <h2>{isEdit ? "Edit Runbook" : "New Runbook"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Name</label>
          <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />

          <label style={styles.label}>System Name</label>
          <input style={styles.input} value={systemName} onChange={(e) => setSystemName(e.target.value)} required />

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>RTO (minutes)</label>
              <input style={styles.input} type="number" min="1" value={rtoMinutes} onChange={(e) => setRtoMinutes(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>RPO (minutes)</label>
              <input style={styles.input} type="number" min="1" value={rpoMinutes} onChange={(e) => setRpoMinutes(e.target.value)} required />
            </div>
          </div>

          <label style={styles.label}>Recovery Steps</label>
          {steps.map((step, i) => (
            <div key={i} style={styles.stepRow}>
              <span style={styles.stepNum}>{i + 1}.</span>
              <input
                style={styles.stepInput}
                value={step}
                onChange={(e) => updateStep(i, e.target.value)}
                placeholder="Describe this recovery step"
              />
              {steps.length > 1 && (
                <button type="button" style={styles.removeBtn} onClick={() => removeStep(i)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" style={styles.addBtn} onClick={addStep}>
            + Add Step
          </button>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate("/runbooks")}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Saving..." : "Save Runbook"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: { padding: "32px", fontFamily: "sans-serif", minHeight: "80vh" },
  form: { maxWidth: "520px" },
  label: { display: "block", marginTop: "14px", marginBottom: "6px", fontSize: "14px", fontWeight: "bold" },
  input: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" },
  row: { display: "flex", gap: "16px" },
  stepRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" },
  stepNum: { width: "20px" },
  stepInput: { flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" },
  removeBtn: { padding: "6px 10px", border: "none", backgroundColor: "#C0392B", color: "#fff", borderRadius: "5px", cursor: "pointer", fontSize: "12px" },
  addBtn: { marginTop: "4px", padding: "8px 14px", border: "1px dashed #1E2761", backgroundColor: "transparent", borderRadius: "6px", cursor: "pointer" },
  error: { color: "#C0392B", marginTop: "14px" },
  actions: { display: "flex", gap: "10px", marginTop: "24px" },
  cancelBtn: { padding: "10px 18px", borderRadius: "6px", border: "1px solid #ccc", backgroundColor: "#fff", cursor: "pointer" },
  saveBtn: { padding: "10px 18px", borderRadius: "6px", border: "none", backgroundColor: "#1E2761", color: "#fff", cursor: "pointer", fontWeight: "bold" },
};