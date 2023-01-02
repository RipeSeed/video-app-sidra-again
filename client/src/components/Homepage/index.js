import React, { useState, useEffect } from "react";
import { startRoom } from "./JoinRoom";
import Lobby from "../Lobby";
import { CircularProgress } from "@mui/material";

import "./HomePage.scss";
import Room from "../Room";

const HomePage = ({ signOut, user }) => {
  const [roomName, setRoomName] = useState("");
  const [participantsList, setParticipantList] = useState([]);
  const [room, setRoom] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const _roomName = queryParams.get("roomName");
  useEffect(() => {
    if (_roomName) {
      setRoomName(_roomName);
      startRoom(
        _roomName,
        participantsList,
        setParticipantList,
        setRoom,
        user.displayName
      );
      window.history.pushState({}, document.title, "/");
    }
  }, []);
  return (
    <div className="HomePage">
      {room ? (
        <Room
          roomName={roomName}
          localParticipant={room.localParticipant}
          participantList={participantsList}
          setRoom={setRoom}
          room={room}
          signOut={signOut}
        />
      ) : (
        <div className="HomePage_Lobby">
          {_roomName ? (
            <CircularProgress color="inherit" />
          ) : (
            <Lobby
              roomName={roomName}
              setRoomName={setRoomName}
              participantsList={participantsList}
              setParticipantList={setParticipantList}
              setRoom={setRoom}
              user={user}
              startRoom={startRoom}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
