"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Spinner from "./Spinner";

export default function GithubAuthButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  async function handleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("Authenticating with github");
    await signIn("github");
  }

  async function handleSignOut(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("Signing out of github");
    await signOut();
  }

  return (
    <button
      className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 flex items-center"
      onClick={session ? handleSignOut : handleSignIn}
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner />
          <span>Loading...</span>
        </>
      ) : session ? (
        "Sign out"
      ) : (
        "Sign in with GitHub"
      )}
    </button>
  );
}
