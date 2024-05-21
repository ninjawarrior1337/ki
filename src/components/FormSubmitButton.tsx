"use client"

import { useFormStatus } from "react-dom"

export default function SubmitButton() {
    const {pending} = useFormStatus()
    return (
        <button className={`btn btn-primary ${pending && "loading"}`} type="submit">
            Save
          </button>
    )
}