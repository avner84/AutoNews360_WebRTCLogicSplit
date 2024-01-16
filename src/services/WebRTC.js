import { getWebRTCState, setPeerConnection, setSessionClientAnswer } from "./WebRTCState";

const RTCPeerConnection = (
  window.RTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection
).bind(window);

let statsIntervalId;
let videoIsPlaying;
let lastBytesReceived;



export const createPeerConnection = async (offer, iceServers) => {
    let { peerConnection } = getWebRTCState();
  
    if (!peerConnection) {
      peerConnection = new RTCPeerConnection({ iceServers });
  
      peerConnection.addEventListener("icecandidate", onIceCandidate, true);
      peerConnection.addEventListener(
        "iceconnectionstatechange",
        onIceConnectionStateChange,
        true
      );
      peerConnection.addEventListener("track", onTrack, true);
  
      setPeerConnection(peerConnection); // עדכון המצב הגלובלי
    }
  
    await peerConnection.setRemoteDescription(offer);
    console.log("set remote sdp OK");
  
    const sessionClientAnswer = await peerConnection.createAnswer();
    console.log("create local sdp OK");
  
    await peerConnection.setLocalDescription(sessionClientAnswer);
    console.log("set local sdp OK");
  
    // return sessionClientAnswer;
    setSessionClientAnswer(sessionClientAnswer);
  };



export function onIceCandidate(event) {
    let { streamId, sessionId } = getWebRTCState();
  console.log("onIceCandidate", event);
  if (event.candidate) {
    const { candidate, sdpMid, sdpMLineIndex } = event.candidate;

    fetchWithRetries("http://localhost:3001/api/talks/streams/ice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        streamId: streamId,
        candidate: candidate,
        sdpMid: sdpMid,
        sdpMLineIndex: sdpMLineIndex,
        sessionId: sessionId,
      }),
    });
  }
}

export function onIceConnectionStateChange() {
    const { peerConnection } = getWebRTCState();
  if (
    peerConnection.iceConnectionState === "failed" ||
    peerConnection.iceConnectionState === "closed"
  ) {
    stopAllStreams();
    closePC();
  }
}

export function onVideoStatusChange(videoIsPlaying, stream) {
  if (videoIsPlaying) {
    const remoteStream = stream;
    setVideoElement(remoteStream);
  }
}

export function onTrack(event) {
    const { peerConnection } = getWebRTCState();
  if (!event.track) return;

  statsIntervalId = setInterval(async () => {
    const stats = await peerConnection.getStats(event.track);
    stats.forEach((report) => {
      if (report.type === "inbound-rtp" && report.mediaType === "video") {
        const videoStatusChanged =
          videoIsPlaying !== report.bytesReceived > lastBytesReceived;

        if (videoStatusChanged) {
          videoIsPlaying = report.bytesReceived > lastBytesReceived;
          onVideoStatusChange(videoIsPlaying, event.streams[0]);
        }
        lastBytesReceived = report.bytesReceived;
      }
    });
  }, 500);
}

export function setVideoElement(stream) {
  const {globalVideoElement} = getWebRTCState();
  
  if (!stream || !globalVideoElement) return;

  globalVideoElement.srcObject = stream;
  globalVideoElement.loop = false;

  // Try to play the video
  globalVideoElement.play().catch((e) => console.error("Error playing video", e));
}

export function stopAllStreams() {
    const { globalVideoElement } = getWebRTCState();
  
    if (globalVideoElement && globalVideoElement.srcObject) {
      console.log("stopping video streams");
      globalVideoElement.srcObject.getTracks().forEach((track) => track.stop());
      globalVideoElement.srcObject = null;
    }
  }



export function closePC() {
  let { peerConnection } = getWebRTCState();

  if (!peerConnection) return;
  console.log("stopping peer connection");

  peerConnection.close();
  peerConnection.removeEventListener("icecandidate", onIceCandidate, true);
  peerConnection.removeEventListener("iceconnectionstatechange", onIceConnectionStateChange, true);
  clearInterval(statsIntervalId);

  console.log("stopped peer connection");

  setPeerConnection(null); 
}


const maxRetryCount = 3;
const maxDelaySec = 4;

export async function fetchWithRetries(url, options, retries = 1) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries <= maxRetryCount) {
      const delay =
        Math.min(Math.pow(2, retries) / 4 + Math.random(), maxDelaySec) * 1000;

      await new Promise((resolve) => setTimeout(resolve, delay));

      console.log(
        `Request failed, retrying ${retries}/${maxRetryCount}. Error ${err}`
      );
      return fetchWithRetries(url, options, retries + 1);
    } else {
      throw new Error(`Max retries exceeded. error: ${err}`);
    }
  }
}
