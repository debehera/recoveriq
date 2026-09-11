// RecoverIQ design tokens — single source of truth for colors, spacing, type.
// Import this anywhere instead of hardcoding hex values / px sizes.

export const color = {
  navy: "#1E2761",
  navyDark: "#161D4D",
  navyLight: "#2C3A82",
  ice: "#CADCFC",
  accent: "#3D5AFE",
  accentDark: "#2F46D6",
  bg: "#F7F8FC",
  card: "#FFFFFF",
  cardMuted: "#F5F7FC",
  border: "#E3E7F0",
  text: "#1A1D2B",
  textMuted: "#5B6B8C",
  textFaint: "#8494C4",
  success: "#1E7A34",
  successBg: "#EAF7EE",
  danger: "#C0392B",
  dangerBg: "#FDEDEC",
  warning: "#B7791F",
  warningBg: "#FEF6E7",
};

export const space = {
  xs: "6px",
  sm: "10px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
};

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  pill: "999px",
};

export const shadow = {
  sm: "0 1px 2px rgba(20, 26, 64, 0.06)",
  md: "0 4px 16px rgba(20, 26, 64, 0.08)",
  lg: "0 12px 32px rgba(20, 26, 64, 0.14)",
};

export const font = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  size: {
    xs: "12px",
    sm: "13px",
    md: "14px",
    lg: "16px",
    xl: "20px",
    xxl: "26px",
    display: "34px",
  },
};

// Shared building-block styles, reused across components
export const shared = {
  page: {
    padding: `${space.xl} ${space.xl} ${space.xxl}`,
    fontFamily: font.family,
    minHeight: "calc(100vh - 140px)",
    maxWidth: "960px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: color.card,
    border: `1px solid ${color.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
  },
  h1: {
    fontSize: font.size.xxl,
    fontWeight: 700,
    color: color.text,
    margin: 0,
    letterSpacing: "-0.02em",
  },
  label: {
    display: "block",
    fontSize: font.size.sm,
    fontWeight: 600,
    color: color.textMuted,
    marginBottom: space.xs,
    marginTop: space.md,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: radius.sm,
    border: `1px solid ${color.border}`,
    boxSizing: "border-box",
    fontFamily: font.family,
    fontSize: font.size.md,
    color: color.text,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    outline: "none",
  },
  btnPrimary: {
    padding: "11px 20px",
    borderRadius: radius.sm,
    border: "none",
    backgroundColor: color.navy,
    color: "#fff",
    fontSize: font.size.md,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.15s ease, transform 0.1s ease",
  },
  btnSecondary: {
    padding: "10px 18px",
    borderRadius: radius.sm,
    border: `1px solid ${color.border}`,
    backgroundColor: "#fff",
    color: color.text,
    fontSize: font.size.md,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.15s ease, border-color 0.15s ease",
  },
  btnDanger: {
    padding: "8px 14px",
    borderRadius: radius.sm,
    border: "none",
    backgroundColor: color.dangerBg,
    color: color.danger,
    fontSize: font.size.sm,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
  errorBox: {
    color: color.danger,
    backgroundColor: color.dangerBg,
    padding: `${space.sm} ${space.md}`,
    borderRadius: radius.sm,
    fontSize: font.size.sm,
    border: `1px solid rgba(192, 57, 43, 0.15)`,
  },
  emptyState: {
    textAlign: "center",
    padding: `${space.xxl} ${space.lg}`,
    color: color.textMuted,
    fontSize: font.size.md,
  },
};
