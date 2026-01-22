export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 32px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Logo */}
      <img
        src="/thorne-logo.svg"
        alt="THØRNE"
        style={{
          width: "120px",
          height: "auto",
          display: "block",
        }}
      />

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          gap: "40px", // increased spacing
          color: "rgba(49, 77, 85, 0.9)",
          letterSpacing: "0.01em",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        }}
      >
        {["Features", "Company", "Resources", "Docs", "Helps", "Pricing"].map(
          (label) => (
            <a
              key={label}
              href="#"
              style={{
                fontSize: "16px",
                lineHeight: "1.4",
                fontWeight: 500,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {label}
            </a>
          )
        )}
      </nav>

      {/* Right actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <a
          href="/auth/login"
          style={{
            fontSize: "16px",
            lineHeight: "1.4",
            fontWeight: 500,
            color: "rgba(49, 77, 85, 0.9)",
            letterSpacing: "0.01em",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility",
            textDecoration: "none",
          }}
        >
          Log In
        </a>

        <a
          href="/auth/signup"
          style={{
            padding: "8px 14px",
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
      </div>
    </header>
  );
}
