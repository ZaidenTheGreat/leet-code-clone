import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";
import Logout from "../Logout/Logout";
import { useSetRecoilState } from "recoil";
import authModalState from "@/atoms/authModalAtom";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../Timer/Timer";
import { Problem } from "@/utils/types/problem.";
import { useRouter } from "next/router";
import { problemList } from "@/utils/Problems";

type TopbarProps = {
  problemPage?: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
  const [user, loading] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  const handleOrderClick = (isForward: boolean) => {
    const { order } = problemList[router.query.pid as string] as Problem;
    const direction = isForward ? 1 : -1;
    const nextProblemOrder = order + direction;
    const nextProblemKey = Object.keys(problemList).find(
      (key) => problemList[key].order === nextProblemOrder
    );
    // console.log("next", nextProblemKey);

    if (isForward && !nextProblemKey) {
      const firstProblemKey = Object.keys(problemList).find(
        (key) => problemList[key].order === 1
      );
      // console.log(firstProblemKey);
      router.push(`/problems/${firstProblemKey}`);
    } else if (!isForward && !nextProblemKey) {
      const lastProblemKey = Object.keys(problemList).find(
        (key) => problemList[key].order === Object.keys(problemList).length
      );
      // console.log(lastProblemKey);
      router.push(`/problems/${lastProblemKey}`);
    } else {
      router.push(`/problems/${nextProblemKey}`);
    }
  };
  return (
    <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7 select-none">
      <div
        className={`flex w-full items-center justify-center max-w-[1000px] mx-auto`}
      >
        <Link href="/" className="h-[22px] flex-1">
          <Image src="/logo-full.png" alt="Logo" height={100} width={100} />
        </Link>

        {problemPage && (
          <div className="flex items-center gap-4 justify-center flex-1">
            <div
              className="flex items-center justify-center bg-dark-fill-3 rounded hover:bg-dark-fill-2 h-8 w-8 cursor-pointer '
            "
              onClick={() => handleOrderClick(false)}
            >
              <FaChevronLeft />
            </div>
            <Link
              href={"/"}
              className="flex gap-2 items-center font-medium max-w-[170px] text-dark-gray-8 cursor-pointer"
            >
              <div>
                <BsList />
              </div>
              <p>Problem list</p>
            </Link>

            <div
              className="flex items-center justify-center bg-dark-fill-3 rounded hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
            "
              onClick={() => handleOrderClick(true)}
            >
              <FaChevronRight />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <div>
            <a
              href=""
              target="_blank"
              rel="noreferrer"
              className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2"
            >
              Premium
            </a>
          </div>
          {user && problemPage && <Timer />}
          {!user && !loading && (
            <Link
              href="/auth"
              onClick={(prev) =>
                setAuthModalState({ ...prev, type: "login", isOpen: true })
              }
            >
              <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded ">
                Sign In
              </button>
            </Link>
          )}
          {user && (
            <div className="cursor-pointer group relative">
              <img
                src="/avatar.png"
                alt="avatar"
                className="h-8 w-8 rounded-full"
              />
              <div className="absolute top-11 -right-7 mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-110 scale-0 transition-all duration-300 ease-in-out">
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          )}
          {user && <Logout />}
        </div>
      </div>
    </nav>
  );
};
export default Topbar;
