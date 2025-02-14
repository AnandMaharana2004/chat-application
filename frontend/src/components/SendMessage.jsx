import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlices";
import toast from "react-hot-toast";
import { sendMediaMessage, sendMessage } from "../api/messageApi";
import { ImAttachment } from "react-icons/im";
import { useAxiosCall } from "../hooks/useAxiosCall";
import { FaLaptopCode } from "react-icons/fa6";
import { setCode } from "../redux/codeSlice";
import { FaCode } from "react-icons/fa6";


function SendMessage() {
  const { selectedUser } = useSelector((store) => store.user);
  const { message } = useSelector((store) => store.messages);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const { fetchData, error, loading } = useAxiosCall();

  const handleFileInputClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setText(selectedFile.name);
    }
  };

  const sendHandler = async (e) => {
    e.preventDefault();
    if (text.trim() === "" && !file) return;

    if (file) {
      try {
        console.log(file);
        const data = await fetchData(() =>
          sendMediaMessage(selectedUser.conversationId, file)
        );
        if (!data) return toast.error("500 something went wrong");
        console.log(data);
        dispatch(setMessages([...message, data]));
        setText("");
        setFile(null);
      } catch (error) {
        toast.error("Failed to send media message");
      }
    } else {
      const data = await fetchData(() =>
        sendMessage(selectedUser.conversationId, { text })
      );
      if (!data) return toast.error("500 something went wrong");
      console.log(data);
      dispatch(setMessages([...message, data]));
      setText("");
    }
  };

  const handleAiClick = () => {
    dispatch(setCode("//how are you miss"));
  };

  useEffect(() => {
    setText("");
    setFile(null);
  }, [selectedUser]);

  return (
    <div className="bottom w-full flex gap-2">
      <button className="btn btn-neutral" onClick={handleAiClick}>
        <FaCode />
      </button>
      <button className="btn btn-neutral" onClick={handleFileInputClick}>
        <ImAttachment />
      </button>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button className="btn btn-neutral" onClick={sendHandler}>
        <IoMdSend />
      </button>
    </div>
  );
}

export default SendMessage;
