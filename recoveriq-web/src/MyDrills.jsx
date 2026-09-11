import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  function actionLabel(status) {
    if (status === "Generated") return "Start Drill";
    if (status === "InProgress") return "Continue";
    return "Review";
  }

  return (
    <div>
      <NavBar />
      <div style={shared.page} className="riq-fade-in">
        <h1 style={shared.h1}>My Drills</h1>
        <p style={styles.subtitle}>Tabletop exercises assigned to you</p>

        {error && <p style={{ ...shared.errorBox, marginTop: space.md }}>{error}</p>}
        {loading && <PageLoading label="Loading your drills..." />}

        {!loading && drills.length === 0 && (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🧭</div>
            <p style={styles.emptyTitle}>No drills assigned yet</p>
            <p style={styles.emptyText}>When an admin generates a drill and assigns it to you, it will show up here.</p>
          </div>
        )}

        {!loading && drills.length > 0 && (
          <div style={styles.list}>
            {drills.map((d) => {
              const status = STATUS_MAP[d.status] || STATUS_MAP.Generated;
              return (
                <div key={d.id} style={styles.cardRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.cardTitleRow}>
                      <p style={styles.cardTitle}>{d.title}</p>
                      <span style={{ ...styles.badge, backgroundColor: status.bg, color: status.fg }}>
                        {status.label}
                      </span>
                    </div>
                    <p style={styles.cardMeta}>Runbook: {d.runbookName}</p>
                  </div>
                  <button style={shared.btnPrimary} onClick={() => navigate(`/my-drills/${d.id}`)}>
                    {actionLabel(d.status)}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  subtitle: { fontSize: font.size.sm, color: color.textMuted, margin: "4px 0 24px" },
  list: { display: "flex", flexDirection: "column", gap: space.sm },
  cardRow: {
    ...shared.card,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${space.md} ${space.lg}`,
    gap: space.md,
    flexWrap: "wrap",
  },
  cardTitleRow: { display: "flex", alignItems: "center", gap: space.sm, flexWrap: "wrap" },
  cardTitle: { fontSize: font.size.lg, fontWeight: 700, color: color.text, margin: 0 },
  cardMeta: { fontSize: font.size.sm, color: color.textMuted, margin: "4px 0 0" },
  badge: {
    fontSize: font.size.xs, fontWeight: 700, padding: "3px 10px", borderRadius: radius.pill,
  },
  emptyCard: { ...shared.card, textAlign: "center", padding: `${space.xxl} ${space.lg}` },
  emptyIcon: { fontSize: "36px", marginBottom: space.sm },
  emptyTitle: { fontSize: font.size.lg, fontWeight: 700, color: color.text, margin: 0 },
  emptyText: { fontSize: font.size.sm, color: color.textMuted, maxWidth: "360px", margin: "8px auto 0" },
};
