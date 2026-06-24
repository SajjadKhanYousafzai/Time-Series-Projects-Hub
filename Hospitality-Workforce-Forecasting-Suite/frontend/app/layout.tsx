import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hospitality Workforce Forecasting Suite",
    template: "%s | Hospitality Suite",
  },
  description:
    "Production-grade labor forecasting platform for the hospitality industry. Leverages SARIMA, Holt-Winters, and seasonal naive models to optimize staffing and labor scheduling.",
  keywords: [
    "workforce planning",
    "labor forecasting",
    "time series",
    "SARIMA",
    "Holt-Winters",
    "hospitality forecasting",
    "operations research"
  ],
  authors: [{ name: "Hospitality Analytics Team" }],
  openGraph: {
    type: "website",
    title: "Hospitality Workforce Forecasting Suite",
    description: "Data-driven labor forecasting and planning: SARIMA · Holt-Winters · Seasonal Naive",
    siteName: "Hospitality Suite",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
