import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthStatus from "../app/components/AuthStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kurdish Courses",
  description: "Lerne Sprachen mit interaktiven Kursen und Lektionen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    <a href="/">Kurdish Courses</a>
                  </h1>
                </div>
                {/* AuthStatus zeigt Login/Logout und Email an */}
                <AuthStatus />
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
