import { color, font } from "./theme";

export default function Footer() {
  return (
    <div style={styles.footer}>
      Built with Claude as part of the AB Talks 60-Day Claude AI Challenge.
    </div>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "18px 16px",
    fontSize: font.size.xs,
    color: color.textFaint,
    backgroundColor: "#EEF1FA",
    fontFamily: font.family,
    borderTop: `1px solid ${color.border}`,
  },
};
