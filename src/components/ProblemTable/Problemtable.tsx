import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import YouTube from "react-youtube";
import { IoClose } from "react-icons/io5";
import {
  collection,
  query,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem.";
import { useAuthState } from "react-firebase-hooks/auth";
type ProblemtableProps = {
  setLoadingProblem: React.Dispatch<React.SetStateAction<boolean>>;
};

const Problemtable: React.FC<ProblemtableProps> = ({ setLoadingProblem }) => {
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: "",
  });

  const problems = useGetProblems(setLoadingProblem);
  const solvedList = useGetSolveProblems();
  // console.log(solvedList);

  // console.log(typeof problems, "problems", problems);

  return (
    <>
      <tbody className="text-white text-sm">
        {problems?.map((item, index) => {
          return (
            <tr
              key={item.id}
              className={`${index % 2 == 1 ? "bg-dark-layer-1" : ""}`}
            >
              <td className="px-2 py-4  font-medium whitespace-nowrap text-dark-green-s">
                {solvedList.includes(item.id) ? (
                  <BsCheckCircle fontSize={18} width={18} />
                ) : null}
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/problems/${item.id}`}
                  className="hover:text-blue-500 cursor-pointer"
                >
                  {item.title}
                </Link>
              </td>
              <td
                className={`${
                  item.difficulty === "Easy"
                    ? "text-dark-green-s"
                    : item.difficulty === "Medium"
                    ? "text-dark-yellow"
                    : "text-dark-pink"
                }`}
              >
                {item.difficulty}
              </td>
              <td className="px-6 py-4">{item?.category}</td>
              <td className="px-6 py-4">
                {item?.videoId ? (
                  <AiFillYoutube
                    onClick={() =>
                      setYoutubePlayer({
                        isOpen: true,
                        videoId: item?.videoId as string,
                      })
                    }
                    fontSize={30}
                    className="hover:text-red-600 cursor-pointer"
                  />
                ) : (
                  <p className="">Coming Soon</p>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      {youtubePlayer.isOpen && (
        <tfoot className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
          <div
            className="bg-black z-10 opacity-60 top-0 left-0 w-screen h-screen absolute"
            onClick={() => setYoutubePlayer({ isOpen: false, videoId: "" })}
          ></div>
          <div className="w-full h-full z-50 px-6 relative max-w-4xl">
            <div className="w-full h-full relative flex items-center justify-center">
              <div className="w-full relative">
                <IoClose
                  fontSize={35}
                  className="absolute top-2 right-0 cursor-pointer"
                  onClick={() =>
                    setYoutubePlayer({ isOpen: false, videoId: "" })
                  }
                />
                <YouTube
                  videoId={youtubePlayer.videoId}
                  loading="lazy"
                  iframeClassName="w-full min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </tfoot>
      )}
    </>
  );
};

export default Problemtable;

const useGetProblems = (
  setLoadingProblem: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [problems, setProblems] = useState<DBProblem[]>([]);
  useEffect(() => {
    setLoadingProblem(true);
    const getProblems = async () => {
      const q = query(
        collection(firestore, "problems"),
        orderBy("order", "asc")
      );

      const querySnapshot = await getDocs(q);
      const temp: DBProblem[] = [];

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        temp.push({
          id: doc.id,
          ...doc.data(),
        } as DBProblem);
        // console.log(doc.id, " => ", doc.data());
      });
      setProblems(temp);
      setLoadingProblem(false);
    };

    getProblems();
  }, [setLoadingProblem]);
  return problems;
};

function useGetSolveProblems() {
  const [solvedList, setSolvedList] = useState<String[]>([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getSolvedList = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setSolvedList(userDoc.data().solvedProblems);
      }
    };

    if (!user) return;
    getSolvedList();
  }, [user]);
  return solvedList;
}
