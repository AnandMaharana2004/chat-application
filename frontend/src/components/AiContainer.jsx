import React from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import UserBox from "./UserBox";

function AiContainer({ callback }) {
  return (
    <div>
      <div className=" flex items-center gap-3 py-1 px-3 text-xl text-white sticky top-0">
        <button onClick={() => callback()}>
          <IoArrowBackSharp />
        </button>
        <div className="">Code Agents</div>
      </div>
      <div className="agentsContainer">
        <UserBox user={{}} fromAi={true} />
      </div>
    </div>
  );
}

export default AiContainer;
