import React from "react";

type RectangleSkeletonProps = {};

const RectangleSkeleton: React.FC<RectangleSkeletonProps> = () => {
  return (
    <div className="animate-plus space-y-2.5">
      <div className="flex items-center w-full">
        <div className="h-6 w-12 bg-dark-fill-3 rounded-full"></div>
      </div>
    </div>
  );
};
export default RectangleSkeleton;
