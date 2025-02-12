import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers } from "./redux/userSlices";
import { setSocket } from "./redux/socketSlices";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<Home />} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  // const {socket} = useSelector((store)=>store.socket)
  const { authUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const dispathc = useDispatch();
  useEffect(() => {
    if (!authUser) {
      if (socket) {
        socket.close();
        dispathc(setSocket(null));
      }
      return;
    }
    const server = io("http://localhost:3000", {
      query: {
        userId: authUser._id,
      },
    });
    dispathc(setSocket(server));
    server.on("onlineUsersList", (data) => {
      dispathc(setOnlineUsers(data));
    });

    return () => {
      socket?.close();
    };
  }, [authUser]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

// design the routing here
