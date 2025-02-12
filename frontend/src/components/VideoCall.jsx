import React, { useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaCamera,
  FaCameraRotate,
  FaPhoneSlash,
} from "react-icons/fa6";

export default function VideoCall() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Main video container */}
      <div className="relative flex-1 bg-muted">
        {/* User info */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium">user_Name</span>
        </div>

        {/* Client's video (small) */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-[200px] h-[150px] bg-gray-200 rounded-lg overflow-hidden">
            {!isVideoOff ? (
              <video
                className="w-full h-full object-cover rounded-lg"
                src="/placeholder.mp4"
                autoPlay
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaVideoSlash className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Friend's video (large) */}
        <div className="w-full h-full">
          {!isCameraOff ? (
            <video
              className="w-full h-full object-cover"
              src="/placeholder.mp4"
              autoPlay
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaVideoSlash className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-200">
        <div className="flex justify-center gap-4">
          <button
            className="rounded-full h-12 w-12 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <FaMicrophoneSlash className="h-5 w-5 mx-auto" />
            ) : (
              <FaMicrophone className="h-5 w-5 mx-auto" />
            )}
          </button>
          <button
            className="rounded-full h-12 w-12 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsCameraOff(!isCameraOff)}
          >
            {isCameraOff ? (
              <FaVideoSlash className="h-5 w-5 mx-auto" />
            ) : (
              <FaVideo className="h-5 w-5 mx-auto" />
            )}
          </button>
          <button
            className="rounded-full h-12 w-12 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? (
              <FaVideoSlash className="h-5 w-5 mx-auto" />
            ) : (
              <FaCamera className="h-5 w-5 mx-auto" />
            )}
          </button>
          <button className="rounded-full h-12 w-12 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FaCameraRotate className="h-5 w-5 mx-auto" />
          </button>
          <button className="rounded-full h-12 w-12 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <FaPhoneSlash className="h-5 w-5 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
