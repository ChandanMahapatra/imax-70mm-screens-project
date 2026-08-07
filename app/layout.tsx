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

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    "https://chandanmahapatra.github.io/imax-70mm-screens-project/",
);
const faviconUrl = new URL("favicon.svg", siteUrl);
const socialImageUrl = new URL("og.png", siteUrl);
const title = "IMAX 70mm Screens — The Odyssey";
const description =
  "Compare verified physical screen dimensions for theatres presenting The Odyssey in IMAX 70mm.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    images: [{ url: socialImageUrl, width: 1730, height: 909, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <script
          type="module"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token":"f434b310f11744988ebece55ebcae259"}'
        />
      </body>
    </html>
  );
}
