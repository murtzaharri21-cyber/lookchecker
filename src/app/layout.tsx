import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WebMCPTools } from "@/components/webmcp-tools";
import { siteUrl, socialImage } from "@/lib/seo";
import { tools } from "@/lib/site-data";
import "./globals.css";

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": new URL("/#organization", siteUrl).toString(),
      name: "Look Checker",
      url: siteUrl.toString(),
      logo: new URL("/icon.png", siteUrl).toString(),
      sameAs: ["https://ghulam-murtza.vercel.app/"],
      telephone: "+923260586026",
      email: "murtzaharry21@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "G13",
        addressLocality: "Islamabad",
        addressCountry: "PK",
      },
    },
    {
      "@type": "WebSite",
      "@id": new URL("/#website", siteUrl).toString(),
      name: "Look Checker",
      url: siteUrl.toString(),
      description: "Free, private, browser-based tools for exploring facial proportions and personal style.",
      publisher: { "@id": new URL("/#organization", siteUrl).toString() },
    },
    {
      "@type": "WebApplication",
      "@id": new URL("/#webapplication", siteUrl).toString(),
      name: "Look Checker",
      url: siteUrl.toString(),
      description: "Free browser-based tools for exploring facial proportions and personal style. Photos are processed on the visitor's device.",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@id": new URL("/#organization", siteUrl).toString() },
    },
    {
      "@type": "ItemList",
      "@id": new URL("/#tools", siteUrl).toString(),
      name: "Look Checker free browser-based tools",
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebApplication",
          name: tool.title,
          description: tool.description,
          url: new URL(`/tools/${tool.slug}`, siteUrl).toString(),
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Any",
          isAccessibleForFree: true,
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Free Attractiveness Check | Look Checker", template: "%s | Look Checker" },
  description: "Look Checker offers free, browser-based tools for exploring facial proportions and styling ideas. No account or photo upload required.",
  keywords: ["face analysis", "face shape detector", "face symmetry", "facial proportions", "free face scan"],
  applicationName: "Look Checker",
  appleWebApp: { capable: true, title: "Look Checker", statusBarStyle: "black-translucent" },
  other: { "mobile-web-app-capable": "yes" },
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    apple: "/apple-icon.png",
  },
  openGraph: {
    siteName: "Look Checker",
    title: "Free Attractiveness Check | Look Checker",
    description: "Explore facial features and proportions with free, private, on-device analysis.",
    type: "website",
    url: "/",
    images: [{ url: socialImage, width: 1406, height: 768, alt: "Illustrative Look Checker face report concept" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Attractiveness Check | Look Checker",
    description: "Explore facial features and proportions with free, private, on-device analysis.",
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#E8F6F3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://lookchecker.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <Script id="look-checker-theme-init" strategy="beforeInteractive">
          {`var root=document.documentElement;root.dataset.theme="light";root.lang="en";root.dir="ltr";try{localStorage.removeItem("look-checker-theme");localStorage.removeItem("look-checker-locale");for(var i=localStorage.length-1;i>=0;i--){var key=localStorage.key(i);if(key&&key.startsWith("face-report-delete:"))localStorage.removeItem(key)}}catch{}`}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData).replace(/</g, "\\u003c") }} />
      </head>
      <body className="min-h-screen antialiased">
        <div className="site-frame">
          <aside className="site-ad-rail" aria-hidden="true" />
          <div className="site-content">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
          <aside className="site-ad-rail" aria-hidden="true" />
        </div>
        <WebMCPTools />
      </body>
    </html>
  );
}
