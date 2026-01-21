export default function Home() {
  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "120px 32px 0 32px",
      }}
    >
      <div style={{ maxWidth: "740px" }}>
        <h1
          style={{
            fontSize: "64px",
            lineHeight: "1.05",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Regulatory intelligence,
          <br />
          engineered for
          <br />
          certainty.
        </h1>

        <p
          style={{
            marginTop: "20px",
            fontSize: "16px",
            lineHeight: "1.5",
            color: "rgba(28,31,38,0.75)",
            maxWidth: "520px",
          }}
        >
          Turn EU AI Act requirements into clear, auditable compliance that is
          documented, structured, and ready for regulators.
        </p>
      </div>
    </main>
  );
}
