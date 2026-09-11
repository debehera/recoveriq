import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRunbook, updateRunbook, getRunbook } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { PageLoading, InlineSpinner } from "./Loading";
import { color, font, radius, space, shared } from "./theme";

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
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getRunbook(id)
        .then((rb) => {
          setName(rb.name);
          setSystemName(rb.systemName);
          setRtoMinutes(rb.rtoMinutes);
          setRpoMinutes(rb.rpoMinutes);
          setSteps(rb.steps.map((s) => s.description));
        })
        .catch((err) => setError(err.message))
        .finally(() => setInitialLoading(false));
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

  if (initialLoading) {
    return (
      <div>
        <NavBar />
        <div style={shared.page}><PageLoading label="Loading runbook..." /></div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div style={{ ...shared.page, maxWidth: "600px" }} className="riq-fade-in">
        <h1 style={shared.h1}>{isEdit ? "Edit Runbook" : "New Runbook"}</h1>
        <p style={styles.subtitle}>
          {isEdit ? "Update the recovery plan details below." : "Document a recovery plan for a critical system."}
        </p>

        <form onSubmit={handleSubmit} style={styles.card}>
          <label style={shared.label} htmlFor="name">Runbook Name</label>
          <input id="name" style={shared.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Payment Gateway Recovery" required />

          <label style={shared.label} htmlFor="systemName">System Name</label>
          <input id="systemName" style={shared.input} value={systemName} onChange={(e) => setSystemName(e.target.value)} placeholder="e.g. Payment Gateway" required />

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={shared.label} htmlFor="rto">RTO (minutes)</label>
              <input id="rto" style={shared.input} type="number" min="1" value={rtoMinutes} onChange={(e) => setRtoMinutes(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={shared.label} htmlFor="rpo">RPO (minutes)</label>
              <input id="rpo" style={shared.input} type="number" min="1" value={rpoMinutes} onChange={(e) => setRpoMinutes(e.target.value)} required />
            </div>
          </div>

          <label style={shared.label}>Recovery Steps</label>
          {steps.map((step, i) => (
            <div key={i} style={styles.stepRow}>
              <span style={styles.stepNum}>{i + 1}</span>
              <input
                style={{ ...shared.input, flex: 1 }}
                value={step}
                onChange={(e) => updateStep(i, e.target.value)}
                placeholder="Describe this recovery step"
              />
              {steps.length > 1 && (
                <button type="button" style={styles.removeBtn} onClick={() => removeStep(i)} aria-label={`Remove step ${i + 1}`}>
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" style={styles.addBtn} onClick={addStep}>
            + Add Step
          </button>

          {error && <p style={{ ...shared.errorBox, marginTop: space.md }}>{error}</p>}

          <div style={styles.actions}>
            <button type="button" style={shared.btnSecondary} onClick={() => navigate("/runbooks")}>
              Cancel
            </button>
            <button type="submit" style={shared.btnPrimary} disabled={saving}>
              {saving ? (<><InlineSpinner /> Saving...</>) : "Save Runbook"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  subtitle: { fontSize: font.size.sm, color: color.textMuted, margin: "4px 0 20px" },
  card: { ...shared.card, padding: space.lg },
  row: { display: "flex", gap: space.md },
  stepRow: { display: "flex", alignItems: "center", gap: space.sm, marginBottom: space.sm },
  stepNum: {
    width: "24px", height: "24px", borderRadius: "50%", backgroundColor: color.cardMuted,
    color: color.textMuted, fontSize: font.size.xs, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  removeBtn: {
    width: "34px", height: "34px", flexShrink: 0, border: "none", backgroundColor: color.dangerBg,
    color: color.danger, borderRadius: radius.sm, cursor: "pointer", fontSize: font.size.sm,
  },
  addBtn: {
    marginTop: "4px", padding: "9px 16px", border: `1.5px dashed ${color.navy}`, color: color.navy,
    backgroundColor: "transparent", borderRadius: radius.sm, cursor: "pointer", fontSize: font.size.sm, fontWeight: 600,
  },
  actions: { display: "flex", gap: space.sm, marginTop: space.lg, justifyContent: "flex-end" },
};
