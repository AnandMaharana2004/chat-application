import React, { useState } from "react";
import {
  MdCall,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVolumeUp,
  MdVolumeOff,
  MdPerson,
} from "react-icons/md";

function AudioCall() {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [profilePic, setProfilePic] = useState(null);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="text-center text-lg font-medium">Audio Call</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
        {/* Profile Picture */}
        <div className="relative">
          {profilePic ? (
            <img
              src={profilePic || "/placeholder.svg"}
              alt="User"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <MdPerson size={64} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Username */}
        <h2 className="text-xl font-semibold">User_name</h2>
        <p className="text-gray-500">00:00</p>
      </div>

      {/* Call Controls */}
      <div className="bg-white p-6">
        <div className="flex justify-center items-center space-x-6">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full ${
              isMuted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
            } hover:scale-105 active:scale-95 transition-transform`}
          >
            {isMuted ? <MdMicOff size={24} /> : <MdMic size={24} />}
          </button>

          {/* End Call Button */}
          <button className="p-4 rounded-full bg-red-500 text-white hover:scale-105 active:scale-95 transition-transform">
            <MdCall size={24} />
          </button>

          {/* Switch to Video Button */}
          <button className="p-4 rounded-full bg-gray-100 text-gray-600 hover:scale-105 active:scale-95 transition-transform">
            <MdVideocam size={24} />
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-4 rounded-full ${
              isSpeakerOn
                ? "bg-gray-100 text-gray-600"
                : "bg-gray-200 text-gray-400"
            } hover:scale-105 active:scale-95 transition-transform`}
          >
            {isSpeakerOn ? <MdVolumeUp size={24} /> : <MdVolumeOff size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AudioCall;
