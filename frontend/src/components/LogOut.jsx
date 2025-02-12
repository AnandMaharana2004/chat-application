import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMessages } from "../redux/messageSlices";
import {
  setAuthUser,
  setOnlineUsers,
  setOtherUsers,
  setSelectedUsers,
} from "../redux/userSlices";
import { useAxiosCall } from "../hooks/useAxiosCall";
import { logout } from "../api/authApi";
import toast from "react-hot-toast";

function LogOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, fetchData } = useAxiosCall();
  function allClear() {
    dispatch(setAuthUser(null));
    dispatch(setOnlineUsers(null));
    dispatch(setSelectedUsers(null));
    dispatch(setOtherUsers(null));
    dispatch(setMessages([]));
  }

  const logoutHandler = async (e) => {
    // e.preventDefault();
    const data = await fetchData(() => logout());
    console.log("logout data is : ", data);
    if (!data) {
      allClear();
      toast.success("logout successfuly !!");
      // also reomove from local storage
      navigate("/login");
    }
  };
  {
    error && toast.error(error?.message || "logOut :: someting went wrong !!");
  }
  return (
    <button
      className=" bg-red-500 px-2 py-1 rounded-sm text-white text-md w-full"
      onClick={logoutHandler}
    >
      {loading ? "Loading..." : "logout"}
    </button>
  );
}

export default LogOut;
