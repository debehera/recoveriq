import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRunbooks, deleteRunbook, generateDrill, getTeamMembers } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { PageLoading, InlineSpinner } from "./Loading";
import { color, font, radius, space, shared } from "./theme";

export default function RunbookList() {
  const [runbooks, setRunbooks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatingId, setGeneratingId] = useState(null);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [rb, tm] = await Promise.all([getRunbooks(), getTeamMembers()]);
      setRunbooks(rb);
      setTeamMembers(tm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteRunbook(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGenerate(runbookId) {
    if (teamMembers.length === 0) {
      setError("No Team Member accounts available to assign this drill to.");
      return;
    }
    setGeneratingId(runbookId);
    setError("");
    try {
      const assignToUserId = teamMembers[0].id;
      const drill = await generateDrill(runbookId, assignToUserId);
      navigate("/drills", { state: { justGenerated: drill.title, assignedTo: teamMembers[0].username } });
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <div>
      <NavBar />
      <div style={shared.page} className="riq-fade-in">
        <div style={styles.headerRow}>
          <div>
            <h1 style={shared.h1}>Runbooks</h1>
            <p style={styles.subtitle}>Documented recovery plans for your critical systems</p>
          </div>
          <button style={shared.btnPrimary} onClick={() => navigate("/runbooks/new")}>
            + New Runbook
          </button>
        </div>

        {error && <p style={{ ...shared.errorBox, marginBottom: space.md }}>{error}</p>}

        {loading && <PageLoading label="Loading runbooks..." />}

        {!loading && runbooks.length === 0 && (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>📘</div>
            <p style={styles.emptyTitle}>No runbooks yet</p>
            <p style={styles.emptyText}>Create your first recovery plan to start generating AI-powered tabletop drills.</p>
            <button style={{ ...shared.btnPrimary, marginTop: space.md }} onClick={() => navigate("/runbooks/new")}>
              + New Runbook
            </button>
          </div>
        )}

        {!loading && runbooks.length > 0 && (
          <div className="riq-table-wrap" style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>System</th>
                  <th style={styles.th}>RTO</th>
                  <th style={styles.th}>RPO</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {runbooks.map((rb) => (
                  <tr key={rb.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{rb.name}</td>
                    <td style={styles.td}>{rb.systemName}</td>
                    <td style={styles.td}><span style={styles.pill}>{rb.rtoMinutes}m</span></td>
                    <td style={styles.td}><span style={styles.pill}>{rb.rpoMinutes}m</span></td>
                    <td style={{ ...styles.td, textAlign: "right", whiteSpace: "nowrap" }}>
                      <button style={styles.actionBtn} onClick={() => navigate(`/runbooks/${rb.id}/edit`)}>
                        Edit
                      </button>
                      <button
                        style={{ ...styles.actionBtn, ...styles.generateBtn }}
                        onClick={() => handleGenerate(rb.id)}
                        disabled={generatingId === rb.id}
                      >
                        {generatingId === rb.id ? (<><InlineSpinner /> Generating...</>) : "Generate Drill"}
                      </button>
                      <button
                        style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                        onClick={() => handleDelete(rb.id, rb.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: space.lg,
    gap: space.md,
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: font.size.sm,
    color: color.textMuted,
    margin: "4px 0 0",
  },
  tableWrap: {
    backgroundColor: color.card,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: font.size.xs,
    fontWeight: 700,
    color: color.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    backgroundColor: color.cardMuted,
    borderBottom: `1px solid ${color.border}`,
  },
  tr: {
    borderBottom: `1px solid ${color.border}`,
  },
  td: {
    padding: "14px 16px",
    fontSize: font.size.md,
    color: color.text,
  },
  pill: {
    backgroundColor: color.cardMuted,
    padding: "3px 10px",
    borderRadius: radius.pill,
    fontSize: font.size.sm,
    color: color.textMuted,
    fontWeight: 500,
  },
  actionBtn: {
    marginLeft: "8px",
    padding: "7px 13px",
    borderRadius: radius.sm,
    border: `1px solid ${color.border}`,
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: font.size.sm,
    fontWeight: 500,
    color: color.text,
  },
  generateBtn: {
    backgroundColor: color.accent,
    color: "#fff",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: color.dangerBg,
    color: color.danger,
    border: "none",
  },
  emptyCard: {
    ...shared.card,
    textAlign: "center",
    padding: `${space.xxl} ${space.lg}`,
  },
  emptyIcon: { fontSize: "36px", marginBottom: space.sm },
  emptyTitle: { fontSize: font.size.lg, fontWeight: 700, color: color.text, margin: 0 },
  emptyText: { fontSize: font.size.sm, color: color.textMuted, maxWidth: "360px", margin: "8px auto 0" },
};
