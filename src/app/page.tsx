import localFont from "next/font/local";

const newYorkMedium = localFont({
  src: "../../public/fonts/new-york-extra-large/NewYorkExtraLarge-Medium.woff2",
  weight: "500",
  style: "normal",
  display: "swap",
});

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "180px 32px 0 32px", // moved the blocks lower
      }}
    >
      <div style={{ maxWidth: "740px" }}>
        <h1
          className={newYorkMedium.className}
          style={{
            fontSize: "72px",
            lineHeight: "0.95",
            fontWeight: 500,
            letterSpacing: "-0.025em",
            margin: 0,
            color: "#314D55",
          }}
        >
          Regulatory
          <br />
          intelligence,
          <br />
          engineered
          <br />
          for certainty
        </h1>

        <p
          style={{
            marginTop: "28px",
            fontFamily:
              "var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "20px",
            lineHeight: "1.2",
            fontWeight: 400,
	    letterSpacing: "0.03em",
            color: "#314D55",
            maxWidth: "560px",
          }}
        >
          Turn <b>EU AI Act requirements</b>  into clear,
          <br />
          auditable compliance that is documented,
          <br />
          structured, and <b>ready for regulators</b>.
        </p>
      </div>
    </main>
  );
}
