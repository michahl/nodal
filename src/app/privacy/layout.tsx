import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/context/auth";
import { SonarProvider, Toaster } from "@/components/ui/sonar";
import Script from "next/script";

const interTight = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Privacy Policy | nodal",
  description: "Review the Privacy Policy for nodal to learn how we collect, use, and protect your personal information when using our AI-powered knowledge graph platform.",
  keywords: ["privacy policy", "privacy", "data protection", "nodal", "knowledge graphs", "ai"],
  openGraph: {
    title: "Privacy Policy | nodal",
    description: "Review the Privacy Policy for nodal to learn how we collect, use, and protect your personal information when using our AI-powered knowledge graph platform.",
    url: "https://nodal.michahl.com/privacy",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "nodal | ai-powered knowledge graphs",
      },
    ],
  },
  twitter: {
    title: "Privacy Policy | nodal",
    description: "Review the Privacy Policy for nodal to learn how we collect, use, and protect your personal information when using our AI-powered knowledge graph platform.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "nodal | ai-powered knowledge graphs",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en"
    >
      <Script
        defer
        src='https://cloud.umami.is/script.js'
        data-website-id='f7f79308-10ce-4c1f-8662-18dc4dab029d'
      />
      <body
        className={`${interTight.className} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
            <SonarProvider>
              {children}
              <Toaster
                position="top-center"
                duration={5000}
              />
            </SonarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
