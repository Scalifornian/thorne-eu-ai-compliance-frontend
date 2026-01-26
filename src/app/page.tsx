import localFont from "next/font/local";
import "./page.css";

const newYorkMedium = localFont({
  src: "../../public/fonts/new-york-extra-large/NewYorkExtraLarge-Medium.woff2",
  weight: "500",
  style: "normal",
  display: "swap",
});

const newYorkItalic = localFont({
  src: "../../public/fonts/new-york-extra-large/NewYorkExtraLarge-RegularItalic.woff2",
  weight: "400",
  style: "italic",
  display: "swap",
});

const sfPro = localFont({
  src: "../../public/fonts/sf-pro-display/sf-pro-display-regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
});

export default function Home() {
  return (
    <main className={`homeMain ${sfPro.className}`} style={{ color: "#ffffff" }}>
      <div className="hero">
        <div className="introRow">
          <span className="introRule" />

          <span
            className={`${newYorkItalic.className} introText`}
            style={{ color: "#ffffff" }}
          >
            Introducing Dorian
            <sup className="introTM" style={{ color: "#ffffff" }}>
              TM
            </sup>
          </span>

          <span className="introRule" />
        </div>

        <h1
          className={`${newYorkMedium.className} heroTitle`}
          style={{ color: "#ffffff" }}
        >
          Regulatory intelligence,
          <br />
          engineered for certainty
        </h1>

        <p className="heroSubtitle" style={{ color: "#ffffff" }}>
          Turn <b style={{ color: "#ffffff" }}>EU AI Act requirements</b> into
          clear, auditable compliance
          <br />
          that is documented, structured, and{" "}
          <b style={{ color: "#ffffff" }}>ready for regulators</b>.
        </p>

        {/* HERO IMAGE */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/dorian.jpg"
            alt="Dorian platform overview"
            style={{
              width: "100%",
              maxWidth: "900px",
              height: "auto",
              borderRadius: "16px",
            }}
          />
        </div>
      </div>

      {/* CORE FEATURES HEADER */}
      <div
        style={{
          textAlign: "center",
          marginTop: "72px",
          marginBottom: "16px",
        }}
      >
        <h2
          className={newYorkMedium.className}
          style={{
            color: "#ffffff",
            fontSize: "42px",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Core Features
        </h2>

        <p
          style={{
            marginTop: "8px",
            fontSize: "18px",
            opacity: 0.85,
            color: "#ffffff",
          }}
        >
          Regulatory compliance executed with precision.
        </p>
      </div>

      {/* FEATURE GRID */}
      <section className="featureGrid">
        {[
          {
            index: "01",
            title: "Article",
            subtitle: "Mapping",
            text:
              "Breaks the EU AI Act down article by article and links each obligation to your specific AI system, with clear traceability.",
          },
          {
            index: "02",
            title: "Audit",
            subtitle: "Documents",
            text:
              "Produces regulator-ready documentation that can be reviewed or submitted without manual rewriting.",
          },
          {
            index: "03",
            title: "Risk",
            subtitle: "Classification",
            text:
              "Identifies whether a system is prohibited, high-risk, limited-risk, or minimal-risk and explains the reasoning.",
          },
          {
            index: "04",
            title: "Ongoing",
            subtitle: "Compliance",
            text:
              "Updates assessments as systems, usage contexts, or regulatory interpretations change.",
          },
        ].map((item) => (
          <div className="featureItem" key={item.index}>
            <span className="featureIndex" style={{ color: "#ffffff" }}>
              {item.index}
            </span>

            <h3
              className={newYorkMedium.className}
              style={{ color: "#ffffff" }}
            >
              {item.title}
              <br />
              {item.subtitle}
            </h3>

            <p style={{ color: "#ffffff" }}>{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
