import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDrill, respondToStep } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { PageLoading, InlineSpinner } from "./Loading";
import { color, font, radius, space, shared, shadow } from "./theme";

const MAX_RESPONSE_LENGTH = 2000;

export default function DrillRunner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drill, setDrill] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const data = await getDrill(id);
      setDrill(data);
      const firstUnanswered = data.steps.findIndex((s) => !s.response);
      setCurrentIndex(firstUnanswered === -1 ? data.steps.length - 1 : firstUnanswered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = responseText.trim();
    if (!trimmed) {
      setError("Please enter a response before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    const step = drill.steps[currentIndex];

    try {
      const updated = await respondToStep(drill.id, step.id, trimmed);
      setDrill(updated);
      setResponseText("");

      if (currentIndex < updated.steps.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <PageWrap>
        <PageLoading label="Loading drill..." />
      </PageWrap>
    );
  }
  if (error && !drill) {
    return (
      <PageWrap>
        <p style={shared.errorBox}>{error}</p>
      </PageWrap>
    );
  }
  if (!drill) return null;

  const step = drill.steps[currentIndex];
  const isCompleted = drill.status === "Completed";
  const answeredCount = drill.steps.filter((s) => s.response).length;
  const charsRemaining = MAX_RESPONSE_LENGTH - responseText.length;

  return (
    <PageWrap>
      <button style={styles.backBtn} onClick={() => navigate("/my-drills")}>← Back to My Drills</button>

      <h1 style={shared.h1}>{drill.title}</h1>
      <p style={styles.premise}>{drill.premise}</p>

      <div style={styles.progressRow}>
        <span style={styles.progressLabel}>Step {currentIndex + 1} of {drill.steps.length}</span>
        <div style={styles.dots}>
          {drill.steps.map((s, i) => (
            <span
              key={s.id}
              style={{
                ...styles.dot,
                backgroundColor: s.response ? color.navy : color.border,
                ...(i === currentIndex ? styles.dotActive : {}),
              }}
            />
          ))}
        </div>
        <span style={styles.progressCount}>{answeredCount}/{drill.steps.length} answered</span>
      </div>

      {isCompleted && (
        <div style={styles.completeBanner}>
          <span aria-hidden="true" style={{ fontSize: "16px" }}>✅</span>
          <span>This drill is complete. Thank you for participating.</span>
        </div>
      )}

      <div style={styles.stepCard} className="riq-fade-in" key={step.id}>
        <p style={styles.sectionLabel}>Situation</p>
        <p style={styles.situation}>{step.situation}</p>
        <p style={styles.sectionLabel}>Question</p>
        <p style={styles.question}>{step.question}</p>

        {step.response ? (
          <div style={styles.answeredBox}>
            <p style={styles.answeredLabel}>Your response</p>
            <p style={styles.answeredText}>{step.response.responseText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              style={styles.textarea}
              rows={4}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value.slice(0, MAX_RESPONSE_LENGTH))}
              placeholder="Describe what you would do..."
              autoFocus
              maxLength={MAX_RESPONSE_LENGTH}
              aria-describedby="char-count"
            />
            <p id="char-count" style={{
              ...styles.charCount,
              color: charsRemaining < 100 ? color.warning : color.textFaint,
            }}>
              {charsRemaining} characters remaining
            </p>
            {error && <p role="alert" style={{ ...shared.errorBox, marginTop: space.sm }}>{error}</p>}
            <button type="submit" style={{ ...shared.btnPrimary, marginTop: space.sm }} disabled={submitting || !responseText.trim()}>
              {submitting ? (<><InlineSpinner /> Submitting...</>) : "Submit & Continue"}
            </button>
          </form>
        )}
      </div>

      <div style={styles.navRow}>
        <button
          style={shared.btnSecondary}
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          ← Previous
        </button>
        <button
          style={shared.btnSecondary}
          disabled={currentIndex === drill.steps.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
        >
          Next →
        </button>
      </div>
    </PageWrap>
  );
}

function PageWrap({ children }) {
  return (
    <div>
      <NavBar />
      <div style={{ ...shared.page, maxWidth: "680px" }}>{children}</div>
      <Footer />
    </div>
  );
}

const styles = {
  backBtn: {
    border: "none", background: "none", color: color.accent, cursor: "pointer",
    marginBottom: space.md, fontSize: font.size.sm, padding: 0, fontWeight: 600,
  },
  premise: { color: color.textMuted, marginBottom: space.lg, fontSize: font.size.md, lineHeight: 1.5 },
  progressRow: {
    display: "flex", alignItems: "center", gap: space.sm, marginBottom: space.md, flexWrap: "wrap",
  },
  progressLabel: { fontSize: font.size.sm, fontWeight: 600, color: color.text },
  dots: { display: "flex", gap: "6px" },
  dot: { width: "9px", height: "9px", borderRadius: "50%", transition: "background-color 0.2s ease" },
  dotActive: { boxShadow: `0 0 0 3px ${color.ice}` },
  progressCount: { fontSize: font.size.xs, color: color.textFaint, marginLeft: "auto" },
  completeBanner: {
    backgroundColor: color.successBg, color: color.success, padding: `${space.sm} ${space.md}`,
    borderRadius: radius.sm, marginBottom: space.md, display: "flex", alignItems: "center", gap: "8px",
    fontSize: font.size.sm, fontWeight: 600,
  },
  stepCard: { ...shared.card, padding: space.lg, boxShadow: shadow.md },
  sectionLabel: {
    fontWeight: 700, fontSize: font.size.xs, color: color.textFaint,
    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", marginTop: 0,
  },
  situation: { marginBottom: space.md, fontSize: font.size.md, lineHeight: 1.55, color: color.text },
  question: { marginBottom: space.md, fontWeight: 700, fontSize: font.size.lg, color: color.navy, lineHeight: 1.4 },
  textarea: {
    width: "100%", padding: "12px 14px", borderRadius: radius.sm, border: `1px solid ${color.border}`,
    boxSizing: "border-box", fontFamily: font.family, fontSize: font.size.md, resize: "vertical",
  },
  charCount: { fontSize: font.size.xs, margin: "6px 0 0", textAlign: "right" },
  answeredBox: { backgroundColor: color.cardMuted, padding: space.md, borderRadius: radius.sm, border: `1px solid ${color.border}` },
  answeredLabel: { fontWeight: 700, fontSize: font.size.xs, color: color.textMuted, marginBottom: "4px", marginTop: 0 },
  answeredText: { margin: 0, fontSize: font.size.md, color: color.text, lineHeight: 1.5 },
  navRow: { display: "flex", justifyContent: "space-between", marginTop: space.lg },
};
