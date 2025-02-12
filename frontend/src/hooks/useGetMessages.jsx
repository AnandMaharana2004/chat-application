import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlices";
import { getMessages } from "../api/messageApi";
function useGetMessages() {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);
  const { message } = useSelector((state) => state.messages);
  useEffect(() => {
    (async()=>{
      try {
        const response = await getMessages(selectedUser.conversationId)
        // console.log(response.data.data);
        dispatch(setMessages(response.data.data))
      } catch (error) {
        console.log(error?.message);
      }
    })()
  }, [selectedUser?._id, setMessages]);
}

export default useGetMessages;
