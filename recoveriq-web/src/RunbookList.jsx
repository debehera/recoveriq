import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRunbooks, deleteRunbook, generateDrill, getTeamMembers } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";

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

  async function handleDelete(id) {
    if (!window.confirm("Delete this runbook? This cannot be undone.")) return;
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
      alert(`Drill "${drill.title}" generated and assigned to ${teamMembers[0].username}!`);
      navigate("/drills");
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <div>
      <NavBar />
      <div style={styles.page}>
        <div style={styles.headerRow}>
          <h2>Runbooks</h2>
          <button style={styles.newBtn} onClick={() => navigate("/runbooks/new")}>
            + New Runbook
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && runbooks.length === 0 && (
          <p style={styles.empty}>No runbooks yet. Create your first one to get started.</p>
        )}

        {!loading && runbooks.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>System</th>
                <th style={styles.th}>RTO</th>
                <th style={styles.th}>RPO</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {runbooks.map((rb) => (
                <tr key={rb.id} style={styles.tr}>
                  <td style={styles.td}>{rb.name}</td>
                  <td style={styles.td}>{rb.systemName}</td>
                  <td style={styles.td}>{rb.rtoMinutes}m</td>
                  <td style={styles.td}>{rb.rpoMinutes}m</td>
                  <td style={styles.td}>
                    <button style={styles.actionBtn} onClick={() => navigate(`/runbooks/${rb.id}/edit`)}>
                      Edit
                    </button>
                    <button
                      style={{ ...styles.actionBtn, ...styles.generateBtn }}
                      onClick={() => handleGenerate(rb.id)}
                      disabled={generatingId === rb.id}
                    >
                      {generatingId === rb.id ? "Generating..." : "Generate Drill"}
                    </button>
                    <button
                      style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                      onClick={() => handleDelete(rb.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: { padding: "32px", fontFamily: "sans-serif", minHeight: "80vh" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  newBtn: {
    padding: "10px 18px", borderRadius: "6px", border: "none",
    backgroundColor: "#1E2761", color: "#fff", cursor: "pointer", fontWeight: "bold",
  },
  error: { color: "#C0392B", backgroundColor: "#FDEDEC", padding: "10px", borderRadius: "6px" },
  empty: { color: "#666" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
  trHead: { backgroundColor: "#1E2761", color: "#fff" },
  th: { textAlign: "left", padding: "10px 12px" },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "10px 12px" },
  actionBtn: {
    marginRight: "8px", padding: "6px 12px", borderRadius: "5px", border: "1px solid #ccc",
    backgroundColor: "#fff", cursor: "pointer", fontSize: "13px",
  },
  generateBtn: { backgroundColor: "#3D5AFE", color: "#fff", border: "none" },
  deleteBtn: { backgroundColor: "#C0392B", color: "#fff", border: "none" },
};