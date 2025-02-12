import React, { useEffect, useState } from "react";

import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineClear } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useAxiosCall } from "../hooks/useAxiosCall";
import { setProfile } from "../redux/userSlices";
import { getProfile } from "../api/userApi";
import ProfilePic from "./ProfilePic";

function Profile({ close, className }) {
  const dispatc = useDispatch();
  const { profile } = useSelector((store) => store.user);
  const [isButtonShow, setIsButtonShow] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  // const [data, setData] = useState(null)
  const [profilePicture, setProfilePicture] = useState("");
  const [about, setAbout] = useState("The nature is so cool");

  const { fetchData, error, loading } = useAxiosCall();

  useEffect(() => {
    (async () => {
      const res = await fetchData(() => getProfile(profile));
      if (res) {
        setAbout(res?.about || "");
        setBio(res?.bio || "");
        setUsername(res?.username);
        setProfilePicture(res?.profilePicture);
      }
    })();
  }, [profile]);

  const handleUsername = (e) => {
    e.preventDefault();
    if (isEditable == true) {
      setUsername(e.target.value);
    }
  };

  const handleBio = (e) => {
    e.preventDefault();
    if (isEditable == true) {
      setBio(e.target.value);
    }
  };
  
  const handleAbout = (e) => {
    e.preventDefault();
    if (isEditable == true) {
      setAbout(e.target.value);
    }
  };

  return (
    <div className={`w-full h-full ${className} px-2 py-3`}>
      <div className="top flex items-center gap-3 text-clr-w">
        <button
          onClick={() => {
            dispatc(setProfile(null));
            close("home");
          }}
        >
          <MdOutlineClear className="size-6 hover:bg-[#7ea4ea]" />
        </button>
        <h3>Profile Info</h3>
      </div>

      <div className="profilePic-section flex flex-col items-center relative">
        <div className="bg-div absolute bg-dark-bg w-full h-40 rounded-md mt-10"></div>
        {/* <div className="image-circule rounded-full w-44 h-44 z-10 mt-20 border-4 border-dark-bg p-1 bg-active-green">
          <img src={`${profilePicture}`} alt="" />
        </div> */}
        <ProfilePic url={profilePicture} className={'w-44 h-44 mt-10'}/>
        <div className="userName font-bold text-clr-w my-1 mb-4 text-large-text ">
          {username}
        </div>
      </div>
      <div className="details bg-dark-bg w-full p-2 py-3 text-clr-w flex flex-col gap-1 rounded-md">
        <label htmlFor="" className="text-small-text">
          Username :
        </label>
        <input
          type="text"
          className="bg-transparent pl-2 outline-none border-none"
          onChange={(e) => handleUsername(e)}
          value={username}
        />
        <label htmlFor="" className="text-small-text">
          About :
        </label>
        <input
          type="text"
          className="bg-transparent pl-2 outline-none border-none"
          onChange={(e) => handleAbout(e)}
          value={about}
        />
        <label htmlFor="" className="text-small-text">
          Bio :
        </label>
        <textarea
          type="text"
          className="bg-transparent pl-2 outline-none border-none resize-none overflow-y-auto"
          onChange={(e) => handleBio(e)}
          value={bio}
        />
        {isButtonShow == true ? (
          <>
            <button
              className={`px-4 py-1 bg-active-green mx-auto rounded-md items-center gap-1 ${
                isEditable == false ? `flex` : `hidden`
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsEditable((pre) => !pre);
              }}
            >
              <FaRegEdit /> Edit
            </button>
            <button
              className={`px-4 py-1 bg-active-green mx-auto rounded-md ${
                isEditable == false ? `hidden` : `flex`
              } items-center gap-1 `}
              onClick={(e) => {
                e.preventDefault();
                setIsEditable((pre) => !pre);
              }}
            >
              <LuSave /> Save
            </button>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="buttons">
        {/* <button className="bg-active-green px-5 py-1 rounded-md flex items-center text-clr-w my-2"> Add to Favorate</button> */}
      </div>
    </div>
  );
}

export default Profile;
