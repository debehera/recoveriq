import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDrill, respondToStep } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";

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
    if (!responseText.trim()) return;

    setSubmitting(true);
    setError("");
    const step = drill.steps[currentIndex];

    try {
      const updated = await respondToStep(drill.id, step.id, responseText.trim());
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

  if (loading) return <PageWrap><p>Loading...</p></PageWrap>;
  if (error && !drill) return <PageWrap><p style={styles.error}>{error}</p></PageWrap>;
  if (!drill) return null;

  const step = drill.steps[currentIndex];
  const isCompleted = drill.status === "Completed";

  return (
    <PageWrap>
      <button style={styles.backBtn} onClick={() => navigate("/my-drills")}>← Back to My Drills</button>
      <h2>{drill.title}</h2>
      <p style={styles.premise}>{drill.premise}</p>

      <div style={styles.progress}>
        Step {currentIndex + 1} of {drill.steps.length}
        {" "}
        {drill.steps.map((s, i) => (
          <span key={s.id} style={{ ...styles.dot, backgroundColor: s.response ? "#1E2761" : "#ccc" }} />
        ))}
      </div>

      {isCompleted && currentIndex === drill.steps.length - 1 && step.response && (
        <p style={styles.completeBanner}>✅ This drill is complete. Thank you for participating.</p>
      )}

      <div style={styles.stepCard}>
        <p style={styles.situationLabel}>Situation</p>
        <p style={styles.situation}>{step.situation}</p>
        <p style={styles.questionLabel}>Question</p>
        <p style={styles.question}>{step.question}</p>

        {step.response ? (
          <div style={styles.answeredBox}>
            <p style={styles.answeredLabel}>Your response:</p>
            <p>{step.response.responseText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              style={styles.textarea}
              rows={4}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Describe what you would do..."
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit & Continue"}
            </button>
          </form>
        )}
      </div>

      <div style={styles.navRow}>
        <button
          style={styles.navBtn}
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          ← Previous
        </button>
        <button
          style={styles.navBtn}
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
      <div style={styles.page}>{children}</div>
      <Footer />
    </div>
  );
}

const styles = {
  page: { padding: "32px", fontFamily: "sans-serif", minHeight: "80vh", maxWidth: "700px" },
  backBtn: { border: "none", background: "none", color: "#1E2761", cursor: "pointer", marginBottom: "12px", fontSize: "14px", padding: 0 },
  premise: { color: "#555", marginBottom: "16px" },
  progress: { marginBottom: "16px", fontSize: "13px", color: "#666" },
  dot: { display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", marginLeft: "6px" },
  completeBanner: { backgroundColor: "#EAF7EE", color: "#1E7A34", padding: "10px 14px", borderRadius: "6px", marginBottom: "14px" },
  stepCard: { backgroundColor: "#F5F7FC", padding: "24px", borderRadius: "10px" },
  situationLabel: { fontWeight: "bold", fontSize: "13px", color: "#1E2761", marginBottom: "4px" },
  situation: { marginBottom: "16px" },
  questionLabel: { fontWeight: "bold", fontSize: "13px", color: "#1E2761", marginBottom: "4px" },
  question: { marginBottom: "16px", fontWeight: "bold" },
  textarea: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box", fontFamily: "sans-serif" },
  submitBtn: { marginTop: "10px", padding: "10px 20px", borderRadius: "6px", border: "none", backgroundColor: "#1E2761", color: "#fff", cursor: "pointer", fontWeight: "bold" },
  answeredBox: { backgroundColor: "#fff", padding: "14px", borderRadius: "6px", border: "1px solid #ddd" },
  answeredLabel: { fontWeight: "bold", fontSize: "13px", color: "#666", marginBottom: "4px" },
  error: { color: "#C0392B" },
  navRow: { display: "flex", justifyContent: "space-between", marginTop: "16px" },
  navBtn: { padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", backgroundColor: "#fff", cursor: "pointer" },
};