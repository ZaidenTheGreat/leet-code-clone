import React from "react";

type CircleSkeletonProps = {};

const CircleSkeleton: React.FC<CircleSkeletonProps> = () => {
  return (
    <div className="animate-pulse space-y-2.5">
      <div className="flex items-center w-full space-x-2">
        <div className="h-6 w-6 bg-dark-fill-3 rounded-full"></div>
      </div>
    </div>
  );
};
export default CircleSkeleton;
