// import "~/styles/globals.css";

import localFont from "next/font/local";
import { headers } from "next/headers";
import "../styles/globals.css";

import { TRPCReactProvider } from "~/utils/trpc/react";
import { SessionProvider } from "~/utils/auth/sessionProvider";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

const inter = localFont({
  src: "../../assets/InterVariable.ttf",
  variable: "--font-sans",
  display: "swap",
});

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`} style={{fontFeatureSettings: `"tnum", "ss01", "ss04", "calt", "liga"`}}>
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
