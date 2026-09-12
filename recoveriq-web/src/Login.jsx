import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./api";
import { saveSession } from "./auth";
import { color, radius, shadow, space, font } from "./theme";
import { InlineSpinner } from "./Loading";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username.trim(), password.trim());
      saveSession(result);

      if (result.role === "Admin") {
        navigate("/runbooks");
      } else {
        navigate("/my-drills");
      }
    } catch (err) {
      setError(
        err.message === "Request failed (0)" || err.message?.includes("fetch")
          ? "Can't reach the server right now. If it's been idle, it may take up to a minute to wake up — please try again."
          : err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="riq-fade-in">
        <div style={styles.badge}>⛨</div>
        <h1 style={styles.title}>RecoverIQ</h1>
        <p style={styles.subtitle}>Sign in to manage recovery drills</p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="username">Username</label>
          <input
            id="username"
            style={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
          />

          <label style={styles.label} htmlFor="password">Password</label>
          <input
            id="password"
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }} type="submit" disabled={loading}>
            {loading ? (<><InlineSpinner /> Logging in...</>) : "Log In"}
          </button>
        </form>

        <div style={styles.demoBox}>
          <p style={styles.demoTitle}>Demo accounts</p>
          <p style={styles.demoLine}><strong>Admin:</strong> admin1 / admin123</p>
          <p style={styles.demoLine}><strong>Team Member:</strong> member1 / member123</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: color.bg,
    backgroundImage: `radial-gradient(circle at 20% 20%, ${color.ice}33, transparent 40%), radial-gradient(circle at 80% 80%, ${color.ice}33, transparent 40%)`,
    fontFamily: font.family,
    padding: space.lg,
  },
  card: {
    backgroundColor: color.card,
    padding: "40px 36px",
    borderRadius: radius.lg,
    boxShadow: shadow.lg,
    width: "360px",
    border: `1px solid ${color.border}`,
  },
  badge: {
    width: "44px",
    height: "44px",
    borderRadius: radius.md,
    backgroundColor: color.navy,
    color: color.ice,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: space.md,
  },
  title: {
    fontSize: font.size.xxl,
    fontWeight: 700,
    color: color.navy,
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: font.size.sm,
    color: color.textMuted,
    marginTop: "6px",
    marginBottom: space.lg,
  },
  label: {
    display: "block",
    marginBottom: space.xs,
    fontSize: font.size.sm,
    fontWeight: 600,
    color: color.textMuted,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: radius.sm,
    border: `1px solid ${color.border}`,
    boxSizing: "border-box",
    fontSize: font.size.md,
    marginBottom: space.md,
    fontFamily: font.family,
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: radius.sm,
    border: "none",
    backgroundColor: color.navy,
    color: "#fff",
    fontSize: font.size.md,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: space.xs,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  buttonDisabled: {
    backgroundColor: color.navyLight,
  },
  error: {
    color: color.danger,
    backgroundColor: color.dangerBg,
    padding: `${space.sm} ${space.md}`,
    borderRadius: radius.sm,
    fontSize: font.size.sm,
    marginBottom: space.md,
    lineHeight: 1.4,
  },
  demoBox: {
    marginTop: space.lg,
    paddingTop: space.md,
    borderTop: `1px solid ${color.border}`,
  },
  demoTitle: {
    fontSize: font.size.xs,
    fontWeight: 700,
    color: color.textFaint,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    margin: 0,
    marginBottom: "8px",
  },
  demoLine: {
    fontSize: font.size.sm,
    color: color.textMuted,
    margin: "4px 0",
  },
};
