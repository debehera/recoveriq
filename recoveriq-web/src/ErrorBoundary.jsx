import { Component } from "react";
import { color, font, space, shared } from "./theme";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a larger app this would report to a logging service.
    console.error("RecoverIQ crashed:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.wrap}>
          <div style={styles.card}>
            <div style={styles.icon} aria-hidden="true">⚠️</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.text}>
              RecoverIQ ran into an unexpected error. This has been logged — try reloading the page.
            </p>
            <button style={shared.btnPrimary} onClick={this.handleReload}>
              Reload RecoverIQ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
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
    maxWidth: "420px",
  },
  icon: { fontSize: "36px", marginBottom: space.sm },
  title: { fontSize: font.size.xl, fontWeight: 700, color: color.text, margin: "0 0 8px" },
  text: { fontSize: font.size.sm, color: color.textMuted, marginBottom: space.lg, lineHeight: 1.5 },
};
