import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { replaceMessage } from "../redux/messageSlices";

function useGetRealTimedeleteForEveryOneMessage() {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socket);
  const { message } = useSelector((store) => store.messages) || []; // Ensure it's always an array

  useEffect(() => {
    const handleDeleteMessage = (message) => {
      dispatch(replaceMessage(message));
    };

    socket?.on("delete-message-for-everyone", handleDeleteMessage);

    return () => {
      socket?.off("delete-message-for-everyone", handleDeleteMessage);
    };
  }, [dispatch, message]); // `message` is always an array now
}

export default useGetRealTimedeleteForEveryOneMessage;
