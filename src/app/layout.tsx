import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { SonarProvider, Toaster } from "@/components/ui/sonar";
import Script from 'next/script'

const interTight = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "nodal | ai-powered knowledge graphs",
    template: "%s",
  },
  description: "Visualize questions as expandable knowledge graphs using Sonar, with summaries, explanations, reasoning, and source links in each node.",
  keywords: ["knowledge graphs", "ai", "sonar", "perplexity", "ai generated mind maps", "ai generated knowledge graphs"],
  authors: [{ name: "michahl", url: "https://github.com/michahl" }],
  creator: "michahl",
  publisher: "michahl",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nodal.michahl.com",
    siteName: "nodal",
    title: "nodal | ai-powered knowledge graphs",
    description: "Visualize questions as expandable knowledge graphs using Sonar, with summaries, explanations, reasoning, and source links in each node.",
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
    card: "summary_large_image",
    title: "nodal | ai-powered knowledge graphs",
    description: "Visualize questions as expandable knowledge graphs using Sonar, with summaries, explanations, reasoning, and source links in each node.",
    creator: "@cht5m",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "nodal | ai-powered knowledge graphs",
      },
    ],
  },

  icons: {
    icon: [
      { url: "/assets/favicon/favicon-32x32.png", sizes: "32x32" },
      { url: "/assets/favicon/favicon-16x16.png", sizes: "16x16" },
      "/assets/favicon/favicon.ico"
    ],
    apple: "/assets/favicon/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/assets/favicon/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "icon", url: "/assets/favicon/android-chrome-512x512.png", sizes: "512x512" }
    ]
  },
  appleWebApp: {
    title: "nodal",
    capable: true,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/site.webmanifest",
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,            // No limit on text snippets
      "max-image-preview": "large", // Show large image previews
      "max-video-preview": -1       // No limit on video preview length
    },
  }
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
