import { useLocation, useNavigate } from "react-router-dom";
import { getSession, clearSession } from "./auth";
import { color, font, space, radius } from "./theme";

export default function NavBar() {
  const session = getSession();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  if (!session) return null;

  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  return (
    <div style={styles.bar} className="riq-navbar">
      <div
        style={styles.left}
        onClick={() => navigate(session.role === "Admin" ? "/runbooks" : "/my-drills")}
      >
        <span style={styles.logoMark}>⛨</span> RecoverIQ
      </div>
      <div style={styles.center} className="riq-navbar-center">
        {session.role === "Admin" ? (
          <>
            <NavLink label="Runbooks" active={isActive("/runbooks")} onClick={() => navigate("/runbooks")} />
            <NavLink label="Drills" active={isActive("/drills")} onClick={() => navigate("/drills")} />
          </>
        ) : (
          <NavLink label="My Drills" active={isActive("/my-drills")} onClick={() => navigate("/my-drills")} />
        )}
      </div>
      <div style={styles.right}>
        <span style={styles.roleBadge}>{session.role === "Admin" ? "Admin" : "Team Member"}</span>
        <span style={styles.username}>{session.username}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

function NavLink({ label, active, onClick }) {
  return (
    <span
      style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
      onClick={onClick}
    >
      {label}
    </span>
  );
}

const styles = {
  bar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `14px ${space.xl}`,
    backgroundColor: color.navy,
    color: "#fff",
    fontFamily: font.family,
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxShadow: "0 2px 12px rgba(20,26,64,0.12)",
  },
  left: {
    fontWeight: 700,
    fontSize: font.size.lg,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    letterSpacing: "-0.01em",
  },
  logoMark: {
    fontSize: "16px",
    opacity: 0.85,
  },
  center: {
    display: "flex",
    gap: "4px",
  },
  link: {
    fontSize: font.size.sm,
    fontWeight: 500,
    cursor: "pointer",
    padding: "7px 14px",
    borderRadius: radius.pill,
    color: "#C7D3F2",
    transition: "background-color 0.15s ease, color 0.15s ease",
  },
  linkActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
  },
  roleBadge: {
    fontSize: font.size.xs,
    fontWeight: 700,
    color: color.navy,
    backgroundColor: color.ice,
    padding: "3px 10px",
    borderRadius: radius.pill,
    letterSpacing: "0.02em",
  },
  username: {
    fontSize: font.size.sm,
    color: "#CADCFC",
  },
  logoutBtn: {
    padding: "7px 16px",
    borderRadius: radius.sm,
    border: "1px solid rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: font.size.sm,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
};
