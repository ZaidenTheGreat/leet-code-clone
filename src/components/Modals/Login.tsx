import authModalState from "@/atoms/authModalAtom";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const handleClick = (type: "login" | "register" | "forgotPassword") => {
    setAuthModalState((prev) => ({ ...prev, type }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.email || !input.password) return alert("Please fill all fields");
    try {
      const newUser = await signInWithEmailAndPassword(
        input.email,
        input.password
      );
      if (!newUser) return;
      router.push("/");
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
    }
  }, [error]);

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleLoginForm}>
      <h3 className="text-white text-xl font-medium">Sign in</h3>
      <div>
        <label
          htmlFor="email"
          className="font-medium text-sm mb-2 block text-gray-200"
        >
          Your email
        </label>
        <input
          onChange={handleInputChange}
          type="email"
          name="email"
          id="email"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-200 text-white"
          placeholder="name@gmail.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="font-medium text-sm mb-2 block text-gray-200"
        >
          Your password
        </label>
        <input
          onChange={handleInputChange}
          type="password"
          name="password"
          id="password"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-200 text-white"
          placeholder="*********"
        />
      </div>
      <button
        type="submit"
        className="text-white bg-brand-orange rounded-lg font-medium text-sm px-5 py-2.5 text-center w-full focus:ring-blue-300 hover:bg-brand-orange-s"
      >
        {loading ? "Loading..." : "Log In"}
      </button>
      <button
        className="flex justify-end w-full"
        onClick={() => handleClick("forgotPassword")}
      >
        <a
          href="#"
          className="text-sm block text-brand-orange hover:underline w-full text-right"
        >
          forget password?
        </a>
      </button>
      <div
        className="text-sm font-medium text-gray-500"
        onClick={() => handleClick("register")}
      >
        Not Registered?{" "}
        <a href="#" className="text-blue-700 hover:underline ">
          create account
        </a>
      </div>
    </form>
  );
};
export default Login;
