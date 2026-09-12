import { useNavigate } from "react-router-dom";
import { getSession } from "./auth";
import { color, font, space, shared } from "./theme";

export default function NotFound() {
  const navigate = useNavigate();
  const session = getSession();

  function handleGoHome() {
    if (!session) {
      navigate("/login");
    } else if (session.role === "Admin") {
      navigate("/runbooks");
    } else {
      navigate("/my-drills");
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.icon} aria-hidden="true">🧭</div>
        <h1 style={styles.title}>Page not found</h1>
        <p style={styles.text}>The page you're looking for doesn't exist or may have moved.</p>
        <button style={shared.btnPrimary} onClick={handleGoHome}>
          {session ? "Back to RecoverIQ" : "Go to Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: color.bg,
    fontFamily: font.family,
    padding: space.lg,
  },
  card: {
    ...shared.card,
    textAlign: "center",
    padding: `${space.xxl} ${space.xl}`,
    maxWidth: "400px",
  },
  icon: { fontSize: "36px", marginBottom: space.sm },
  title: { fontSize: font.size.xl, fontWeight: 700, color: color.text, margin: "0 0 8px" },
  text: { fontSize: font.size.sm, color: color.textMuted, marginBottom: space.lg, lineHeight: 1.5 },
};
