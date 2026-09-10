import NavBar from "./NavBar";
import Footer from "./Footer";

export default function DrillListPlaceholder() {
  return (
    <div>
      <NavBar />
      <div style={{ padding: "40px", fontFamily: "sans-serif", minHeight: "80vh" }}>
        <h2>Drills</h2>
        <p>Drill history and review — coming in the next milestone.</p>
      </div>
      <Footer />
    </div>
  );
}