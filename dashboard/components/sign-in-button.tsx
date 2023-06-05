"use client";

import { useSignInModal } from "./sign-in-modal";

export const SignInButton = () => {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  return (
    <>
      <SignInModal />
      <button
        className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
        onClick={() => setShowSignInModal(true)}
      >
        Sign In
      </button>
    </>
  );
};
