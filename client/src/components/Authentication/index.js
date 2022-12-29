import React, { useEffect } from "react";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import firebase from "firebase/compat/app";
import "./Authentication.scss";

const Authentication = ({ auth }) => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomName = queryParams.get("roomName");
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start(".firbase-auth-container", {
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
      ],
      signInSuccessUrl: roomName ? `/?roomName=${roomName}` : "/",
    });
  }, [auth]);
  return (
    <div className="Authentication">
      <div className={"firbase-auth-container"}></div>
    </div>
  );
};

export default Authentication;
