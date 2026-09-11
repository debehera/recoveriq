import { color, font, space } from "./theme";

export function PageLoading({ label = "Loading..." }) {
  return (
    <div style={styles.wrap}>
      <span className="riq-spinner riq-spinner-dark" />
      <span style={styles.label}>{label}</span>
    </div>
  );
}

export function InlineSpinner() {
  return <span className="riq-spinner" style={{ marginRight: "8px" }} />;
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    padding: `${space.xxl} 0`,
    color: color.textMuted,
    fontSize: font.size.md,
    fontFamily: font.family,
  },
  label: {},
};
