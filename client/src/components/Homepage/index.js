import React, { useState, useEffect } from "react";
import { startRoom } from "./JoinRoom";
import { Button, TextField, CircularProgress } from "@mui/material";

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
          <div className="HomePage_Head">
            <Button
              className="HomePage_SignOutBtn"
              variant="contained"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
          {_roomName ? (
            <CircularProgress color="inherit" />
          ) : (
            <div className="HomePage_From">
              <form
                id="room-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  roomName.length >= 1 &&
                    startRoom(
                      roomName,
                      participantsList,
                      setParticipantList,
                      setRoom,
                      user.displayName
                    );
                }}
              >
                <div>Enter a Room Name to join: </div>
                <TextField
                  name="room_name"
                  size="small"
                  id="room-name-input"
                  variant="outlined"
                  onBlur={(e) => {
                    setRoomName(e.target.value);
                  }}
                />
                <Button
                  className="HomePage_Button"
                  variant="contained"
                  type="submit"
                >
                  Join Room
                </Button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
