import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlices";

const useGetRealtimeMessages = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socket);
  const message = useSelector((store) => store.messages.message) || []; // Ensure it's always an array

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log(newMessage);
      dispatch(setMessages([...message, newMessage])); // Now message will never be null
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [dispatch, message]); // `message` is always an array now

};

export default useGetRealtimeMessages;
