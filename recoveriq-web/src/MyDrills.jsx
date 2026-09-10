import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDrills } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function MyDrills() {
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getDrills()
      .then(setDrills)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function statusLabel(status) {
    if (status === "Generated") return "Not Started";
    if (status === "InProgress") return "In Progress";
    return "Completed";
  }

  function actionLabel(status) {
    if (status === "Generated") return "Start";
    if (status === "InProgress") return "Continue";
    return "Review";
  }

  return (
    <div>
      <NavBar />
      <div style={styles.page}>
        <h2>My Drills</h2>
        {error && <p style={styles.error}>{error}</p>}
        {loading && <p>Loading...</p>}
        {!loading && drills.length === 0 && (
          <p style={styles.empty}>No drills assigned to you yet.</p>
        )}
        {!loading && drills.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Runbook</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {drills.map((d) => (
                <tr key={d.id} style={styles.tr}>
                  <td style={styles.td}>{d.title}</td>
                  <td style={styles.td}>{d.runbookName}</td>
                  <td style={styles.td}>{statusLabel(d.status)}</td>
                  <td style={styles.td}>
                    <button style={styles.actionBtn} onClick={() => navigate(`/my-drills/${d.id}`)}>
                      {actionLabel(d.status)}
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
  error: { color: "#C0392B", backgroundColor: "#FDEDEC", padding: "10px", borderRadius: "6px" },
  empty: { color: "#666" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
  trHead: { backgroundColor: "#1E2761", color: "#fff" },
  th: { textAlign: "left", padding: "10px 12px" },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "10px 12px" },
  actionBtn: {
    padding: "6px 14px", borderRadius: "5px", border: "none",
    backgroundColor: "#3D5AFE", color: "#fff", cursor: "pointer", fontSize: "13px",
  },
};