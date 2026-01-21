export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 32px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Logo */}
      <img
        src="/thorne-logo.svg"
        alt="THØRNE"
        style={{
          width: "130px",
          height: "auto",
          display: "block",
        }}
      />

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          gap: "28px",
          fontSize: "14px",
          color: "rgba(28,31,38,0.75)",
        }}
      >
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
          Features
        </a>
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
          Company
        </a>
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
          Docs
        </a>
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
          Pricing
        </a>
      </nav>

      {/* CTA */}
      <a
        href="/auth/login"
        style={{
          padding: "10px 18px",
          borderRadius: "999px",
          background: "#1C1F26",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Get Started
      </a>
    </header>
  );
}

