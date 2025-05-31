import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import SiteHeader from '@/app/components/SiteHeader';
import Footer from '@/app/components/Footer'; //

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SABACAN",
  description: "Learn English through fun quizzes — new content added daily on SABACAN!",
  icons: {
    icon: '/favicon-v2.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-black dark:text-white`}
      >
        <ThemeProvider>
          <AuthProvider>
            <SiteHeader />
            <main>{children}</main> {/* 👈 明示的に main を使うと可読性が向上 */}
            <Footer /> {/* 👈 フッターをここに追加 */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

