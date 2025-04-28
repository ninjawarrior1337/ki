// import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "../styles/globals.css";

import { TRPCReactProvider } from "~/utils/trpc/react";
import { SessionProvider } from "~/utils/auth/sessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <SessionProvider>
          <TRPCReactProvider headers={await headers()}>
            <main className="hero min-h-screen bg-base-300">
              <div className="hero-content flex max-w-md flex-col text-center">
                {children}
              </div>
            </main>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
