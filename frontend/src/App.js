import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const ENDPOINT = "https://vc-mern-demo.onrender.com/";
const socket = io(ENDPOINT);

const App = () => {

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [idToCall, setIdToCall] = useState("");

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (myVideo.current) {
        // do something
        myVideo.current.srcObject = currentStream;
      }
    }).catch((err) => {
      alert(err.message)
    })
    socket.on("user:joined", (id) => setMe(id));

    //  to handle incomming call
    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal })
    })
  }, [])

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id, name) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    })

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer;
  }

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload()
  }
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>video chat</h1>
      <div style={{ display: "flex" }}>
        {/* Our own video */}
        {stream && <div style={{ display: "flex", flexDirection: "column" }}>
          <video autoPlay ref={myVideo} muted />
          <h5 style={{ textAlign: "center" }}>{name} (Me)</h5>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <h1>Account Info</h1>
              <input placeholder='Name' onChange={(e) => setName(e.target.value)} />
              <p>{me}</p>
            </div>
            <div>
              <h1 style={{ backgroundColor: "green" }}>Make a call</h1>
              <input placeholder='ID to Call' onChange={(e) => setIdToCall(e.target.value)} />
              {callAccepted && !callEnded ? (
                <button onClick={leaveCall}>Hang Up</button>
              ) : (
                <button onClick={() => { callUser(idToCall, name) }}>Make Call</button>

              )}
            </div>
          </div>
          {call.isReceivedCall && !callAccepted && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h1>{call.name} is calling...</h1>
              <button onClick={answerCall}> Answer Call</button>
            </div>
          )}

        </div>}
        {/* User's video */}
        {callAccepted && !callEnded &&
          <> <h5>{call.name}</h5>
            <video autoPlay ref={userVideo}  />
          </>
        }


      </div>
    </div>
  )
}

export default App
