import AuthModal from "@/components/Modals/AuthModal";
import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import authModalState from "@/atoms/authModalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";

type AuthProps = {};

const AuthPage: React.FC<AuthProps> = () => {
  const authModal = useRecoilValue(authModalState);
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    if (!loading && !user) {
      setPageLoading(false);
    }
  }, [user, router, loading]);
  if (pageLoading) return null;
  return (
    <div className="bg-gradient-to-b from-gray-500 to-black h-screen relative select-none">
      <div className="max-w-7xl mx-auto">
        <Navbar />
      </div>
      <div className="flex items-center justify-center select-none pointer-events-none">
        <img src="/hero.png" alt="img" loading="lazy" />
      </div>
      {authModal.isOpen && <AuthModal />}
    </div>
  );
};
export default AuthPage;
