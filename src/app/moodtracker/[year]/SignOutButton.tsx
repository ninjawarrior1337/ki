"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
    return (
        <ul
          tabIndex={0}
          className="menu dropdown-content w-52 rounded-box bg-base-100 p-2 shadow"
        >
          <li onClick={() => signOut()} className="text-error">
            <a>Sign Out</a>
          </li>
        </ul>
    )
}