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
import { BiVideo, BiBlock } from "react-icons/bi";
import { MdFavorite, MdPersonAddAlt, MdOutlineReport } from "react-icons/md";
import toast from "react-hot-toast";

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
  const [isInFirendList, setisInFirendList] = useState(false);

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
        if (userFriendList.some((friend) => friend._id === res.id))
          return setisInFirendList(true);
        setisInFirendList(false);
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
      res = {};
      res = await fetchData(() => updateAbout({ about }));
      if (Object(res).length > 0) {
        setAbout(res.about);
      }
    }
    if (responseData.bio !== bio) {
      res = await fetchData(() => updateBio({ bio }));
    }
    if (responseData.profilePicture !== profilePicture) {
      console.log(file);
      try {
        res = {};
        res = await fetchData(() => updateUserProfile(file));
        clg(res);
        setProfilePicture(res.profilePicture);
      } catch (error) {
        res = {};
        toast.error(
          error.response.data.message || "Fail to upload profile picture"
        );
        // console.log("error is : ", error.response.data.message);
      }
    }
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    const user = userFriendList.filter(
      (friend) => friend._id == responseData.id
    );
    dispatch(setSelectedUsers(user[0]));
  };
  return (
    <div
      className={`w-full h-full overflow-hidden ${className} px-2 py-3 relative `}
    >
      <div className=" flex items-center justify-start gap-3 text-clr-w z-10 top-2 shadow-md bg-[#1d232a] p-2">
        <button
          onClick={() => {
            dispatch(setProfile(null));
            close("home");
          }}
        >
          <MdOutlineClear className="text-2xl hover:bg-[#2a2b2b]" />
        </button>
        <h3 className="text-lg">
          {isMyProfile ? "My Profile" : `${username}'s Profile`}{" "}
        </h3>
      </div>
      <div className="overflow-scroll h-full max-h-full relative">
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
            {isInFirendList && (
              <>
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
              </>
            )}
            {!isInFirendList && (
              <>
                <div className="flex flex-col items-center cursor-pointer justify-center w-full">
                  <MdPersonAddAlt className=" text-green-800 text-3xl font-extrabold" />
                  Add to frined
                </div>
              </>
            )}
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
            <h1 className="text-white my-1 px-1">More information</h1>
            <div className="text-lg flex flex-col gap-2 mt-3 px-3">
              <div>Email : {responseData?.email}</div>
              <div>Gender : {responseData?.gender}</div>
              <div>Friends : {responseData?.friendCount}</div>
              <div>Block Friends : {responseData?.blockCount}</div>
              <div>Favorate Friends : {responseData?.favoriteCount}</div>
            </div>
          </div>
        )}
        {!isMyProfile && isInFirendList && (
          <div className="bg-[#1d232a] p-1 my-1 rounded">
            <h1>Medias </h1>
            <div className="h-40 flex justify-center items-center">
              No Media{" "}
            </div>
          </div>
        )}
        {!isMyProfile && (
          <div className="bg-[#1d232a] p-1 my-1 rounded flex flex-col gap-2 py-3">
            <button className="flex gap-2 items-center">
              <BiBlock className="text-red-500 text-lg" /> Block
            </button>
            <button className="flex gap-2 items-center">
              <MdFavorite className="text-red-500 text-lg" />
              Favorate
            </button>
            <button className="flex gap-2 items-center">
              <MdOutlineReport className="text-red-500 text-lg" />
              Report
            </button>
          </div>
        )}

        {isMyProfile && (
          <>
            <div className="join join-vertical bg-base-100 w-full">
              <div className="collapse collapse-arrow join-item border-base-300 border">
                <input type="radio" name="my-accordion-4" defaultChecked />
                <div className="collapse-title font-semibold">
                  Favorite List
                </div>
                <div className="collapse-content text-sm">
                  No Favorite friends yet
                </div>
              </div>
              <div className="collapse collapse-arrow join-item border-base-300 border">
                <input type="radio" name="my-accordion-4" />
                <div className="collapse-title font-semibold">Block List</div>
                <div className="collapse-content text-sm">
                  No Block friends yet
                </div>
              </div>
            </div>
          </>
        )}
        {isMyProfile && <LogOut />}
        <div className="h-[5%]"></div>
      </div>
    </div>
  );
}

export default Profile;
