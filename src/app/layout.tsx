export const dynamic = 'force-dynamic'


import "./globals.css";
import localFont from "next/font/local";
import Header from "./components/Header";

const sfProDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/sf-pro-display/sf-pro-display-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/sf-pro-display/sf-pro-display-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/sf-pro-display/sf-pro-display-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});

export const metadata = {
  title: "THØRN EU AI Compliance",
  description: "EU AI Act compliance tooling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sfProDisplay.variable}>
      <body
        style={{
          color: "#1C1F26",
          fontFamily:
            "var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div id="thorn-bg" aria-hidden="true" />
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
