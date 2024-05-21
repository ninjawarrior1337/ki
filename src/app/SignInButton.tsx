"use client"

import { signIn } from "next-auth/react"

export default function SignInButton() {
    return (
        <button onClick={() => signIn("discord")} className="btn btn-outline bg-[#5865F2]">
            Login with Discord
        </button>
    )
}