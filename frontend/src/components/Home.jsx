import React, { useEffect, useState } from "react";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import CodeEditor from "./CodeContainer";

function Home() {
  const [selectComponent, setSelectComponent] = useState("home");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const { authUser, selectedUser, profile } = useSelector(
    (state) => state.user
  );
  const { code} = useSelector(store => store.codes)
  if (!authUser) navigate("/login");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 775) {
        return setIsMobile(true); // Mobile if screen width <= 480px
      }
      return setIsMobile(false);
    };

    handleResize(); // Initialize on load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      return setSelectComponent("chat");
    }
    if (profile) return setSelectComponent("profile");
    setSelectComponent("home");
  }, [selectedUser, profile]);
  return (
    <>
      {!isMobile && (
        <div className="bg-gray-800 h-screen rounded p-1 overflow-hidden">
          <div
            className={`bg-gray-800 grid grid-cols-[35%_65%]  
          ${
            profile ? `lg:grid-cols-[30%_40%_30%]` : `lg:grid-cols-[30%_70%]`
          } md:grid-cols-[50%_50%] 
          h-full w-full rounded md:px-10 lg:px-20 py-5`}
          >
            {/* Make each section scrollable if content exceeds space */}
            <div className="overflow-y-auto max-h-full">
              <LeftContainer className={"border"} />
            </div>
            <div className="overflow-y-auto max-h-full">
              <RightContainer className={"border-l-0 border"} />
            </div>
            {profile && (
              <div className="overflow-y-auto max-h-full">
                <Profile className={"border border-l-0"} />
              </div>
            )}
          </div>
        </div>
      )}

      {isMobile && (
        <div className="h-screen w-screen overflow-hidden">
          <div className="h-full w-full overflow-y-auto">
            {
              {
                home: <LeftContainer className={"border-0"} />,
                chat: <RightContainer className={"border-0"} />,
                profile: (
                  <Profile close={setSelectComponent} className={"border-0"} />
                ),
              }[selectComponent]
            }
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
