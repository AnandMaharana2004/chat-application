import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "../redux/codeSlice";
import { js_beautify } from "js-beautify";
import { useAxiosCall } from "../hooks/useAxiosCall";
import {
  deleteMediaForMe,
  deleteMessageForEveryone,
  deleteMessageForMe,
} from "../api/messageApi";
import { removeMessage, replaceMessage } from "../redux/messageSlices";
import { IoBanOutline } from "react-icons/io5";

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
  const dispatch = useDispatch();
  const { authUser, selectedUser } = useSelector((state) => state.user);
  const date = new Date(message?.createdAt ?? Date.now());
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { loading, error, fetchData } = useAxiosCall();

  const handleThreeDot = () => {
    setIsThreeDotMenuOpen((prev) => !prev);
  };

  useOutsideClick(dropdownRef, () => setIsThreeDotMenuOpen(false));

  const handleViewCode = () => {
    const codeString = message?.code;
    const formattedCode = js_beautify(codeString, { indent_size: 2 }); // Use js_beautify directly
    dispatch(setCode(formattedCode));
  };

  const handleDeleteForEveryOne = async () => {
    const data = await fetchData(() => deleteMessageForEveryone(message._id));
    console.log(data);
    if (data) return dispatch(replaceMessage(data));
  };

  const handleDeleteForMe = async () => {
    if (!message.content == "") {
      try {
        const data = await fetchData(() => deleteMessageForMe(message._id));
        console.log(data);
        if (data) return dispatch(removeMessage(message));
      } catch (error) {
        console.log(
          error.message || "Something went worng while deliting the text"
        );
      }
    }
    if (message.media.length > 0) {
      try {
        console.log("is commoing");
        const data = await fetchData(() => deleteMediaForMe(message._id));
        console.log(data);
        if (data) return dispatch(removeMessage(message));
      } catch (error) {
        console.log(
          error.message || "something went wrong while deleting the file"
        );
      }
    }
  };

  const handleUpdateMessage = () => {};

  return (
    <div
      className={`relative chat ${
        message?.sender === authUser?._id ? "chat-end" : "chat-start"
      }`}
    >
      {message?.content && (
        <div
          onClick={handleThreeDot}
          className={`chat-bubble   ${
            message?.sender === authUser?._id ? "bg-[#005d4c]" : ""
          } ${
            message?.isDeletedForEveryone == true
              ? "text-gray-400"
              : "text-white"
          } `}
        >
          {message.isDeletedForEveryone ? (
            <div className="flex items-center gap-2">
              <IoBanOutline className="text-red-500" />
              {message.content}
            </div>
          ) : (
            message.content
          )}
        </div>
      )}

      {message.code && (
        <>
          <div
            onClick={handleThreeDot}
            className={`chat-bubble ${
              message?.sender === authUser?._id ? "bg-[#2443b2]" : ""
            } text-white `}
          >
            <button
              className="bg-blue-900 px-3 py-1 rounded"
              onClick={handleViewCode}
            >
              view code{" "}
            </button>
          </div>
        </>
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
              <button onClick={handleDeleteForMe}>Delet For Me</button>
            </li>
            {message.sender == authUser._id &&
              !message.isDeletedForEveryone && (
                <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer">
                  <button onClick={handleDeleteForEveryOne}>
                    delete for everyone
                  </button>
                </li>
              )}
            {message.sender == authUser._id &&
              !message.isDeletedForEveryone && (
                <li className="hover:bg-gray-100 px-2 flex items-center gap-2 cursor-pointer">
                  <button onClick={handleUpdateMessage}>update message</button>
                </li>
              )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MessageBox;
