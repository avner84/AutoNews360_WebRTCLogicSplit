let peerConnection = null;
let streamId = null;
let sessionId = null;
let sessionClientAnswer = null;
let globalVideoElement = null;

export function getWebRTCState() {
  return { peerConnection, streamId, sessionId, sessionClientAnswer, globalVideoElement  };
}

export function setPeerConnection(newPeerConnection) {
  peerConnection = newPeerConnection;
}

export function setStreamId(newStreamId) {
  streamId = newStreamId;
}

export function setSessionId(newSessionId) {
  sessionId = newSessionId;
}

export function setSessionClientAnswer(newSessionClientAnswer) {
  sessionClientAnswer = newSessionClientAnswer;
}

export function setGlobalVideoElement(newVideoElement) {
    globalVideoElement = newVideoElement;
  }