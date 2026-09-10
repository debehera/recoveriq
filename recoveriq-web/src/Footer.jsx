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
    padding: "16px",
    fontSize: "12px",
    color: "#8494C4",
    backgroundColor: "#F2F4FA",
    fontFamily: "sans-serif",
    borderTop: "1px solid #E0E4F0",
  },
};