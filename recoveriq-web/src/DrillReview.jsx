import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDrill } from "./api";
import NavBar from "./NavBar";
import Footer from "./Footer";

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
      <div style={styles.page}>
        <button style={styles.backBtn} onClick={() => navigate("/drills")}>← Back to Drills</button>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {drill && (
          <>
            <h2>{drill.title} — {drill.status}</h2>
            <p style={styles.meta}>Runbook: {drill.runbookName}</p>
            <p style={styles.premise}>{drill.premise}</p>

            {drill.steps.map((s) => (
              <div key={s.id} style={styles.stepCard}>
                <p style={styles.stepNum}>Step {s.stepOrder}</p>
                <p style={styles.situationLabel}>Situation</p>
                <p style={styles.situation}>{s.situation}</p>
                <p style={styles.questionLabel}>Question</p>
                <p style={styles.question}>{s.question}</p>
                <p style={styles.responseLabel}>Response</p>
                {s.response ? (
                  <p style={styles.response}>{s.response.responseText}</p>
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
  page: { padding: "32px", fontFamily: "sans-serif", minHeight: "80vh", maxWidth: "700px" },
  backBtn: { border: "none", background: "none", color: "#1E2761", cursor: "pointer", marginBottom: "12px", fontSize: "14px", padding: 0 },
  meta: { color: "#666", fontSize: "13px" },
  premise: { color: "#555", marginBottom: "20px" },
  stepCard: { backgroundColor: "#F5F7FC", padding: "20px", borderRadius: "10px", marginBottom: "14px" },
  stepNum: { fontWeight: "bold", color: "#1E2761", marginBottom: "8px" },
  situationLabel: { fontWeight: "bold", fontSize: "12px", color: "#666" },
  situation: { marginBottom: "10px" },
  questionLabel: { fontWeight: "bold", fontSize: "12px", color: "#666" },
  question: { marginBottom: "10px", fontWeight: "bold" },
  responseLabel: { fontWeight: "bold", fontSize: "12px", color: "#666" },
  response: { backgroundColor: "#fff", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" },
  noResponse: { color: "#999", fontStyle: "italic" },
  error: { color: "#C0392B" },
};