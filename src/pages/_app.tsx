// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import superjson from "superjson";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import "../styles/globals.css";
import Head from "next/head";
import { AppProps } from "next/app";
import { httpBatchLink } from "@trpc/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ session: SessionProviderProps["session"] }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>元気 - Mood Tracker</title>
      </Head>
      <ReactQueryDevtools initialIsOpen={false} />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

const getBaseUrl = () => {
  if (typeof window !== undefined) return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      links: [httpBatchLink({ url })],
      transformer: superjson,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
