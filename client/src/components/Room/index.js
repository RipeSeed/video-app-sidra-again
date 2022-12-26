import React from "react";
import Participant from "../Participant";
import { Typography, Button } from "@mui/material";
import LocalParticipant from "../LocalParticipant";
import "./Room.scss";

const Room = ({ roomName, localParticipant, participantList, room }) => {
  const remoteParticipants = participantList.map((participant) => (
    <Participant key={participant.sid} participant={participant} room={room} />
  ));
  function getPathFromUrl(url) {
    return url.split(/[?#]/)[0];
  }

  return (
    <div className="Room">
      <div className="Room_Header">
        <Typography variant="h3">Room: {roomName}</Typography>
        <Button
          variant="contained"
          className="Room_CopyLink"
          onClick={() =>
            navigator.clipboard.writeText(
              `${getPathFromUrl(window.location.href)}?roomName=${roomName}`
            )
          }
        >
          Copy Link
        </Button>
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
