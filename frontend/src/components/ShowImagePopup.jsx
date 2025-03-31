import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedImage } from "../redux/userSlices";

function ShowImagePopup() {
  const dispatch = useDispatch();
  const { selectedImage } = useSelector((state) => state.user);

  const handleCloseImageWindow = () => {
    dispatch(setSelectedImage(""));
  };
  return (
    <div className="h-full bg-transparent  z-50 relative">
      <div className="flex justify-between px-5 py-2">
        <div>image url.jpeg</div>
        <button onClick={handleCloseImageWindow} className="text-lg font-bold hover:text-gray-500">X</button>
      </div>
      <div className="imageDiv my-20 flex justify-center px-">
        <img src={selectedImage} alt="not found" className="max-h-[500px]" />
      </div>
    </div>
  );
}

export default ShowImagePopup;
