import { connect } from "twilio-video";
import axios from "axios";

const startRoom = async (
  roomName,
  participantList,
  setParticipantList,
  setRoom,
  userName,
  setLoader
) => {
  // fetch an Access Token from the join-room route
  const response = await axios.post("http://localhost:5000/join-room", {
    roomName: roomName,
    userName: userName,
  });
  const token = response.data.token;

  // join the video room with the token
  const room = await joinVideoRoom(roomName, token);
  setRoom(room);
  setLoader(false);
  // render the local and remote participants' video and audio tracks
  let remoteParticipantList = [];
  room.participants.forEach((participant) => {
    remoteParticipantList = [...remoteParticipantList, participant];
  });
  setParticipantList(remoteParticipantList);
  room.on("participantConnected", (participant) => {
    setParticipantList((prevParticipants) => [
      ...prevParticipants,
      participant,
    ]);
  });

  // handle cleanup when a participant disconnects
  room.on("participantDisconnected", (participant) => {
    participant.removeAllListeners();
    setParticipantList((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  });
  // room.on("participantDisconnected", handleDisconnectedParticipant);
  window.addEventListener("pagehide", () => room.disconnect());
  window.addEventListener("beforeunload", () => room.disconnect());
};

const joinVideoRoom = async (roomName, token) => {
  // join the video room with the Access Token and the given room name
  const room = await connect(token, {
    room: roomName,
  });
  return room;
};

export { startRoom };
