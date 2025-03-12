import React, { useState, useRef, useEffect } from "react";
import MessageContainer from "./MessageContainer";
import { useDispatch, useSelector } from "react-redux";
import useGetRealtimeMessages from "../hooks/useGetRealTimeMessages";
import { setSelectedUsers, setUserFavorateList } from "../redux/userSlices";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdOutlineDeleteOutline, MdPerson, MdFavorite } from "react-icons/md";
import { BsThreeDotsVertical, BsPersonFillSlash } from "react-icons/bs";
import { BiVideo } from "react-icons/bi";
import SendMessage from "./SendMessage";
import ProfilePic from "./ProfilePic";
import CodeEditor from "./CodeContainer";

function RightContainer({ className }) {
  useGetRealtimeMessages();
  const dispatch = useDispatch();
  const { authUser, selectedUser } = useSelector((state) => state.user);
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { code } = useSelector((store) => store.codes);
  const isFavorate =
    selectedUser && authUser.favoriteList.includes(selectedUser._id);

  const handleGoBack = () => {
    dispatch(setSelectedUsers(null));
  };

  const handleThreeDot = () => {
    setIsThreeDotMenuOpen((prev) => !prev);
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsThreeDotMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const togleFavorite = () => {
    dispatch(setUserFavorateList(selectedUser?._id));
  };

  return (
    <>
      {selectedUser == null ? (
        <>
          {code && <CodeEditor style={"border"} />}
          {!code && !selectedUser && (
            <div
              className={`h-full w-full flex justify-center items-center text-gray-500 text-lg ${className}`}
            >
              Let's chat with your friends
            </div>
          )}
        </>
      ) : (
        <div
          className={`h-full w-full flex flex-col justify-between px-2 py-3 relative ${className}`}
        >
          {/* Top Section */}
          <div className="flex items-center justify-between sticky top-0 p-2 z-10  bg-gray-800 text-white shadow-md">
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="text-white px-3 py-3 rounded bg-gray-700 hover:bg-gray-600 lg:hidden"
              >
                <IoArrowBackSharp className="" />
              </button>
              <ProfilePic user={selectedUser} />
              <div className="text-sm lg:text-base font-semibold">
                {selectedUser?.username}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex gap-3 lg:gap-4 text-white">
              <MdFavorite
                onClick={togleFavorite}
                className={`h-5 w-5 lg:h-6 lg:w-6 cursor-pointer ${
                  isFavorate ? "text-red-700" : ""
                }`}
              />
              <BiVideo className="h-5 w-5 lg:h-6 lg:w-6 cursor-pointer" />

              <div className="relative" ref={dropdownRef}>
                <BsThreeDotsVertical
                  className="h-5 w-5 lg:h-6 lg:w-6 cursor-pointer"
                  onClick={handleThreeDot}
                  aria-label="Options menu"
                />
                {isThreeDotMenuOpen && (
                  <div className="absolute right-0 top-10 bg-white shadow-lg border border-gray-200 text-black rounded-md px-3 py-3 w-48">
                    <ul className="flex flex-col gap-2">
                      <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer">
                        <MdPerson className="h-5 w-5 lg:h-6 lg:w-6" />
                        <button>View Profile</button>
                      </li>
                      <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer">
                        <MdFavorite className="h-5 w-5 lg:h-6 lg:w-6" />
                        <button>Favorites</button>
                      </li>
                      <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer">
                        <BsPersonFillSlash className="h-5 w-5 lg:h-6 lg:w-6" />
                        <button>Block</button>
                      </li>
                      <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer text-red-600">
                        <MdOutlineDeleteOutline className="h-5 w-5 lg:h-6 lg:w-6" />
                        <button>Clear Chat</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section */}
          {!code && (
            <div className="middle flex-grow overflow-y-auto ">
              <MessageContainer />
            </div>
          )}
          {code && (
            <CodeEditor isbackButtonShow={false} isResultButton={false} />
          )}
          {/* Bottom Section */}
          {!code && (
            <div className="sticky bottom-0">
              <SendMessage />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RightContainer;
