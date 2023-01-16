import React from "react";
import "./ScreenShare.scss";

const ScreenShare = ({ isScreenShared, screenRef }) => {
  return (
    <video
      className={isScreenShared ? "ScreenShare_video" : "ScreenShare_hideVideo"}
      ref={screenRef}
      autoPlay={true}
    />
  );
};

export default ScreenShare;
