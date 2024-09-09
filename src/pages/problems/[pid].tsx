import Topbar from "@/components/Topbar/Topbar";
import WorkSpace from "@/components/WorkSpace/WorkSpace";
import { problemList } from "@/utils/Problems";
import { Problem } from "@/utils/types/problem.";
import { PageNotFoundError } from "next/dist/shared/lib/utils";
import React from "react";

type ProblemsPageProps = {
  problem: Problem;
};

const ProblemsPage: React.FC<ProblemsPageProps> = ({ problem }) => {
  // console.log(problem);
  return (
    <>
      <Topbar problemPage />
      <WorkSpace problem={problem} />
    </>
  );
};
export default ProblemsPage;

// SSG ,it get the dynamic routes
export async function getStaticPaths() {
  const paths = Object.keys(problemList).map((key) => ({
    params: { pid: key },
  }));

  return {
    paths,
    fallback: false,
  };
}

// it fetches the data
export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;

  const problem = problemList[pid];

  if (!problem) {
    return {
      notFound: true,
    };
  }
  problem.handlefunction = problem.handlefunction.toString();
  return {
    props: {
      problem,
    },
  };
}
