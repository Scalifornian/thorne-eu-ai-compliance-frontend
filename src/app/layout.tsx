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
          minHeight: "100vh",
          margin: 0,
          color: "#1C1F26",
          fontFamily:
            "var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif",
          background:
            "radial-gradient(900px 600px at 20% 80%, rgba(238,230,255,0.45) 0%, rgba(238,230,255,0) 65%), radial-gradient(900px 600px at 85% 15%, rgba(220,240,255,0.45) 0%, rgba(220,240,255,0) 65%), linear-gradient(135deg, #F8FAFF 0%, #EEF2FF 40%, #F6F8FF 100%)",
        }}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
