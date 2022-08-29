import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import MoodTracker from "../components/Tracker";

const Home: NextPage = () => {
  const session = useSession()

  return (
    <>
      <main className="hero min-h-screen bg-base-300">
        <div className="hero-content flex flex-col max-w-md text-center">
          {
            session.status === "authenticated" ? (
              <>
                <h1 className="text-2xl font-black">Mood Tracker</h1>
                <h2 className="text-5xl font-black text-gradient-treelar">元気？</h2>
                <MoodTracker></MoodTracker>
                <div className="absolute top-4 right-4 w-16 h-16 p-2 dropdown dropdown-end dropdown-hover">
                  <img className="rounded-full" src={session.data?.user?.image || ""} />
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li onClick={() => signOut()} className="text-error"><a>Sign Out</a></li>
                  </ul>
                </div>
              </>
            ) : session.status === "loading" ? (
              <img src="puff.svg" className="w-32"/>
            ) : (
              <button className="btn btn-outline bg-[#5865F2]" onClick={() => signIn("discord")}>
                Login with Discord
              </button>
            )
          }
        </div>
      </main>
    </>
  )

}

export default Home;
