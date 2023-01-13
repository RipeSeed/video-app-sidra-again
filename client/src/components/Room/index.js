import React, { useState, useRef, useEffect } from "react";
import Participant from "../Participant";
import { Typography, Button, Grid } from "@mui/material";
import ScreenShare from "../ScreenShare";
import LocalParticipant from "../LocalParticipant";
import "./Room.scss";

const Room = ({
  roomName,
  localParticipant,
  participantList,
  setRoom,
  room,
}) => {
  const [isScreenShared, setIsScreenShared] = useState(false);
  const screenRef = useRef();

  const remoteParticipants = participantList.map((participant) => (
    <Participant
      key={participant.sid}
      participant={participant}
      room={room}
      setIsScreenShared={setIsScreenShared}
      isScreenShared={isScreenShared}
      screenRef={screenRef}
    />
  ));

  useEffect(() => {
    participantList.forEach((participant) => {
      participant.videoTracks.forEach((track) => {
        if (track.trackName === "screen-share") {
          setIsScreenShared(true);
        }
      });
    });
  }, [participantList]);

  function getPathFromUrl(url) {
    return url.split(/[?#]/)[0];
  }

  const handleLeaveRoom = () => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
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
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </div>
      </div>
      <Grid
        item
        container
        className={
          isScreenShared
            ? "Room_RemoteParticipants Room_sideBar"
            : "Room_RemoteParticipants"
        }
      >
        {remoteParticipants}
      </Grid>
      <ScreenShare isScreenShared={isScreenShared} screenRef={screenRef} />
      <div
        className={
          isScreenShared || room.participants.size > 0
            ? "Room_LocalParticipant"
            : ""
        }
      >
        <LocalParticipant
          participant={localParticipant}
          room={room}
          setIsScreenShared={setIsScreenShared}
          isScreenShared={isScreenShared}
          screenRef={screenRef}
        />
      </div>
    </div>
  );
};

export default Room;
