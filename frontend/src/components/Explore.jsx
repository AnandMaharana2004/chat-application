import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import UserBox from "./UserBox";
import { explore } from "../api/userApi";
import { setOtherUsers } from "../redux/userSlices";
import { useDispatch, useSelector } from "react-redux";

function Explore({ callback }) {
  const dispatch = useDispatch()
  const { otherUsers, authUser } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!authUser) return;
    ;(async () => {
      try {
        const response = await explore()
        dispatch(setOtherUsers(response?.data?.data || []))
        loading(false)
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    })();

    return(()=>{
      dispatch(setOtherUsers(null))
    })
  },[authUser]);
  return (
    <div className="relative">
      <div className=" flex items-center gap-3 py-1 px-3 text-xl text-white sticky top-0">
        <button onClick={() => callback()}>
          <IoArrowBackSharp />
        </button>
        <div className="">Explore More Friends</div>
      </div>
      <div className=" py-2 p-1 flex flex-col gap-1 ">
        {loading && (
          <span className="loading loading-spinner loading-lg mx-auto my-4"></span>
        )}
        {!loading &&
          <>
           {otherUsers?.map((friend, index)=>{
            return  <UserBox user={friend} key={index} fromExplore={true}/>
           })}
          </>
        }
      </div>
    </div>
  );
}

export default Explore;
