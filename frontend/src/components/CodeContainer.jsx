import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useAxiosCall } from "../hooks/useAxiosCall";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "../redux/codeSlice";
import { IoMdSend } from "react-icons/io";
import { MdOutlineClear } from "react-icons/md";
import { codeSend } from "../api/messageApi";
import { setMessages } from "../redux/messageSlices";
import { analyseCode } from "../api/aiApi";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CodeEditor = ({
  style,
  isbackButtonShow = true,
  isResultButton = true,
}) => {
  const codeRef = useRef(null); // Create a ref
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState(null);
  const [isResultShow, setisResultShow] = useState(false);
  const dispatch = useDispatch();
  const [codeText, setCodeText] = useState("");
  const { code } = useSelector((store) => store.codes);
  const { selectedUser } = useSelector((store) => store.user);
  const { message } = useSelector((store) => store.messages);
  const { loading, fetchData } = useAxiosCall();
  const [loadingResponse, setLoadingResponse] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

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
    if (isResultShow) return navigator.clipboard.writeText(response);
    setCodeText(code);
    navigator.clipboard.writeText(codeText);
  };
  const handleAnlyseCode = async () => {
    try {
      dispatch(setCode(codeText));
      setLoadingResponse(true);
      const response = await analyseCode(codeText);
      setResponse(response.data);
      setLoadingResponse(false);
    } catch (error) {
      setLoadingResponse(false);
      return toast.error("someting went wrong while analyse code !!");
    }
  };

  const handleSeeResult = () => {
    setisResultShow((prev) => !prev);
  };
  return (
    <div className={`h-full flex flex-col relative border-l-0 ${style}`}>
      <div className="flex justify-between items-center px-6 py-3 bg-gray-900">
        <button
          className={`text-white px-2 py-2 rounded bg-gray-700 hover:bg-gray-600  ${
            isbackButtonShow ? "hidden" : ""
          }`}
          onClick={handleGoBack}
        >
          <MdOutlineClear className="size-4 text-sm" />
        </button>
        <div className="text-yellow-500 font-bold">javascript</div>
        <div className="buttons">
          {isResultButton && (
            <button
              className=" mx-2 bg-blue-700 text-white px-4 py-2 text-sm rounded hover:bg-blue-600"
              onClick={handleSeeResult}
            >
              {!loadingResponse && (
                <>{!isResultShow == true ? "Result" : "Code"}</>
              )}
              {loadingResponse && (
                <span className="loading loading-spinner loading-lg mx-auto size-3"></span>
              )}
            </button>
          )}
          <button
            className="bg-green-700 text-white px-4 py-2 text-sm rounded hover:bg-green-600"
            onClick={copyHandler}
          >
            Copy
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isResultShow == false && (
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
        )}
        {isResultShow == true && (
          // <div className=" bg-[#414040] text-white h-full px-5 py-4 overflow-y-auto">
          //   <Markdown rehypePlugins={[reHipeHylighter]}>{`${response}`}</Markdown>
          // </div>

          // <div className="bg-[#414040] text-white h-full px-5 py-4 overflow-y-auto">
          //   <Markdown
          //     children={response} // Use 'children' prop, not template literal
          //     components={{
          //       code({ node, inline, className, children, ...props }) {
          //         const match = /language-(\w+)/.exec(className || "");
          //         return !inline && match ? (
          //           <SyntaxHighlighter
          //             children={String(children).replace(/\n$/, "")}
          //             style={dracula} // Your chosen theme
          //             language={match[1]}
          //             PreTag="div"
          //             {...props}
          //           />
          //         ) : (
          //           <code className={className} {...props}>
          //             {children}
          //           </code>
          //         );
          //       },
          //     }}
          //   />
          // </div>

          <div className="bg-[#414040] text-white h-full px-5 py-4 overflow-y-auto relative">
            {" "}
            {/* relative for positioning button */}
            <Markdown
              children={response}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : null; // Get language or null if not found
                  const codeContent = String(children).replace(/\n$/, ""); // Store code content

                  return !inline && language ? (
                    <div className="relative">
                      {" "}
                      {/* Wrap with relative div for button positioning */}
                      <SyntaxHighlighter
                        children={codeContent}
                        style={dracula}
                        language={language}
                        PreTag="div"
                        ref={codeRef} // Assign the ref
                        {...props}
                      />
                      <CopyToClipboard text={codeContent} onCopy={handleCopy}>
                        <button className="absolute top-10 right-2 bg-black text-white px-2 py-1 rounded text-sm hover:bg-gray-700 focus:outline-none">
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </CopyToClipboard>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        )}
      </div>

      {!isResultButton && (
        <button
          className="btn btn-neutral absolute bottom-4 right-4"
          onClick={sendCode}
        >
          {!loading && <IoMdSend />}
          {loading && (
            <span className="loading loading-spinner loading-lg mx-auto size-3"></span>
          )}
        </button>
      )}
      {isResultButton && !isResultShow && (
        <button className="absolute bottom-4 right-4">
          {
            <button
              className=" mx-2 bg-blue-700 text-white px-4 py-2 text-sm rounded hover:bg-blue-600"
              onClick={handleAnlyseCode}
            >
              {!loadingResponse && "Analyse"}
              {loadingResponse && (
                <span className="loading loading-spinner loading-lg mx-auto size-3"></span>
              )}
            </button>
          }
        </button>
      )}
    </div>
  );
};

export default CodeEditor;
