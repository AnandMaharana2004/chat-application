import React, { useEffect, useRef, useState } from "react";
import UserContainer from "./UserContainer";
import { useDispatch, useSelector } from "react-redux";
import LogOut from "./LogOut";
import { IoIosNotificationsOutline, IoIosSearch } from "react-icons/io";
import { FaLaptopCode } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";

import { MdOutlineExplore } from "react-icons/md";
import Explore from "./Explore";
import ProfilePic from "./ProfilePic";
import AiContainer from "./AiContainer";
import { setCode } from "../redux/codeSlice";

function LeftContainer({ className }) {
  const dispatch = useDispatch();
  const [activeChat, setActiveChat] = useState("single");
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const user = useSelector((state) => state?.user?.authUser || {});
  const dropdownRef = useRef(null);

  const handleThreeDot = () => {
    setIsThreeDotMenuOpen((prev) => !prev);
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsThreeDotMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("pointerdown", handleOutsideClick); // Use pointerdown for better control
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

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
          <ProfilePic user={user} />
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
          <div className="threedots relative">
            <button aria-label="Open menu" onClick={handleThreeDot}>
              <BsThreeDotsVertical className="w-6 h-6 text-white" />
            </button>
            <div
              ref={dropdownRef}
              style={{
                display: isThreeDotMenuOpen ? "block" : "none", // Temporary debug
              }}
              className="list absolute right-5 top-8 bg-stone-100 text-black rounded-sm px-1 py-3 w-[200px] shadow-md"
            >
              <ul
                className="flex flex-col gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {[
                  "Group Chats",
                  "Online Users",
                  "Favorite List",
                  "Block List",
                  "Edit Profile",
                  "Create new Group",
                ].map((label, index) => (
                  <li key={index} className="hover:bg-slate-200 px-2">
                    <button>{label}</button>
                  </li>
                ))}
                <li className="mt-5">
                  <LogOut />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        className={`buttons rounded-xl mx-1 my-2 flex items-center justify-evenly text-white ${
          activeChat == "explore" ? "hidden" : ""
        }`}
      >
        <button
          className={`px-3 p-2 rounded text-md font-semibold w-[40%] ${
            activeChat === "single" ? "bg-blue-800  text-white" : ""
          }`}
          onClick={handleSingleChatClick}
        >
          single chats
        </button>
        <button
          className={`px-3 p-2 rounded text-md font-semibold w-[40%] ${
            activeChat === "group" ? "bg-blue-800 text-white" : ""
          }`}
          onClick={handleGroupChatClick}
        >
          group chats
        </button>
      </div> */}
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
