import { useNavigate } from "react-router-dom";
import { getSession, clearSession } from "./auth";

export default function NavBar() {
  const session = getSession();
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  if (!session) return null;

  return (
    <div style={styles.bar}>
      <div style={styles.left} onClick={() => navigate(session.role === "Admin" ? "/runbooks" : "/my-drills")}>
        RecoverIQ
      </div>
      <div style={styles.center}>
        {session.role === "Admin" ? (
          <>
            <span style={styles.link} onClick={() => navigate("/runbooks")}>Runbooks</span>
            <span style={styles.link} onClick={() => navigate("/drills")}>Drills</span>
          </>
        ) : (
          <span style={styles.link} onClick={() => navigate("/my-drills")}>My Drills</span>
        )}
      </div>
      <div style={styles.right}>
        <span style={styles.username}>{session.username}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  bar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 24px", backgroundColor: "#1E2761", color: "#fff", fontFamily: "sans-serif",
  },
  left: { fontWeight: "bold", fontSize: "18px", cursor: "pointer" },
  center: { display: "flex", gap: "20px" },
  link: { fontSize: "14px", cursor: "pointer" },
  right: { display: "flex", alignItems: "center", gap: "14px" },
  username: { fontSize: "13px", color: "#CADCFC" },
  logoutBtn: {
    padding: "6px 14px", borderRadius: "5px", border: "none",
    backgroundColor: "#3D5AFE", color: "#fff", fontSize: "13px", cursor: "pointer",
  },
};