import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import {
  PresentToAll,
  CancelPresentation,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import { LocalVideoTrack } from "twilio-video";
import "./LocalParticipant.scss";

const LocalParticipant = ({
  participant,
  room,
  setIsScreenShared,
  isScreenShared,
  screenRef,
}) => {
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

  const stopPresentation = () => {
    setPresentScreen(false);
    setIsScreenShared(false);
    room.localParticipant.unpublishTrack(screenTrack);
    screenTrack.stop();
    setScreenTrack(null);
  };

  return (
    <div className="LocalParticipant" id={participant.identity}>
      <Typography variant="caption" className="LocalParticipant_name">
        {participant.identity.split("-").pop().trim()} (You)
      </Typography>
      <video
        className={
          presentScreen || room.participants.size > 0
            ? "LocalParticipant_VideoSmall"
            : "LocalParticipant_VideoLarge"
        }
        ref={videoRef}
        autoPlay={true}
      />
      <audio ref={audioRef} autoPlay={true} />
      <div className="LocalParticipant_IconsContainer ">
        <div className="LocalParticipant_Icon ">
          {!mute ? (
            <MicOff
              onClick={() => {
                setMute(true);
                room.localParticipant.audioTracks.forEach((publication) => {
                  publication.track.disable();
                });
              }}
            />
          ) : (
            <Mic
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
            <VideocamOff
              onClick={() => {
                setHideVideo(true);
                room.localParticipant.videoTracks.forEach((publication) => {
                  publication.track.disable();
                });
              }}
            />
          ) : (
            <Videocam
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
                if (isScreenShared) {
                  alert("Someone has already sharing their screen.");
                } else {
                  navigator.mediaDevices
                    .getDisplayMedia()
                    .then((stream) => {
                      setPresentScreen(true);
                      const _screenTrack = new LocalVideoTrack(
                        stream.getTracks()[0],
                        {
                          name: "screen-share",
                        }
                      );
                      setIsScreenShared(true);
                      _screenTrack.attach(screenRef.current);
                      setScreenTrack(_screenTrack);
                      room.localParticipant.publishTrack(_screenTrack);
                      _screenTrack.mediaStreamTrack.onended = () => {
                        setPresentScreen(false);
                        setIsScreenShared(false);
                        room.localParticipant.unpublishTrack(_screenTrack);
                        _screenTrack.stop();
                        setScreenTrack(null);
                      };
                    })
                    .catch((error) => {
                      alert("Could not share the screen.");
                    });
                }
              }}
            />
          ) : (
            <CancelPresentation onClick={stopPresentation} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalParticipant;
