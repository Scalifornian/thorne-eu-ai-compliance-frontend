"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = ["Features", "Company", "EU AI Act", "Applicability", "Pricing"];

function ThorneLogo({ width = 120 }: { width?: number }) {
  // Inline SVG wrapper that forces every fill/stroke to white.
  // If your SVG relies on currentColor, this also forces color to white.
  // If your SVG is complex (masks/filters), this still usually fixes it.
  return (
    <span
      aria-label="THØRNE"
      role="img"
      style={{
        display: "inline-block",
        width,
        height: "auto",
        color: "#ffffff",
      }}
    >
      {/* Option A: If your SVG file is simple, paste its <svg>...</svg> here */}
      {/* TEMP fallback: still uses <img>, but wrapped with filter to force white */}
      <img
        src="/thorne-logo.svg"
        alt="THØRNE"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          // Forces the rendered pixels to white regardless of original color.
          // This is the only way to force-color an <img>-loaded SVG from CSS.
          filter:
            "brightness(0) saturate(100%) invert(1)",
        }}
      />
    </span>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1300);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <header
      style={{
        padding: "20px 32px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        color: "#ffffff",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <ThorneLogo width={120} />

        {/* DESKTOP NAV */}
        {!isMobile && (
          <>
            <nav
              style={{
                display: "flex",
                gap: "40px",
                color: "#ffffff",
              }}
            >
              {NAV_ITEMS.map((label) => (
                <a
                  key={label}
                  href="#"
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "#ffffff",
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
              <a
                href="/auth/login"
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "1",
                  textDecoration: "none",
                  color: "#ffffff",
                }}
              >
                Log In
              </a>

              <a
                href="/auth/signup"
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.16)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Get Started
              </a>
            </div>
          </>
        )}

        {/* MOBILE HAMBURGER */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "none",
              fontSize: "26px",
              cursor: "pointer",
              color: "#ffffff",
            }}
          >
            ☰
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <div
          style={{
            marginTop: "20px",
            padding: "24px",
            borderRadius: "20px",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            color: "#ffffff",
          }}
        >
          {NAV_ITEMS.map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontSize: "18px",
                fontWeight: 500,
                textDecoration: "none",
                color: "#ffffff",
              }}
            >
              {label}
            </a>
          ))}

          <hr style={{ opacity: 0.15 }} />

          <a
            href="/auth/login"
            style={{
              fontSize: "16px",
              fontWeight: 500,
              textDecoration: "none",
              color: "#ffffff",
            }}
          >
            Log In
          </a>

          <a
            href="/auth/signup"
            style={{
              padding: "10px 16px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.16)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 500,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
