import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./dark-mode-fixes.css";
import "./light-mode-fixes.css";
import "./cyber-effects.css";
import { AuthProvider } from "@/lib/auth-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import ThemeScript from "./theme-script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CloudShift - Plataforma de Cloud Security e Monitoramento",
  description: "Solução completa para monitorar e proteger seus recursos em nuvem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="pt-BR" 
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <ThemeScript />
      </head>
      <body 
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="cloudshift-theme">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
