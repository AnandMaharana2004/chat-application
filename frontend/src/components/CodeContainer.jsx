import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useAxiosCall } from "../hooks/useAxiosCall";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "../redux/codeSlice";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { MdOutlineClear } from "react-icons/md";
import { codeSend } from "../api/messageApi";
import { setMessages } from "../redux/messageSlices";


const CodeEditor = () => {
  const dispatch = useDispatch();
  const [codeText, setCodeText] = useState("");
  const { code } = useSelector((store) => store.codes);
  const { selectedUser } = useSelector((store) => store.user);
  const { message } = useSelector((store) => store.messages);
  const { loading, fetchData, error } = useAxiosCall();

  const sendCode = async (e) => {
    // dispatch(setCode(codeText));
    // console.log(code);
    // console.log(code);
    console.log(typeof codeText);
    const data = await fetchData(() => codeSend(selectedUser.conversationId, codeText));
    console.log(data);
    dispatch(setMessages([...message,data]));
  };

  const handleGoBack = () => {
    dispatch(setCode(null));
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-between px-6 py-3 bg-gray-900">
        <button
          className="text-white px-2 rounded bg-gray-700 hover:bg-gray-600"
          onClick={handleGoBack}
        >
          <MdOutlineClear className="size-4 text-sm" />
        </button>
        <button className="bg-green-700 text-white px-4 py-2 text-sm rounded hover:bg-green-600">
          copy
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          defaultLanguage="javascript"
          defaultValue={code}
          theme="vs-dark"
          onChange={(value) => setCodeText(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <button
        className="btn btn-neutral absolute bottom-4 right-4"
        onClick={sendCode}
      >
        <IoMdSend />
      </button>
    </div>
  );
};

export default CodeEditor;
