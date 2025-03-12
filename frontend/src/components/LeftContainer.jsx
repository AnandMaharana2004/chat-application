import React, { useEffect, useRef, useState } from "react";
import UserContainer from "./UserContainer";
import { useDispatch, useSelector } from "react-redux";
import LogOut from "./LogOut";
import { IoIosNotificationsOutline, IoIosSearch } from "react-icons/io";
import { FaLaptopCode } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";

import { MdOutlineExplore } from "react-icons/md";
import Explore from "./Explore";
import AiContainer from "./AiContainer";
import ProflleCircle from "./ProflleCircle";
import { setProfile } from "../redux/userSlices";

function LeftContainer({ className }) {
  const dispatch = useDispatch();
  const [activeChat, setActiveChat] = useState("single");
  const user = useSelector((state) => state?.user?.authUser || {});

  const handleAiClick = () => {
    setActiveChat("aiContainer");
  };
  const handleSingleChatClick = () => {
    setActiveChat("single");
  };
  const handleExploreClick = () => {
    setActiveChat("explore");
  };

  return (
    <div className={`flex flex-col h-full w-full relative ${className}`}>
      <div className="flex items-center justify-between px-2 py-2 bg-gray-800 sticky top-0 z-10 shadow-lg">
        <div className="usernameAndProfile flex items-center">
          <ProflleCircle
            profilePicUrl={user?.profilePicture}
            isClickable={true}
            onClickFunction={() => {
              dispatch(setProfile(user._id));
            }}
          />
          <div className="Username pl-2 text-white">
            Hii 👋,{" "}
            <span className="font-bold">{user?.username || "Guest"}</span>
          </div>
        </div>
        <div className="rightside flex items-center gap-5">
          <button aria-label="explore">
            <MdOutlineExplore
              className="w-6 h-6 text-white"
              onClick={handleExploreClick}
            />
          </button>
          <button aria-label="Search">
            <FaLaptopCode
              className="w-6 h-6 text-white"
              onClick={handleAiClick}
            />
          </button>
          <div className="notification relative cursor-pointer">
            <IoIosNotificationsOutline className="w-6 h-6 text-white" />
            {user?.hasNotifications && (
              <div className="reddot bg-red-600 h-2 w-2 rounded-full absolute top-0 right-0"></div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow relative">
        {
          {
            single: <UserContainer />,
            aiContainer: <AiContainer callback={handleSingleChatClick} />,
            explore: <Explore callback={handleSingleChatClick} />,
          }[activeChat]
        }
      </div>
    </div>
  );
}

export default LeftContainer;
