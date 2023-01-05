import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { PresentToAll, CancelPresentation } from "@mui/icons-material";
import { LocalVideoTrack } from "twilio-video";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophoneSlash,
  faMicrophone,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import "./LocalParticipant.scss";

const LocalParticipant = ({ participant, room }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [mute, setMute] = useState(false);
  const [hideVideo, setHideVideo] = useState(false);
  const [presentScreen, setPresentScreen] = useState(false);
  const [screenTrack, setScreenTrack] = useState();

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
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
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
    <div className="LocalParticipant" id={participant.identity}>
      <Typography variant="caption">
        {participant.identity.split("-").pop().trim()} (You)
      </Typography>
      <video
        className={
          room.participants.size === 0
            ? "LocalParticipant_VideoLarge"
            : "LocalParticipant_VideoSmall"
        }
        ref={videoRef}
        autoPlay={true}
      />
      <audio ref={audioRef} autoPlay={true} />
      <div className="LocalParticipant_IconsContainer ">
        <div className="LocalParticipant_Icon ">
          {!mute ? (
            <FontAwesomeIcon
              icon={faMicrophoneSlash}
              onClick={() => {
                setMute(true);
                room.localParticipant.audioTracks.forEach((publication) => {
                  publication.track.disable();
                });
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faMicrophone}
              onClick={() => {
                setMute(false);
                room.localParticipant.audioTracks.forEach((publication) => {
                  publication.track.enable();
                });
              }}
            />
          )}
        </div>

        <div className="LocalParticipant_Icon ">
          {!hideVideo ? (
            <FontAwesomeIcon
              icon={faVideoSlash}
              onClick={() => {
                setHideVideo(true);
                room.localParticipant.videoTracks.forEach((publication) => {
                  publication.track.disable();
                });
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faVideo}
              onClick={() => {
                setHideVideo(false);
                room.localParticipant.videoTracks.forEach((publication) => {
                  publication.track.enable();
                });
              }}
            />
          )}
        </div>
        <div className="LocalParticipant_Icon ">
          {!presentScreen ? (
            <PresentToAll
              onClick={() => {
                setPresentScreen(true);
                navigator.mediaDevices
                  .getDisplayMedia()
                  .then((stream) => {
                    console.log("screen track", stream.getTracks()[0]);
                    const _screenTrack = new LocalVideoTrack(
                      stream.getTracks()[0],
                      {
                        name: "screen-share",
                      }
                    );
                    setScreenTrack(_screenTrack);
                    room.localParticipant.publishTrack(_screenTrack);
                  })
                  .catch((error) => {
                    console.log("error", error);
                    alert("Could not share the screen.");
                  });
              }}
            />
          ) : (
            <CancelPresentation
              onClick={() => {
                setPresentScreen(false);
                room.localParticipant.unpublishTrack(screenTrack);
                screenTrack.stop();
                setScreenTrack(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalParticipant;
