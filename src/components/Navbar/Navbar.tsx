import React from "react";
import Link from "next/link";
import { useRecoilValue, useSetRecoilState } from "recoil";
import authModalState from "@/atoms/authModalAtom";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleAuthModal = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: true }));
  };
  return (
    <div className="flex items-center justify-between sm:px-12 px-0 md:px-24">
      <Link href="/" className="flex items-center justify-center h-20">
        <img src="/logo.png" alt="leetcode" className="h-full" />
      </Link>
      <div className="flex items-center">
        <button
          className="bg-brand-orange text-white sm:px-2 py-1 rounded-md text-sm font-medium hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange border-2 border-transparent transition duration-200 ease-in-out"
          onClick={handleAuthModal}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
export default Navbar;
