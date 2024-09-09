import React from "react";

type LoadingSkeletonHomeProps = {};

const LoadingSkeletonHome: React.FC<LoadingSkeletonHomeProps> = () => {
  return (
    <div className="flex item-center space-x-16 mt-4 px-6 py-2">
      <div className="w-5 h-5 shrink-0 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-15 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-40 w-15 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-40 w-15 rounded-full bg-dark-layer-1"></div>
    </div>
  );
};
export default LoadingSkeletonHome;
