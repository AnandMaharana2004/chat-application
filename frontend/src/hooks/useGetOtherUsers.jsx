import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlices";

function useGetOtherUsers() {
  const dispatch = useDispatch();
  useEffect(() => {
    const otherUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/user/getOtherUsers`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        dispatch(setOtherUsers(res.data?.data));
      } catch (error) {
        console.log(error);
      }
    };
    otherUsers();
  }, []);
}

export default useGetOtherUsers;
