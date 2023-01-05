import React from "react";
import { v4 as uuidv4 } from "uuid";
import firbaseApp from "../../base";
import { ReactComponent as VideoChat } from "../../images/video-chat.svg";
import { Grid, Typography, TextField, Button } from "@mui/material";
import "./Lobby.scss";

const Lobby = ({
  roomName,
  setRoomName,
  participantsList,
  setParticipantList,
  setRoom,
  user,
  startRoom,
}) => {
  return (
    <Grid item container xs={12} className="Lobby">
      <Grid
        item
        xs={12}
        container
        justifyContent="space-between"
        alignItems="flex-start"
        className="Lobby_Header"
      >
        <Grid item container xs={10}>
          <VideoChat className="Lobby_HeaderIcon" />
          <Typography className="Lobby_Title" variant="h6">
            Video Conference
          </Typography>
        </Grid>
        <Button
          className="Lobby_SignOutBtn"
          variant="contained"
          onClick={() => {
            firbaseApp.auth().signOut();
          }}
        >
          Sign Out
        </Button>
      </Grid>
      <Grid
        item
        container
        xs={6}
        className="Lobby_FirstHalf"
        alignItems="center"
        justifyContent="start"
      >
        <Typography variant="h3">
          Secure video conferencing for everyone
        </Typography>
        <Typography className="Lobby_SubText" variant="h6">
          Connect, collaborate, and celebrate from anywhere with us.
        </Typography>
        <Grid
          item
          container
          direction="column"
          className="Lobby_JoinRoomContainer"
        >
          <Button
            className="Lobby_StartRoomBtn"
            variant="contained"
            onClick={() => {
              const roomUuid = uuidv4();
              setRoomName(roomUuid);
              startRoom(
                roomUuid,
                participantsList,
                setParticipantList,
                setRoom,
                user.displayName
              );
            }}
          >
            Start a Room
          </Button>
          <form
            id="room-form"
            className="Lobby_Form"
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
            <TextField
              name="room_name"
              size="small"
              id="room-name-input"
              variant="outlined"
              placeholder="Enter the code"
              onBlur={(e) => {
                setRoomName(e.target.value);
              }}
            />
            <Button
              className="Lobby_JoinRoomBtn"
              variant="contained"
              type="submit"
            >
              Join Room
            </Button>
          </form>
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={6}
        alignItems="center"
        justifyContent="flex-start"
        direction="column"
      >
        <VideoChat className="Lobby_VideoSVG" />
        <Typography variant="h6">Your meeting is safe</Typography>
        <Typography variant="body">
          No one can join the Room unless they have the uuid of this room
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Lobby;
