import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import "./Participant.scss";

const Participant = ({
  participant,
  room,
  setIsScreenShared,
  isScreenShared,
  screenRef,
}) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        track.name === "screen-share" && setIsScreenShared(false);
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    videoTracks.forEach((track) => {
      if (track.name === "screen-share") {
        setIsScreenShared(true);
        track.attach(screenRef.current);
      } else {
        track.attach(videoRef.current);
      }
    });

    // return () => {
    //   videoTrack.detach();
    //   screenTrack.detach();
    // };
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="Participant" id={participant.identity}>
      <Typography variant="caption" className="Participant_name">
        {participant.identity.split("-").pop().trim()}
      </Typography>
      <video
        className={
          isScreenShared
            ? "Participant_video Participant_videoSmallest"
            : room.participants.size <= 2
            ? "Participant_video Participant_videoLarge"
            : "Participant_video Participant_videoSmall"
        }
        ref={videoRef}
        autoPlay={true}
      />
      <audio ref={audioRef} autoPlay={true} />
    </div>
  );
};

export default Participant;
