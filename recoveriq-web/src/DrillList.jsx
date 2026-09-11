import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDrills } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { PageLoading } from "./Loading";
import { color, font, radius, space, shared } from "./theme";

const STATUS_MAP = {
  Generated: { label: "Not Started", bg: color.warningBg, fg: color.warning },
  InProgress: { label: "In Progress", bg: "#E7EEFE", fg: color.accent },
  Completed: { label: "Completed", bg: color.successBg, fg: color.success },
};

export default function DrillList() {
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const justGenerated = location.state?.justGenerated;
  const assignedTo = location.state?.assignedTo;

  useEffect(() => {
    getDrills()
      .then(setDrills)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <NavBar />
      <div style={shared.page} className="riq-fade-in">
        <h1 style={shared.h1}>Drills</h1>
        <p style={styles.subtitle}>AI-generated tabletop scenarios and their outcomes</p>

        {justGenerated && (
          <div style={styles.successBanner}>
            ✅ Drill <strong>"{justGenerated}"</strong> generated and assigned to <strong>{assignedTo}</strong>.
          </div>
        )}

        {error && <p style={{ ...shared.errorBox, marginTop: space.md }}>{error}</p>}
        {loading && <PageLoading label="Loading drills..." />}

        {!loading && drills.length === 0 && (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🗂</div>
            <p style={styles.emptyTitle}>No drills generated yet</p>
            <p style={styles.emptyText}>Go to Runbooks and click "Generate Drill" on one to create your first AI tabletop scenario.</p>
            <button style={{ ...shared.btnPrimary, marginTop: space.md }} onClick={() => navigate("/runbooks")}>
              Go to Runbooks
            </button>
          </div>
        )}

        {!loading && drills.length > 0 && (
          <div className="riq-table-wrap" style={{ backgroundColor: color.card }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Runbook</th>
                  <th style={styles.th}>Assigned To</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={{ ...styles.th, textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {drills.map((d) => {
                  const status = STATUS_MAP[d.status] || STATUS_MAP.Generated;
                  return (
                    <tr key={d.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{d.title}</td>
                      <td style={styles.td}>{d.runbookName}</td>
                      <td style={styles.td}>{d.assignedToUsername}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: status.bg, color: status.fg }}>
                          {status.label}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <button style={styles.actionBtn} onClick={() => navigate(`/drills/${d.id}`)}>
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
  subtitle: { fontSize: font.size.sm, color: color.textMuted, margin: "4px 0 20px" },
  successBanner: {
    backgroundColor: color.successBg, color: color.success, padding: `${space.sm} ${space.md}`,
    borderRadius: radius.sm, marginBottom: space.md, fontSize: font.size.sm,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left", padding: "12px 16px", fontSize: font.size.xs, fontWeight: 700, color: color.textMuted,
    textTransform: "uppercase", letterSpacing: "0.04em", backgroundColor: color.cardMuted, borderBottom: `1px solid ${color.border}`,
  },
  tr: { borderBottom: `1px solid ${color.border}` },
  td: { padding: "14px 16px", fontSize: font.size.md, color: color.text },
  badge: { fontSize: font.size.xs, fontWeight: 700, padding: "3px 10px", borderRadius: radius.pill },
  actionBtn: {
    padding: "7px 16px", borderRadius: radius.sm, border: "none",
    backgroundColor: color.accent, color: "#fff", cursor: "pointer", fontSize: font.size.sm, fontWeight: 600,
  },
  emptyCard: { ...shared.card, textAlign: "center", padding: `${space.xxl} ${space.lg}` },
  emptyIcon: { fontSize: "36px", marginBottom: space.sm },
  emptyTitle: { fontSize: font.size.lg, fontWeight: 700, color: color.text, margin: 0 },
  emptyText: { fontSize: font.size.sm, color: color.textMuted, maxWidth: "400px", margin: "8px auto 0" },
};
