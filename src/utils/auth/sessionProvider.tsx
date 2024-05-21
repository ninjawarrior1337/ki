"use client";
import { SessionProvider as SP } from "next-auth/react";
import React from "react";

export function SessionProvider({ children }: React.PropsWithChildren) {
  return <SP>{children}</SP>;
}
