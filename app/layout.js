import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SplashCursor from "@/components/ui/SplashCursor";
import LightfallBackground from "@/components/Lightfallbackground";
import Footer from "@/components/Footer";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Slantyfix — Movie World Explorer",
  description: "Browse, search, and discover movies powered by AliHassan's SilverLoft.",
  icons: {
    icon: "/images/icon.png",
    shortcut: "/images/icon.png",
    apple: "/images/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${inter.variable} ${mono.variable}`}>
        <SplashCursor />
        <SmoothScroll>
          <div className="filmstrip" aria-hidden="true" />
          <Navbar />
          <LightfallBackground />
          <main className="site-main">{children}</main>
          <div className="filmstrip" aria-hidden="true" />
          <Footer/>
        </SmoothScroll>
      </body>
    </html>
  );
}