import React from 'react';
import PropTypes from 'prop-types';

function ProfileCircle({
  profilePicUrl,
  isOnline = false,
  isClickable = false,
  onClickFunction
}) {
  return (
    <div
      className={`profilePic ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={isClickable ? onClickFunction : undefined}
      tabIndex={isClickable ? 0 : -1}
      role={isClickable ? 'button' : undefined}
    >
      <div className={`avatar size-12 ${isOnline ? 'online' : ''}`}>
        <div className="w-24 rounded-full">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt="User Profile"
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <div className="bg-gray-300 w-full h-full rounded-full flex items-center justify-center">
              <span className="text-gray-500">N/A</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ProfileCircle.propTypes = {
  profilePicUrl: PropTypes.string,
  isOnline: PropTypes.bool,
  isClickable: PropTypes.bool,
  onClickFunction: PropTypes.func
};

export default ProfileCircle;
