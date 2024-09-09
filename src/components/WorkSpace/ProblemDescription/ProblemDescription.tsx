import { DBProblem, Problem } from "@/utils/types/problem.";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiFillDislike, AiFillLike, AiFillStar } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebase";

import CircleSkeleton from "@/components/LoadingSkeleton/CircleSkeleton";
import RectangleSkeleton from "@/components/LoadingSkeleton/RectangleSkeleton";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { updateSourceFile } from "typescript";

type ProblemDescriptionProps = {
  problem: Problem;
  _solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  _solved,
}) => {
  const [user] = useAuthState(auth);
  const { currentProblem, loading, setCurrentProblem } = useGetCurrentProblelem(
    problem.id
  );
  const { liked, disliked, solved, starred, setUserData } = useGetUserOnProblem(
    problem.id
  );
  const [updating, setUpdating] = useState(false);

  const returnUserDataAndProblem = async (transaction: any) => {
    const userRef = doc(firestore, "users", user!.uid);
    const problemRef = doc(firestore, "problems", problem.id);
    const userDoc = await transaction.get(userRef);
    const problemDoc = await transaction.get(problemRef);
    return { userRef, problemRef, userDoc, problemDoc };
  };

  const handleLikeClick = async () => {
    try {
      if (!user) {
        toast.error("You are not allowed to Like,Login Please!", {
          position: "top-right",
          theme: "dark",
        });
        return;
      }
      if (updating) return;
      setUpdating(true);
      await runTransaction(firestore, async (transaction) => {
        // const userRef = doc(firestore, "users", user?.uid);
        // const problemRef = doc(firestore, "problems", problem.id);
        // const userDoc = await transaction.get(userRef);
        // const problemDoc = await transaction.get(problemRef);
        const { userRef, problemRef, problemDoc, userDoc } =
          await returnUserDataAndProblem(transaction);
        if (!userDoc.exists() || !problemDoc.exists()) {
          throw "Document does not exist!";
        } else {
          // if already liked ,if already disliked,or neither it is
          if (liked) {
            // remove problem id from likedProblems array on user document,decrement likes count on problem document
            transaction.update(userRef, {
              likedProblems: userDoc
                .data()
                .likedProblems.filter((id: string) => problem.id != id),
            });
            transaction.update(problemRef, {
              likes: problemDoc.data().likes - 1,
            });
            setCurrentProblem((prev) =>
              prev
                ? {
                    ...prev,
                    likes: prev?.likes - 1,
                  }
                : null
            );
            setUserData((prev) => ({
              ...prev,
              liked: false,
            }));
          } else if (disliked) {
            transaction.update(userRef, {
              dislikedProbems: userDoc
                .data()
                .dislikedProbems.filter((id: string) => problem.id != id),
              likedProblems: [...userDoc.data().likedProblems, problem.id],
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes - 1,
              likes: problemDoc.data().likes + 1,
            });
            setCurrentProblem((prev) =>
              prev
                ? {
                    ...prev,
                    dislikes: prev?.dislikes - 1,
                    likes: prev?.likes + 1,
                  }
                : null
            );
            setUserData((prev) => ({
              ...prev,
              disliked: false,
              liked: true,
            }));
          } else {
            transaction.update(userRef, {
              likedProblems: [...userDoc.data().likedProblems, problem.id],
            });
            transaction.update(problemRef, {
              likes: problemDoc.data().likes + 1,
            });
            setCurrentProblem((prev) =>
              prev
                ? {
                    ...prev,
                    likes: prev?.likes + 1,
                  }
                : null
            );
            setUserData((prev) => ({
              ...prev,
              liked: true,
            }));
          }
        }
      });
      setUpdating(false);
    } catch (error) {
      toast.error(`${error}`, { position: "top-right", theme: "dark" });
      console.error(error);
    }
  };

  const handleDislikeClick = async () => {
    try {
      if (!user) {
        toast.error("You are not allowed to DisLike,Login Please!", {
          position: "top-right",
          theme: "dark",
        });
        return;
      }
      if (updating) return;
      setUpdating(true);
      await runTransaction(firestore, async (transaction) => {
        // const userRef = doc(firestore, "users", user?.uid);
        // const problemRef = doc(firestore, "problems", problem.id);
        // const userDoc = await transaction.get(userRef);
        // const problemDoc = await transaction.get(problemRef);
        const { userRef, problemRef, problemDoc, userDoc } =
          await returnUserDataAndProblem(transaction);
        if (!userDoc.exists() || !problemDoc.exists()) {
          throw "Document does not exist!";
        } else {
          // if already liked ,if already disliked,or neither it is
          if (disliked) {
            // remove problem id from likedProblems array on user document,decrement likes count on problem document
            transaction.update(userRef, {
              dislikedProbems: userDoc
                .data()
                .dislikedProbems.filter((id: string) => problem.id != id),
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes - 1,
            });
            setCurrentProblem((prev) =>
              prev
                ? {
                    ...prev,
                    dislikes: prev?.dislikes - 1,
                  }
                : null
            );
            setUserData((prev) => ({
              ...prev,
              disliked: false,
            }));
          } else if (liked) {
            transaction.update(userRef, {
              dislikedProbems: [...userDoc.data().dislikedProbems, problem.id],
              likedProblems: userDoc
                .data()
                .likedProblems.filter((id: string) => id !== problem.id),
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes + 1,
              likes: problemDoc.data().likes - 1,
            });
            setCurrentProblem((prev) =>
              prev
                ? {
                    ...prev,
                    dislikes: prev?.dislikes + 1,
                    likes: prev?.likes - 1,
                  }
                : null
            );
            setUserData((prev) => ({
              ...prev,
              disliked: true,
              liked: false,
            }));
          } else {
            transaction.update(userRef, {
              dislikedProbems: [...userDoc.data().dislikedProbems, problem.id],
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes + 1,
            });
            setCurrentProblem((prev) =>
              prev
                ? {
                    ...prev,
                    dislikes: prev?.likes + 1,
                  }
                : null
            );
            setUserData((prev) => ({
              ...prev,
              disliked: true,
            }));
          }
        }
      });
      setUpdating(false);
    } catch (error) {
      toast.error(`${error}`, { position: "top-right", theme: "dark" });
      console.error(error);
    }
  };

  const handleStarredClick = async () => {
    try {
      if (!user) {
        toast.error("You are not allowed to Star,Login Please!", {
          position: "top-right",
          theme: "dark",
        });
        return;
      }
      if (updating) return;
      setUpdating(true);
      if (starred) {
        const userRef = doc(firestore, "users", user!.uid);
        await updateDoc(userRef, {
          starredProblems: arrayRemove(problem.id),
        });
        setUserData((prev) => ({
          ...prev,
          starred: false,
        }));
      } else {
        const userRef = doc(firestore, "users", user!.uid);
        await updateDoc(userRef, {
          starredProblems: arrayUnion(problem.id),
        });
        setUserData((prev) => ({
          ...prev,
          starred: true,
        }));
      }
      setUpdating(false);
    } catch (error) {
      toast.error(`${error}`, { position: "top-right", theme: "dark" });
      console.error(error);
    }
  };

  return (
    <div className="bg-dark-layer-1">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div
          className={
            "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto select-none">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem.title}
              </div>
            </div>
            {!loading && currentProblem && (
              <div className="flex items-center mt-3">
                <div
                  className={`${
                    currentProblem?.difficulty === "Easy"
                      ? "text-dark-green-s bg-dark-green-s"
                      : currentProblem?.difficulty === "Medium"
                      ? "text-dark-yellow bg-dark-yellow"
                      : "text-dark-pink bg-dark-pink"
                  } inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                >
                  {!loading && currentProblem?.difficulty}
                </div>
                {(solved || _solved) && (
                  <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                    <BsCheck2Circle />
                  </div>
                )}
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6"
                  onClick={handleLikeClick}
                >
                  {liked ? (
                    <AiFillLike className="text-dark-blue-s" />
                  ) : (
                    <AiFillLike />
                  )}

                  <span className="text-xs">
                    {!loading && currentProblem?.likes}
                  </span>
                </div>
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6"
                  onClick={handleDislikeClick}
                >
                  {disliked ? (
                    <AiFillDislike className="text-dark-pink" />
                  ) : (
                    <AiFillDislike />
                  )}
                  {/* <AiFillDislike /> */}
                  <span className="text-xs">
                    {!loading && currentProblem?.dislikes}
                  </span>
                </div>
                <div
                  className="cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 "
                  onClick={handleStarredClick}
                >
                  {/* <TiStarOutline /> */}
                  {starred && <AiFillStar className="text-dark-yellow" />}
                  {!starred && <TiStarOutline />}
                </div>
              </div>
            )}
            {loading && (
              <div className="flex items-center space-x-2 mt-3">
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )}
            {/* Problem Statement(paragraphs) */}
            <div className="text-white text-sm">
              <div
                dangerouslySetInnerHTML={{ __html: problem.problemStatement }}
              />
            </div>
            {/* Examples */}
            <div className="mt-4">
              {problem?.examples.map((example, index) => (
                <div key={example?.id}>
                  <p className="font-medium text-white ">
                    Example 1:{index + 1}{" "}
                  </p>
                  {example?.img && (
                    <Image
                      src={example?.img}
                      alt="example_img"
                      width={300}
                      height={120}
                      className="mt-3"
                    />
                  )}
                  <div className="example-card">
                    <pre>
                      <strong className="text-white">
                        Input: {example?.input}{" "}
                      </strong>
                      <br />
                      <strong>Output:</strong> {example?.output} <br />
                      {example?.explanation && (
                        <>
                          <strong>Explanation:</strong>
                          {example?.explanation}
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
            {/* Constraints */}
            <div className="my-5 pb-4">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc">
                <div
                  dangerouslySetInnerHTML={{ __html: problem.constraints }}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;

function useGetCurrentProblelem(problemId: string) {
  const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const getCurrentProblem = async () => {
      const docRef = doc(firestore, "problems", problemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentProblem({
          id: docSnap.id,
          ...docSnap.data(),
        } as DBProblem);
        // console.log("Document data:", typeof docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No problem document!");
      }
      setLoading(false);
    };

    getCurrentProblem();
  }, [problemId]);

  return {
    currentProblem,
    loading,
    setCurrentProblem,
  };
}

function useGetUserOnProblem(problemId: string) {
  const [userData, setUserData] = useState({
    liked: false,
    disliked: false,
    solved: false,
    starred: false,
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUser = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const {
          dislikedProbems,
          likedProblems,
          solvedProblems,
          starredProblems,
        } = data;
        setUserData({
          liked: likedProblems.includes(problemId),
          disliked: dislikedProbems.includes(problemId),
          solved: solvedProblems.includes(problemId),
          starred: starredProblems.includes(problemId),
        });

        // console.log("Document data:", userSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No user document!");
      }
    };
    if (user) getUser();
    return () =>
      setUserData({
        liked: false,
        disliked: false,
        solved: false,
        starred: false,
      });
  }, [problemId, user]);

  return { ...userData, setUserData };
}
