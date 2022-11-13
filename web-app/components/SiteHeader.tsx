import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Link from "next/link";
import React from "react";

async function signIn() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential!.accessToken;
    // The signed-in user info.
    const user = result.user;
  } catch (error: Error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
  }
}

function UserProfileToolbarItem() {
  const auth = getAuth();
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  React.useEffect(() => {
    setIsSignedIn(auth.currentUser !== null);
  }, [auth.currentUser]);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };
  return isSignedIn ? (
    <div className="inline-block cursor-pointer" onClick={handleSignOut}>
      Sign out
    </div>
  ) : (
    <div className="inline-block cursor-pointer" onClick={() => signIn()}>
      Sign in
    </div>
  );
}

export default function SiteHeader({ children }: React.PropsWithChildren) {
  return (
    <header className="py-4 px-4 bg-slate-500 text-white sticky top-0 shadow-md">
      <div className="max-w-4xl mx-auto flex space-x-4">
        <Link
          href="/timeline"
          className="flex-1 inline-block text-xl font-bold"
        >
          🌌 Horizon
        </Link>
        {children}
        <Link href="/topics" className="inline-block">
          Topics
        </Link>
        <Link href="/timeline" className="inline-block">
          Timeline
        </Link>
        <UserProfileToolbarItem />
      </div>
    </header>
  );
}
