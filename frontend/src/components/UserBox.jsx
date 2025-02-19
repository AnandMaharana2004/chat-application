import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUsers } from "../redux/userSlices";
import { addToFriend } from "../api/userApi";
import toast from "react-hot-toast";
import ProfilePic from "./ProfilePic";
import { setCode } from "../redux/codeSlice";

function UserBox({ user, fromExplore = false, fromAi = false }) {
  const dispatch = useDispatch();
  const { selectedUser, authUser, userFriendList } = useSelector(
    (store) => store.user
  );

  const isFriend = userFriendList.some((friend) => friend._id === user?._id);

  const [loading, setLoading] = useState(false);

  const handleClick = (e) => {
    if (fromAi) return;
    e.preventDefault();
    if (!fromExplore && selectedUser?._id !== authUser?._id) {
      dispatch(setSelectedUsers(user));
      dispatch(setCode(null));
    }
  };

  const handleAddToFriend = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const response = await addToFriend(user._id);
      toast.success(
        response?.data?.data?.message || "Friend added successfully!"
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAiClick = (e) => {
    if(!fromAi) return
    e.preventDefault();
    console.log("click ot ai");
    dispatch(setCode("//how are you miss"))
    dispatch(setSelectedUsers(null))
  };

  return (
    <div
      onClick={ handleAiClick}
      className={`flex gap-3 items-center px-2 p-2 rounded-sm ${
        !fromAi && user?._id === selectedUser?._id ? "bg-zinc-900" : ""
      } ${fromAi && "cursor-pointer"}`}
    >
      {!fromAi && <ProfilePic user={user} />}
      {fromAi && (
        <div
          className="text-white px-2 py-1 rounded text-xl align-middle font-bold bg-yellow-600 
      "
        >
          Js
        </div>
      )}

      {/* User Info */}
      <div className="flex flex-1 flex-col" onClick={handleClick}>
        <div className="name text-lg font-semibold">
          {user?.username || (fromAi && "javascript")}
        </div>
        {!fromExplore ||
          (fromAi && (
            <div className="text-sm font-sm text-zinc-400">Last message</div>
          ))}
      </div>

      {/* Add Friend Button (Only in Explore) */}
      {fromExplore && !isFriend && !fromAi && (
        <button
          onClick={handleAddToFriend}
          disabled={loading || isFriend}
          className={`bg-blue-800 text-white px-5 p-2 absolute right-5 align-middle rounded ${
            isFriend ? "bg-green-500" : ""
          }`}
        >
          {isFriend
            ? "Already Friend"
            : loading
            ? "Adding..."
            : "Add to Friend"}
        </button>
      )}
      {/* {fromAi && <button>this is from ai</button>} */}
    </div>
  );
}

export default UserBox;
