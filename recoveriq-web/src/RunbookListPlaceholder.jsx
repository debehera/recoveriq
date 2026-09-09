import NavBar from "./NavBar";

export default function RunbookListPlaceholder() {
  return (
    <div>
      <NavBar />
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h2>Runbook List (Admin)</h2>
        <p>You're logged in as Admin. This screen will be built in an upcoming milestone.</p>
      </div>
    </div>
  );
}