import React, { useState, useEffect, useRef } from "react";
import styles from "./AvatarNewsVideo.module.css";
import {
  createPeerConnection,  
  stopAllStreams,
  closePC,
  fetchWithRetries,
} from "../../services/WebRTC";
import { useLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

import loadingVideo from "./loading_circle_bars.mp4";
import demoData from "../../data/db.json";
import {
  getWebRTCState,
  setStreamId,
  setSessionId,
  setSessionClientAnswer,
  setGlobalVideoElement
} from "../../services/WebRTCState";

const AvatarNewsVideo = () => {
  const article = useLoaderData();

  const videoRef = useRef();
  const [isFirstPlay, setIsFirstPlay] = useState(true);


  useEffect(() => {
    if (videoRef.current) {
      setGlobalVideoElement(videoRef.current);
    }
    
    const { globalVideoElement } = getWebRTCState();

    const playListener = async () => {
      const { peerConnection, streamId, sessionId, sessionClientAnswer} =
        getWebRTCState();

      if (isFirstPlay) {
        globalVideoElement
          .play()
          .catch((e) => console.error("Error playing the video:", e));

        if (peerConnection && peerConnection.connectionState === "connected") {
          return;
        }

        stopAllStreams();
        closePC();

        const sessionResponse = await fetchWithRetries(
          "http://localhost:3001/api/talks/streams",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              source_url:
                "https://create-images-results.d-id.com/google-oauth2%7C113228135334831093217/upl_EEY93HJXprfY-QhMSFjcv/image.png",
            }),
          }
        );

        const {
          id: newStreamId,
          offer,
          ice_servers: iceServers,
          session_id: newSessionId,
        } = await sessionResponse.json();
        setStreamId(newStreamId);
        setSessionId(newSessionId);

        try {
          const newSessionClientAnswer = await createPeerConnection(
            offer,
            iceServers
          );
          setSessionClientAnswer(newSessionClientAnswer);
        } catch (e) {
          console.log("error during streaming setup", e);
          stopAllStreams();
          closePC();
          return;
        }

        await fetchWithRetries("http://localhost:3001/api/talks/streams/sdp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            streamId: newStreamId,
            answer: sessionClientAnswer,
            sessionId: newSessionId,
          }),
        });

        if (
          peerConnection?.signalingState === "stable" ||
          peerConnection?.iceConnectionState === "connected"
        ) {
          await fetchWithRetries(
            "http://localhost:3001/api/talks/streams/talk",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                streamId: streamId,
                sessionId: sessionId,
              }),
            }
          );
        }

        setIsFirstPlay(false);
      }
    };

    globalVideoElement.addEventListener("play", playListener);

    //The listener for the canplay event is designed to ensure that the loadingVideo starts playing only after the file is fully loaded. This listener initiates playback only after isFirstPlay becomes false, which occurs after the first press on "Play" and changing the video source.
    const canPlayListener = () => {
      if (!isFirstPlay) {
        globalVideoElement.play();
      }
    };

    globalVideoElement.addEventListener("canplay", canPlayListener);

    return () => {
      globalVideoElement.removeEventListener("play", playListener);
      globalVideoElement.removeEventListener("canplay", canPlayListener);
    };
  }, [isFirstPlay]);

  return (
    <div className={styles.avatarNewsVideoContainer}>
      <div className={styles.videoWrapper}>
        <video ref={videoRef} controls>
          <source src={loadingVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h2>
          <FontAwesomeIcon icon={faVideo} /> {article.title}
        </h2>
      </div>
    </div>
  );
};

export function avatarNewsVideoLoader({ params }) {
  const articleId = params.id;
  const article = demoData.articles.find(
    (article) => article.article_id === articleId
  );
  return article;
}

export default AvatarNewsVideo;
