import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useAxiosCall } from "../hooks/useAxiosCall";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "../redux/codeSlice";
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
  const { loading, fetchData } = useAxiosCall();

  const sendCode = async (e) => {
    try {
      const data = await fetchData(() =>
        codeSend(selectedUser.conversationId, codeText)
      );
      dispatch(setMessages([...message, data]));
      setCodeText("");
      dispatch(setCode(null));
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleGoBack = () => {
    dispatch(setCode(null));
  };

  const copyHandler = () => {
    setCodeText(code);
    navigator.clipboard.writeText(codeText);
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
        <button
          className="bg-green-700 text-white px-4 py-2 text-sm rounded hover:bg-green-600"
          onClick={copyHandler}
        >
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
            wordWrap: "on",
          }}
        />
      </div>

      <button
        className="btn btn-neutral absolute bottom-4 right-4"
        onClick={sendCode}
      >
        {!loading && <IoMdSend />}
        {loading && (
        <span className="loading loading-spinner loading-lg mx-auto size-3"></span>
      )}
      </button>
    </div>
  );
};

export default CodeEditor;
