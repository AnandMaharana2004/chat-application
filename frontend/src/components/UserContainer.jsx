import React, { useEffect, useState } from "react";
import UserBox from "./UserBox";
import { useDispatch, useSelector } from "react-redux";
import { setUserFavorateList, setUserFriendList } from "../redux/userSlices";
import { getFriendList } from "../api/userApi";

function UserContainer() {
  const dispatch = useDispatch();
  const { authUser, userFriendList } = useSelector((store) => store.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    try {
      (async () => {
        setLoading(true);
        const response = await getFriendList();
        dispatch(setUserFriendList(response.data.data));
        setLoading(false);
      })();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }, [authUser]);

  return (
    <div className="overflow-x-hidden overflow-y-visible flex flex-col gap-1 py-2">
      {loading && (
        <span className="loading loading-spinner loading-lg mx-auto"></span>
      )}
      {error && (
        <h1>
          {error?.message || "Something went wrong while fetching frinds"}
        </h1>
      )}

      {userFriendList?.length > 0 ? (
        <>
          {userFriendList?.map((friend) => {
            return <UserBox key={friend._id} user={friend} />;
          })}
        </>
      ) : (
        <>
          {!loading && (
            <div className="align-middle mx-auto mt-10">
              You don't have any Friends
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserContainer;
