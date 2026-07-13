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
  title: "Cryptid Field Guide",
  description: "A comprehensive guide to mysterious and legendary creatures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Runs before paint so the page matches the OS theme immediately,
          // and keeps it in sync if the user changes it while the tab is open.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)');var apply=function(){document.documentElement.classList.toggle('dark',m.matches);};apply();m.addEventListener('change',apply);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
