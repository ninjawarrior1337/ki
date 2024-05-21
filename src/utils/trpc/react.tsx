"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppRouter } from "../../server/router";
import { createTRPCReact, unstable_httpBatchStreamLink } from "@trpc/react-query";
import { getUrl, transformer } from "./shared";

import { useState } from "react";

export const api = createTRPCReact<AppRouter>();

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export function TRPCReactProvider(props: {
    children: React.ReactNode;
    headers: Headers;
  }) {
    const [queryClient] = useState(() => new QueryClient());
  
    const [trpcClient] = useState(() =>
      api.createClient({
        transformer,
        links: [
          unstable_httpBatchStreamLink({
            url: getUrl(),
            headers() {
              const heads = new Map(props.headers);
              heads.set("x-trpc-source", "react");
              return Object.fromEntries(heads);
            },
          }),
        ],
      })
    );
  
    return (
      <QueryClientProvider client={queryClient}>
        <api.Provider client={trpcClient} queryClient={queryClient}>
          {props.children}
        </api.Provider>
      </QueryClientProvider>
    );
  }