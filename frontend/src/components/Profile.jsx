import React, { useEffect, useState } from "react";

import { MdOutlineClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useAxiosCall } from "../hooks/useAxiosCall";
import { setProfile, setSelectedUsers } from "../redux/userSlices";
import {
  getProfile,
  updateAbout,
  updateBio,
  updateUserProfile,
} from "../api/userApi";
import ProfilePic from "./ProfilePic";
import LogOut from "./LogOut";
import { PiCameraRotateLight } from "react-icons/pi";
import { BsChatDots } from "react-icons/bs";
import { BiVideo } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";

function Profile({ close, className }) {
  const dispatch = useDispatch();
  const { profile, authUser, userFriendList } = useSelector(
    (store) => store.user
  );
  const [isMyProfile, setisMyProfile] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [about, setAbout] = useState("");
  const [responseData, setResponseData] = useState({});
  const { fetchData } = useAxiosCall();
  const [file, setFile] = useState("");

  useEffect(() => {
    (async () => {
      setisMyProfile(false);
      setIsEditable(false);
      if (authUser._id == profile) {
        setisMyProfile(true);
        setIsEditable(true);
      }
      const res = await fetchData(() => getProfile(profile));
      if (res) {
        setResponseData(res);
        setAbout(res?.about || "");
        setBio(res?.bio || "");
        setUsername(res?.username);
        setProfilePicture(res?.profilePicture);
      }

      console.log(res);
    })();
  }, [profile]);

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

  const handelTakeProfilePicFile = (e) => {
    document.getElementById("profilePicfile").click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Please select a valid image file (JPEG, PNG, or WEBP).");
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (selectedFile.size > maxSize) {
        alert("File size should be less than 2MB.");
        return;
      }

      // ✅ File preview generation
      const reader = new FileReader();
      reader.onload = (event) => setProfilePicture(event.target.result);
      reader.readAsDataURL(selectedFile);

      setFile(selectedFile);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    let res = {};
    if (responseData.about !== about) {
      res = await fetchData(() => updateAbout({ about }));
      if (Object(res).length > 0) setAbout(res.about);
      res = {};
    }
    if (responseData?.bio === bio) return;
    res = await fetchData(() => updateBio({ bio }));
    console.log("the respone of update bio is ", res);
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    const user = userFriendList.filter(
      (friend) => friend._id == responseData.id
    );
    dispatch(setSelectedUsers(user[0]));
  };
  return (
    <div className={`w-full h-full ${className} px-2 py-3 `}>
      <div className="top flex items-center gap-3 text-clr-w relative">
        <button
          onClick={() => {
            dispatch(setProfile(null));
            close("home");
          }}
        >
          <MdOutlineClear className="size-6 hover:bg-[#7ea4ea]" />
        </button>
        <h3> {isMyProfile ? "My Profile" : `${username}'s Profile`} </h3>
      </div>

      <div className="profilePic-section flex flex-col items-center relative">
        <div className="bg-div absolute bg-dark-bg w-full h-40 rounded-md mt-10"></div>
        <div className="relative">
          <ProfilePic url={profilePicture} className={"w-44 h-44 mt-10"} />
          {isMyProfile && (
            <button
              className="absolute right-0 bottom-1 p-2 bg text-3xl bg-green-800 text-white font-extrabold rounded-full  "
              onClick={handelTakeProfilePicFile}
            >
              <PiCameraRotateLight />
            </button>
          )}
        </div>
        <input
          type="file"
          id="profilePicfile"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className=" font-bold my-1 mb-4 text-xl text-white ">
          {username}
        </div>
      </div>
      {!isMyProfile && (
        <div className="FeatureContainer flex items-center justify-between px-4 bg-[#1d232a] py-3 my-1">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleChatClick}
          >
            <BsChatDots className="text-green-800 text-3xl font-extrabold " />
            chat
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <BiVideo className="text-green-800 text-3xl font-extrabold " />
            video call
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <MdFavorite className="text-red-500 text-3xl font-extrabold" />
            Favorate
          </div>
        </div>
      )}
      <div className="details bg-dark-bg w-full p-2 py-3 text-clr-w flex flex-col gap-1 rounded-md bg-[#1d232a] my-1">
        <label htmlFor="" className="text-small-text text-white">
          About :
        </label>
        <input
          type="text"
          className="bg-transparent pl-2 outline-none border-none"
          onChange={(e) => handleAbout(e)}
          value={about}
        />
        <label htmlFor="" className="text-small-text text-white">
          Bio :
        </label>
        <textarea
          type="text"
          className="bg-transparent pl-2 outline-none border-none resize-none overflow-y-auto"
          onChange={(e) => handleBio(e)}
          value={bio}
        />

        {isMyProfile && (
          <>
            <button
              className="bg-green-800 px-2 p-1 mx-auto text-white rounded"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </>
        )}
      </div>
      {isMyProfile && (
        <div className="bg-[#1d232a] my-1 px-1 py-3 rounded">
          <h1 className="text-white my-1">More information</h1>
          <div className="text-lg">
            <div>Email : {responseData?.email}</div>
            <div>Gender : {responseData?.gender}</div>
            <div>Friends : {responseData?.friendCount}</div>
            <div>Block Friends : {responseData?.blockCount}</div>
            <div>Favorate Friends : {responseData?.favoriteCount}</div>
          </div>
        </div>
      )}
      {!isMyProfile && (
        <div className="bg-[#1d232a] p-1 my-1 rounded">
          <h1>Medias </h1>
          <div className="h-40 flex justify-center items-center">No Media </div>
        </div>
      )}
      {isMyProfile && <LogOut />}
    </div>
  );
}

export default Profile;
