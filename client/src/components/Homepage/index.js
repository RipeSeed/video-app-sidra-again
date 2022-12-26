import React, { useState, useEffect } from "react";
import { startRoom } from "./JoinRoom";
import { Button, TextField } from "@mui/material";
import "./HomePage.scss";
import Room from "../Room";

const HomePage = () => {
  const [roomName, setRoomName] = useState("");
  const [participantsList, setParticipantList] = useState([]);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const _roomName = queryParams.get("roomName");
    if (_roomName) {
      setRoomName(_roomName);
      startRoom(_roomName, participantsList, setParticipantList, setRoom);
      window.history.pushState({}, document.title, "/");
    }
  }, []);
  return (
    <div className={room ? "HomePage" : "HomePage HomePage_From"}>
      {room ? (
        <Room
          roomName={roomName}
          localParticipant={room.localParticipant}
          participantList={participantsList}
          room={room}
        />
      ) : (
        <form
          id="room-form"
          onSubmit={(e) => {
            e.preventDefault();
            startRoom(roomName, participantsList, setParticipantList, setRoom);
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
          <Button className="HomePage_Button" variant="contained" type="submit">
            Join Room
          </Button>
        </form>
      )}
    </div>
  );
};

export default HomePage;
