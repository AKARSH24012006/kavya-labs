import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kavya Labs — The AI back-office for Indian small businesses",
  description:
    "Kavya reads your invoices, WhatsApp orders and bank statements, then answers business questions in English, Hindi, Kannada and Tamil. Built in Bengaluru.",
  keywords: ["Kavya Labs", "AI for SMBs", "Bengaluru AI startup", "GST invoices", "multilingual AI"],
  openGraph: {
    title: "Kavya Labs — The AI back-office for Indian small businesses",
    description: "Ask your business anything, in your own language.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1222",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
