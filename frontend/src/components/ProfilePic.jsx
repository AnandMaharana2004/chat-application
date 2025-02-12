import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/userSlices";

function ProfilePic({ user, className = "", url = "" }) {
  const { onlineUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const isOnline = onlineUsers?.includes(user?._id);
  const handleProfileClick = () => {
    dispatch(setProfile(user._id));
  };
  return (
    <div className={`profilePic cursor-pointer `} onClick={handleProfileClick}>
      <div className={`avatar size-12 ${className} ${isOnline ? "online" : ""}`}>
        <div className={`w-24 rounded-full ${className}`}>
          {user && <img src={user?.profilePicture} alt="Profile" />}
          {url && <img src={url} alt="Profile" className={``} />}
        </div>
      </div>
    </div>
  );
}

export default ProfilePic;
