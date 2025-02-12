import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";

function useOutsideClick(ref, callback) {
  const handleClick = useCallback(
    (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    },
    [callback, ref]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick]);
}

function MessageBox({ message }) {
  const { authUser, selectedUser } = useSelector((state) => state.user);
  const date = new Date(message?.createdAt ?? Date.now());
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleThreeDot = () => {
    setIsThreeDotMenuOpen((prev) => !prev);
  };

  useOutsideClick(dropdownRef, () => setIsThreeDotMenuOpen(false));

  return (
    <div
      className={`relative chat ${
        message?.sender === authUser?._id ? "chat-end" : "chat-start"
      }`}
    >
      {message?.content && (
        <div
          onClick={handleThreeDot}
          className={`chat-bubble ${
            message?.sender === authUser?._id ? "bg-[#005d4c]" : ""
          } text-white `}
        >
          {message.content}
        </div>
      )}
      {message?.media?.length > 0 && (
        <div
          onClick={handleThreeDot}
          className={`chat-bubble rounded-md px-2 ${
            message?.sender === authUser?._id ? "bg-[#005d4c]" : ""
          } text-white `}
        >
          <img
            src={message.media[0]?.url ?? ""}
            alt="media photo"
            className="w-[158px] rounded outline-none border-none shadow-none"
          />
        </div>
      )}
      <div className="chat-footer opacity-50">{time}</div>

      {isThreeDotMenuOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-12 bg-white shadow-lg border border-gray-200 text-black rounded-md px-3 py-3 w-48 z-10 mx-7"
        >
          <ul className="flex flex-col gap-2">
            <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer">
              <button>delete for me</button>
            </li>
            <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer">
              <button>delete for everyone</button>
            </li>
            <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer">
              <button>update message</button>
            </li>
            <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer text-red-600">
              <button>Clear Chat</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MessageBox;
