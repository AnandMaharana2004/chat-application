import React from "react";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlices";
import toast from "react-hot-toast";
import axios from "axios";
import useGetMessages from "../hooks/useGetMessages";
import useGetRealtimeMessages from "../hooks/useGetRealTimeMessages";
import { sendMessage } from "../api/messageApi";

function MessageContainer() {
  useGetMessages();
  useGetRealtimeMessages();
  const { message: messageArray } = useSelector((store) => store.messages);
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const handlesendMessage = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const response = await sendMessage(selectedUser?.conversationId, {
          text: "hello, 😊",
        });
        dispatch(setMessages([...messageArray, response?.data?.data]));
      } catch (error) {
        toast.error(
          error.message || "someting went wrong while send mesage !!"
        );
      }
    })();
  };
  return (
    <div className="h-full rounded-lg relative">
      {messageArray == null && (
        <span className="loading loading-spinner loading-lg mx-auto"></span>
      )}
      {messageArray?.length == 0 ? (
        <div className="flex justify-center items-center h-full ">
          <div className="bg-slate-700 text-white px-3 py-5 ">
            <h1>No message here yet...</h1>
            <h2>Send a message or tap</h2>
            <h2>the greeting below.</h2>
            <button
              className="emoji px-1 my-4 bg-white py-5 rounded-full w-full"
              onClick={handlesendMessage}
            >
              <img
                src="https://i.pinimg.com/736x/f9/13/46/f9134655b53cbeaeb00664b04371b9b0.jpg"
                alt="hii emoji"
                className="w-[100px] h-[90px] mx-auto cursor-pointer "
              />
            </button>
          </div>
        </div>
      ) : (
        messageArray?.length > 0 &&
        messageArray?.map((eatchmessage, index) => {
          return (
            <MessageBox
              key={eatchmessage?._id || index}
              message={eatchmessage}
            />
          );
        })
      )}
    </div>
  );
}

export default MessageContainer;
