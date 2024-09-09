import React, { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import PlayGround from "./PlayGround/PlayGround";
import { problemList } from "@/utils/Problems";
import { Problem } from "@/utils/types/problem.";
import useWindowSize from "@/hooks/useWindowSize";
import Confetti from "react-confetti";

type WorkSpaceProps = {
  problem: Problem;
};

const WorkSpace: React.FC<WorkSpaceProps> = ({ problem }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const [solved, setSolved] = useState<boolean>(false);
  return (
    <Split
      className="split"
      direction="horizontal"
      minSize={0}
      sizes={[38, 62]}
    >
      <ProblemDescription problem={problem} _solved={solved} />
      <div className="bg-dark-fill-2">
        <PlayGround
          problem={problem}
          setSuccess={setSuccess}
          setSolved={setSolved}
        />
        {success && (
          <Confetti
            gravity={0.3}
            // numberOfPieces={200}
            tweenDuration={3000}
            width={width}
            height={height}
          />
        )}
      </div>
    </Split>
  );
};
export default WorkSpace;
