import React, { useEffect } from "react";
import Participant from "../Participant";
import { Typography, Button } from "@mui/material";
import LocalParticipant from "../LocalParticipant";
import "./Room.scss";

const Room = ({
  roomName,
  localParticipant,
  participantList,
  setRoom,
  room,
  signOut,
}) => {
  const remoteParticipants = participantList.map((participant) => (
    <Participant key={participant.sid} participant={participant} room={room} />
  ));
  function getPathFromUrl(url) {
    return url.split(/[?#]/)[0];
  }

  useEffect(() => {
    console.log(room);
  }, [room]);

  const handleSignOut = () => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
    signOut();
  };

  return (
    <div className="Room">
      <div className="Room_Header">
        <Typography variant="h6">Room-ID: {roomName}</Typography>
        <div>
          <Button
            variant="contained"
            className="Room_Btn"
            onClick={() =>
              navigator.clipboard.writeText(
                `${getPathFromUrl(window.location.href)}?roomName=${roomName}`
              )
            }
          >
            Copy Link
          </Button>
          <Button
            variant="contained"
            className="Room_Btn"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
      <div className="Room_RemoteParticipants">{remoteParticipants}</div>
      <div
        className={room.participants.size === 0 ? "" : "Room_LocalParticipant"}
      >
        <LocalParticipant
          key={localParticipant.sid}
          participant={localParticipant}
          localParticipant={true}
          room={room}
        />
      </div>
    </div>
  );
};

export default Room;
