import authModalState from "@/atoms/authModalAtom";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, type: "login" }));
  };

  const [input, setInput] = useState({ email: "", name: "", password: "" });
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.email || !input.password || !input.name)
      return alert("Please fill all fields");
    try {
      toast.loading("Creating your Account", {
        position: "top-right",
        toastId: "loadingtoast",
      });
      const newUser = await createUserWithEmailAndPassword(
        input.email,
        input.password
      );
      if (!newUser) return;

      const newUserData = {
        uid: newUser?.user.uid,
        email: newUser?.user?.email,
        name: input.name,
        likedProblems: [],
        dislikedProbems: [],
        solvedProblems: [],
        starredProblems: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(doc(firestore, "users", newUser?.user?.uid), newUserData);
      router.push("/");
    } catch (error: any) {
      toast.error("Error Creating a new user", { position: "top-right" });
    } finally {
      toast.dismiss("loadingtoast");
    }
  };
  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleForm}>
      <h3 className="text-white text-xl font-medium">Registered</h3>
      <div>
        <label
          htmlFor="email"
          className="font-medium text-sm mb-2 block text-gray-200"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleInputChange}
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-200 text-white"
          placeholder="name@gmail.com"
        />
      </div>
      <div>
        <label
          htmlFor="name"
          className="font-medium text-sm mb-2 block text-gray-200"
        >
          Name
        </label>
        <input
          onChange={handleInputChange}
          type="text"
          name="name"
          id="name"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-200 text-white"
          placeholder="John doe"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="font-medium text-sm mb-2 block text-gray-200"
        >
          Password
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
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="text-sm font-medium text-gray-500">
        Already have an account?{" "}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={handleClick}
        >
          Log in
        </a>
      </div>
    </form>
  );
};
export default Signup;
