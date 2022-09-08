// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import superjson from "superjson";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import "../styles/globals.css";
import Head from "next/head";
import { AppProps } from "next/app";

function MyApp({Component, pageProps}: AppProps<{session: SessionProviderProps["session"]}>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>元気 - Mood Tracker</title>
      </Head>
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
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
