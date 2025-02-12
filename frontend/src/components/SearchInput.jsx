import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchUsers } from "../redux/userSlices";
import UserBox from "./UserBox";

const SearchInput = () => {
  const [searchText, setSearchText] = useState("");
  const { otherUsers, searchUsers, selectedUser } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  // Debounce Function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Filter Users Logic
  const filterUsers = useCallback(
    debounce((text) => {
      if (text === "") {
        dispatch(setSearchUsers([])); // Reset if no input
        return;
      }

      const filtered = otherUsers?.filter((user) =>
        user?.fullName?.toLowerCase().includes(text.toLowerCase())
      );
      dispatch(setSearchUsers(filtered || []));
    }, 300), // 300ms delay
    [otherUsers, dispatch]
  );

  useEffect(() => {
    filterUsers(searchText);
  }, [searchText, filterUsers]);
  const onInputChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="relative">
      <div>
        <input
          type="text"
          placeholder="Search"
          className="bg-black text-white px-2 p-1"
          value={searchText}
          onChange={onInputChange}
        />
        <button type="submit">Search</button>
      </div>
      <div
        className={`userList bg-black/80 shadow-lg ring-1 ring-black/5 h-[420px] absolute top-9 left-0 z-10 w-full flex flex-col gap-1 ${
          searchText === "" ? "hidden" : "flex"
        }`}
      >
        {searchUsers?.length === 0 ? (
          <h1>No users found</h1>
        ) : (
          searchUsers?.map((user) => <UserBox key={user.id} user={user} />)
        )}
      </div>
    </div>
  );
};

export default SearchInput;
