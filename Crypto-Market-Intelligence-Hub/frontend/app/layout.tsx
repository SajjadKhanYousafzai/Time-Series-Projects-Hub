import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Crypto Market Intelligence Hub",
    template: "%s | Crypto Hub",
  },
  description:
    "End-to-end cryptocurrency market analysis and forecasting. Volatility, correlations, regime behavior and multi-model price forecasting across 49 digital assets.",
  keywords: ["crypto", "bitcoin", "forecasting", "LSTM", "Prophet", "ARIMA", "time series"],
  authors: [{ name: "Crypto Market Intelligence Hub" }],
  openGraph: {
    type: "website",
    title: "Crypto Market Intelligence Hub",
    description: "Multi-model crypto price forecasting: ARIMA · Prophet · LSTM · GRU",
    siteName: "Crypto Hub",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
