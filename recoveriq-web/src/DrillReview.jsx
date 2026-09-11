import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDrill } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { PageLoading } from "./Loading";
import { color, font, radius, space, shared } from "./theme";

const STATUS_MAP = {
  Generated: { label: "Not Started", bg: color.warningBg, fg: color.warning },
  InProgress: { label: "In Progress", bg: "#E7EEFE", fg: color.accent },
  Completed: { label: "Completed", bg: color.successBg, fg: color.success },
};

export default function DrillReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drill, setDrill] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDrill(id)
      .then(setDrill)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <NavBar />
      <div style={{ ...shared.page, maxWidth: "680px" }} className="riq-fade-in">
        <button style={styles.backBtn} onClick={() => navigate("/drills")}>← Back to Drills</button>

        {loading && <PageLoading label="Loading drill..." />}
        {error && <p style={shared.errorBox}>{error}</p>}

        {drill && (
          <>
            <div style={styles.titleRow}>
              <h1 style={shared.h1}>{drill.title}</h1>
              <span style={{
                ...styles.badge,
                backgroundColor: (STATUS_MAP[drill.status] || STATUS_MAP.Generated).bg,
                color: (STATUS_MAP[drill.status] || STATUS_MAP.Generated).fg,
              }}>
                {(STATUS_MAP[drill.status] || STATUS_MAP.Generated).label}
              </span>
            </div>
            <p style={styles.meta}>Runbook: {drill.runbookName}</p>
            <p style={styles.premise}>{drill.premise}</p>

            {drill.steps.map((s) => (
              <div key={s.id} style={styles.stepCard}>
                <p style={styles.stepNum}>Step {s.stepOrder}</p>
                <p style={styles.sectionLabel}>Situation</p>
                <p style={styles.situation}>{s.situation}</p>
                <p style={styles.sectionLabel}>Question</p>
                <p style={styles.question}>{s.question}</p>
                <p style={styles.sectionLabel}>Response</p>
                {s.response ? (
                  <div style={styles.responseBox}>{s.response.responseText}</div>
                ) : (
                  <p style={styles.noResponse}>No response submitted yet.</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  backBtn: {
    border: "none", background: "none", color: color.accent, cursor: "pointer",
    marginBottom: space.md, fontSize: font.size.sm, padding: 0, fontWeight: 600,
  },
  titleRow: { display: "flex", alignItems: "center", gap: space.sm, flexWrap: "wrap" },
  badge: { fontSize: font.size.xs, fontWeight: 700, padding: "4px 12px", borderRadius: radius.pill },
  meta: { color: color.textMuted, fontSize: font.size.sm, margin: "6px 0 0" },
  premise: { color: color.text, marginBottom: space.lg, fontSize: font.size.md, lineHeight: 1.55, marginTop: space.sm },
  stepCard: { ...shared.card, padding: space.lg, marginBottom: space.md },
  stepNum: { fontWeight: 700, color: color.navy, marginBottom: space.sm, marginTop: 0, fontSize: font.size.sm },
  sectionLabel: {
    fontWeight: 700, fontSize: font.size.xs, color: color.textFaint,
    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px",
  },
  situation: { marginBottom: space.sm, fontSize: font.size.md, color: color.text, lineHeight: 1.5 },
  question: { marginBottom: space.sm, fontWeight: 700, fontSize: font.size.md, color: color.navy },
  responseBox: {
    backgroundColor: color.cardMuted, padding: "12px 14px", borderRadius: radius.sm,
    border: `1px solid ${color.border}`, fontSize: font.size.md, color: color.text, lineHeight: 1.5,
  },
  noResponse: { color: color.textFaint, fontStyle: "italic", fontSize: font.size.sm },
};
