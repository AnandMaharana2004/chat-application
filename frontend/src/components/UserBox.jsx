import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile, setSelectedUsers } from "../redux/userSlices";
import { addToFriend } from "../api/userApi";
import toast from "react-hot-toast";
import ProfilePic from "./ProfilePic";

function UserBox({ user, fromExplore = false }) {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers, authUser, userFriendList } = useSelector(
    (store) => store.user
  );

  const isOnline = onlineUsers?.includes(user?._id);
  const isFriend = userFriendList.some((friend) => friend._id === user._id);

  const [loading, setLoading] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (!fromExplore && selectedUser?._id !== authUser?._id) {
      dispatch(setSelectedUsers(user));
    }
  };

  const handleAddToFriend = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const response = await addToFriend(user._id);
      toast.success(response?.data?.data?.message || "Friend added successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    dispatch(setProfile(user._id));
  };

  return (
    <div
      className={`flex gap-3 items-center px-2 p-2 rounded-sm ${
        user?._id === selectedUser?._id ? "bg-zinc-900" : ""
      }`}
    >
      {/* Profile Picture */}
      {/* <div className="profilePic" onClick={handleProfileClick}>
        <div className={`avatar size-12 ${isOnline ? "online" : ""}`}>
          <div className="w-24 rounded-full">
            <img src={user?.profilePicture} alt="Profile" />
          </div>
        </div>
      </div> */}
      <ProfilePic user={user} />

      {/* User Info */}
      <div className="flex flex-1 flex-col" onClick={handleClick}>
        <div className="name text-lg font-semibold">{user?.username || "Username"}</div>
        {!fromExplore && <div className="text-sm font-sm text-zinc-400">Last message</div>}
      </div>

      {/* Add Friend Button (Only in Explore) */}
      {fromExplore && (
        <button
          onClick={handleAddToFriend}
          disabled={loading || isFriend}
          className={`bg-blue-800 text-white px-5 p-2 absolute right-5 align-middle rounded ${
            isFriend ? "bg-green-500" : ""
          }`}
        >
          {isFriend ? "Already Friend" : loading ? "Adding..." : "Add to Friend"}
        </button>
      )}
    </div>
  );
}

export default UserBox;
