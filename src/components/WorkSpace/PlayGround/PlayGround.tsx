import React, { SetStateAction, useEffect, useState } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Problem } from "@/utils/types/problem.";
import EditorFooter from "./EditorFooter";
import { problemList } from "@/utils/Problems";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { log } from "console";

type PlayGroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<SetStateAction<boolean>>;
  setSolved: React.Dispatch<SetStateAction<boolean>>;
};

const PlayGround: React.FC<PlayGroundProps> = ({
  problem,
  setSuccess,
  setSolved,
}) => {
  const [activeId, setActiveId] = useState<number>(0);
  let [userCode, setUserCode] = useState<string>(problem.starterCode);
  const [user] = useAuthState(auth);
  const {
    query: { pid },
  } = useRouter();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit!", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    try {
      userCode = userCode.slice(userCode.indexOf(problem.startFunctionName));
      const cb = new Function(`return ${userCode}`)();
      const handler = problemList[pid as string].handlefunction;

      if (typeof handler === "function") {
        const result = handler(cb);

        if (result) {
          toast.success("Congrats! All test case passed", {
            position: "top-center",
            theme: "dark",
            autoClose: 4000,
          });
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 4200);
        }
      }

      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        solvedProblems: arrayUnion(pid),
      });
      setSolved(true);
    } catch (error: any) {
      console.log(error.message);
      if (error)
        toast.error(error.message, {
          position: "bottom-right",
          theme: "dark",
          autoClose: false,
        });
    }
  };

  useEffect(() => {
    const code = localStorage.getItem(`code-${user?.uid}-${pid}`);
    // console.log(code);

    if (user) {
      setUserCode(code ? JSON.parse(code) : problem.starterCode);
    } else {
      setUserCode(problem.starterCode);
    }
  }, [pid, user, problem.starterCode]);

  const handleEditorChange = (value: string) => {
    // console.log("vlue", value);
    setUserCode(value);
    localStorage.setItem(`code-${user?.uid}-${pid}`, JSON.stringify(value));
  };
  return (
    <>
      <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
        <PreferenceNav />
        <Split
          className="h-[calc(100vh-94px)]"
          direction="vertical"
          minSize={60}
          sizes={[60, 40]}
        >
          <div className="w-full overflow-auto">
            <CodeMirror
              value={userCode}
              extensions={[javascript({ jsx: true })]}
              theme={vscodeDark}
              onChange={handleEditorChange}
            />
          </div>

          {/* TestCase */}
          <div className="w-full overflow-auto px-5 z-50">
            {/* TestCase heading */}
            <div className="flex h-10 items-center space-x-6">
              <div className="flex flex-col h-full relative justify-center cursor-pointer">
                <div className="text-sm font-medium leading-5 text-white">
                  Testcase
                </div>
                <hr className="absolute bottom-0 bg-white h-0.5 w-full border-none rounded-full" />
              </div>
            </div>

            <div className="flex">
              {/* case 1 */}

              {problem.examples.map((example, index) => (
                <div
                  className="mr-2 items-start mt-2 text-white"
                  key={example?.id}
                  onClick={() => setActiveId(index)}
                >
                  <div className="flex flex-wrap items-center gap-y-4">
                    <div
                      className={`font-medium items-center focus:outline-none bg-dark-fill-3 hover:bg-dark-fill-2 rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap transition-all
                      ${activeId == index ? "text-white" : "text-gray-400"}
                      `}
                    >
                      Case {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="font-semibold my-4">
              <p className="text-white font-medium text-sm mt-4">Input</p>
              <div className="cursor-text w-full rounded-lg px-3 py-[10px] text-white bg-dark-fill-3 mt-2">
                {problem.examples[activeId].input}
              </div>
              <p className="text-white font-medium text-sm mt-4">Output</p>
              <div className="cursor-text w-full rounded-lg px-3 py-[10px] text-white bg-dark-fill-3 mt-2">
                {problem.examples[activeId].output}
              </div>
            </div>
          </div>
        </Split>
        <EditorFooter handleSubmit={handleSubmit} />
      </div>
    </>
  );
};
export default PlayGround;
