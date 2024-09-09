import { auth } from "@/firebase/firebase";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { FiLogOut } from "react-icons/fi";

const Logout: React.FC = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const handleLogOut = () => {
    signOut();
  };
  return (
    <button
      className="bg-dark-fill-3 text-brand-orange py-1.5 cursor-pointer px-3"
      onClick={handleLogOut}
    >
      <FiLogOut />
    </button>
  );
};
export default Logout;
