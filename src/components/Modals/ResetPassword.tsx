import { auth } from "@/firebase/firebase";
import React, { useEffect, useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

type ResetPasswordProps = {};

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [email, setEmail] = useState("");
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await sendPasswordResetEmail(email);
    if (success) {
      toast.success("Password reset email Sent Successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(`Email not Sent due to ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
    }
  }, [error]);

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleReset}>
      <h3 className="text-white text-xl font-medium">Reset Password</h3>
      <p className="text-white text-sm">
        Forgotten your password? Enter your email address below? and we&apos;ll
        send your e-mail allowiing you to reset it.
      </p>
      <div>
        <label
          htmlFor="email"
          className="font-medium text-sm mb-2 block text-gray-200"
        >
          Your email
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-200 text-white"
          placeholder="name@gmail.com"
        />
      </div>

      <button
        type="submit"
        className="text-white bg-brand-orange rounded-lg font-medium text-sm px-5 py-2.5 text-center w-full focus:ring-blue-300 hover:bg-brand-orange-s"
      >
        Reset Password
      </button>
    </form>
  );
};
export default ResetPassword;
