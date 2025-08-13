import React from "react";
import { LineWobble } from "ldrs/react";
import "ldrs/react/LineWobble.css";

const WebLoader = () => {
  return (
    <div className="h-screen flex w-full justify-center items-center">
      <LineWobble
        size="150"
        stroke="5"
        bgOpacity="0.1"
        speed="3.5"
        color="black"
      />
    </div>
  );
};

export default WebLoader;
