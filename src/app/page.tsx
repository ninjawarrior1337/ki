import { getServerSession } from "~/utils/auth/serverSession";
import { redirect } from "next/navigation";
import SignInButton from "./SignInButton";

export default async function Page() {
    const session = await getServerSession()

    if(session) {
        const currentYear = new Date(Date.now()).getUTCFullYear()
        redirect(`/moodtracker/${currentYear}`)
    }

    return (
        <SignInButton/>
    )
}