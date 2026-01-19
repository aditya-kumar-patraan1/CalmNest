import { useEffect, useCallback, useState } from "react";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";
import { BiSolidCameraOff } from "react-icons/bi";
import { MdOutlineCallEnd } from "react-icons/md";
import { FaCamera, FaUser } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import ReactPlayer from "react-player";
import { AnimatePresence, motion } from "framer-motion";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { IoSend } from "react-icons/io5";
import { Toaster, toast } from "react-hot-toast";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { LuShieldCheck } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa6";
import { FaCommentSlash } from "react-icons/fa6";

export const LeftSide = ({ room, email, isLightMode }) => {
  const socket = useSocket();
  const Navigate = useNavigate();

  const [Enemy, setEnemy] = useState("");
  const [mySocket, setmySocket] = useState();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currMsg, setcurrMsg] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [CommentOn, setCommentOn] = useState(false);
  const [isEmojiOpen, setisEmojiOpen] = useState(false);
  const [allMessages,setallMessages] = useState([]);

  useEffect(() => {
    console.log(currMsg);
  }, [currMsg]);

  const AllEmojis = [
    "😀",
    "😂",
    "👍",
    "👎",
    "😢",
    "❤️",
    "🎉",
    "🔥",
    "💯",
    "👏",
  ];

  const chunkedEmojis = [];

  for (let i = 0; i < AllEmojis.length; i += 5) {
    chunkedEmojis.push(AllEmojis.slice(i, i + 5));
  }

  // console.log(chunkedEmojis);

  const toggleComments = () => {
    setCommentOn((prev) => !prev);
  };

  useEffect(() => {
    console.log(CommentOn);
  }, [CommentOn]);

  // ========= keep your logic intact =========
  const toggleMic = () => {
    if (!myStream) return;
    if (micOn) {
      const micMsg = `${email} turned off the mic`;
      console.log(micMsg);
      socket.emit("micMsg", { remoteSocketId, micMsg });
    } else {
      const micMsg = `${email} turned on the mic`;
      console.log(micMsg);
      socket.emit("micMsg", { remoteSocketId, micMsg });
    }
    myStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
  };

  useEffect(() => {
    if (socket) {
      setmySocket(socket.id);
      // console.log("abe connect hogya bhai !")
    }
  }, [socket]);

  const toggleCamera = () => {
    if (!myStream) return;
    const newCameraState = !cameraOn;
    myStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setCameraOn(newCameraState);
    socket.emit("camera:toggle", { to: remoteSocketId, email, newCameraState });
  };

  const cutCall = () => {
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
    setMyStream(null);
    setRemoteStream(null);
    socket.emit("call:ended", { to: remoteSocketId });
    toast("📴 Call Ended");
    Navigate("/");
  };

  const handleUserJoined = useCallback(({ email, id }) => {
    toast.success(`${email} joined the Meeting..`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    toast.success("Call sent. Waiting for response...");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    console.log("Connect hogya bhaii mein bhej rhh tuje call");
    socket.emit("user:call", { to: remoteSocketId, offer });
    socket.emit("send:opponent_from_calling", { opponentName: email });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    const { from, offer } = incomingCall;
    setShowPrompt(false);
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
    toast.success("Send the Stream");
  };

  const handleDeclineCall = () => {
    setShowPrompt(false);
    setIncomingCall(null);
  };

  const renderAcceptDeclinePrompt = () => {
    if (!showPrompt) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white border rounded-xl shadow-xl w-full max-w-sm p-6">
          <p className="text-base font-semibold text-slate-900 text-center">
            Incoming Call
          </p>
          <p className="text-sm text-slate-600 text-center mt-1">
            Would you like to accept the call?
          </p>
          <div className="flex gap-3 justify-center mt-5">
            <button
              onClick={handleAcceptCall}
              className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition active:scale-95"
            >
              Accept
            </button>
            <button
              onClick={handleDeclineCall}
              className="px-4 py-2 rounded-full bg-slate-200 text-slate-900 hover:bg-slate-300 transition active:scale-95"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleIncommingCall = useCallback(({ from, offer }) => {
    toast.success("📲 Incoming Call...");
    setIncomingCall({ from, offer });
    console.log("connect hogya bhai naam dede opponent ka !");
    setShowPrompt(true);
  }, []);

  const sendStreams = useCallback(() => {
    toast.success("Stream sent..");
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("call:ended", () => {
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }
      setMyStream(null);
      setRemoteStream(null);
      toast("📴 Call Ended");
      Navigate("/");
    });
    return () => {
      socket.off("call:ended");
    };
  }, [socket, myStream]);

  const giveMutedMessage = ({ from, email, newCameraState }) => {
    const msg =
      email +
      (newCameraState ? " turned On the Camera" : " turned Off the Camera");
    toast.success(msg);
  };

  const changeMessages = ({ from, currMsg }) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { icon: from[0].toUpperCase(), SID: from, message: currMsg },
    ]);
  };

  function notifyMic({ from, micMsg }) {
    toast.success(micMsg);
  }

  const getOpponentName = ({ from, opponentName }) => {
    setEnemy(opponentName);
  };

  console.log(`Mera Enemy : ${Enemy}`);

  const getAllUserList = (allUsers) => {
    for(let ele of allUsers){
      console.log(ele);
      if(ele.socketid!==mySocket){
        console.log(ele.username);
        setEnemy(ele.username);
      }
    }
    // console.log(allUsers);
  }

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("camera:toggle", giveMutedMessage);
    socket.on("messages:sent", changeMessages);
    socket.on("micMsg", notifyMic);
    socket.on("get:opponent_from_calling", getOpponentName);
    socket.on("all:users",getAllUserList);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("camera:toggle", giveMutedMessage);
      socket.off("messages:sent", changeMessages);
      socket.off("micMsg", notifyMic);
      socket.off("get:opponent_from_calling", getOpponentName);
      socket.off("all:users",getAllUserList);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    getOpponentName,
  ]);

  const sendMessage = () => {
    if (!currMsg || !currMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { icon: email[0].toUpperCase(), SID: mySocket, message: currMsg },
    ]);
    socket.emit("messages:sent", { to: remoteSocketId, currMsg });
    setcurrMsg("");
  };
  // ========= end logic =========

  const isConnected = !!remoteSocketId;

  const addInText = (e) => {
    const targetEmoji = document.getElementById(e.target.id);
    // console.log(targetEmoji.innerText);
    const newTextMsg = currMsg + " " + targetEmoji.innerText;
    setcurrMsg(newTextMsg);
    setisEmojiOpen(false);
  };

  let currEmojiIndex = 0;

  return (
    <>
      <Toaster />
      {renderAcceptDeclinePrompt()}

      {/* Header (fixed ~56px high) */}
      <div className="border-b  h-fit flex flex-col md:flex-row bg-transparent p-2 lg:flex-row justify-between w-screen">
        <AnimatePresence>
          <div
            className={`flex flex-row justify-center  ${
              CommentOn ? "w-8/2" : "w-screen flex flex-row justify-center"
            } h-screen bg-transparent`}
          >
            <motion.div
              initial={{ opacity: 0, x: -100 }} // pehle halka slide-in left
              animate={{
                opacity: 1,
                x: 0,
                width: CommentOn ? "95%" : "100%",
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 18,
                },
              }}
              exit={{
                opacity: 0,
                x: 400,
                scale: 0.95,
                transition: {
                  duration: 0.7, // 👈 smooth slow exit
                  ease: "easeInOut",
                },
              }}
              className="bg-transparent h-screen flex flex-col items-center"
            >
              <div
                className={`h-full ${
                  CommentOn ? "w-full" : "w-8/12"
                } px-4 flex flex-col items-center bg-transparent  justify-between`}
              >
                <div className="flex justify-between w-[100%]">
                  <div className="flex justify-between gap-2 text-slate-900 bg-transparent">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-emerald-600/30">
                      <LuShieldCheck className="text-emerald-600" />
                    </span>
                    <div className="font-semibold">IntelliConnect</div>
                  </div>
                  <div className="flex items-center gap-2 bg-transparent">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                        isConnected
                          ? "bg-emerald-100 text-emerald-600 ring-emerald-200"
                          : "bg-red-100 text-red-600 ring-red-200"
                      }`}
                    >
                      {isConnected ? (
                          <div className="flex items-center gap-1">
                            <span className="rounded-2xl text-green-600 h-3 w-3 animate-pulse bg-[#34D399]">
                            
                          </span>
                          <p> Connected</p>
                          </div>
                      ) : (
                        <div className="flex items-center gap-1">
                            <span className="rounded-2xl h-3 w-3 animate-pulse bg-red-600">
                            
                          </span>
                          <p>Not Connected</p>
                          </div>
                      )}
                    </span>
                    {room ? (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                        {room}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div
                  className={`${CommentOn ? "min-w-full" : "w-screen"}  ${
                    CommentOn ? "" : "items-center"
                  } h-screen p-2 flex flex-col`}
                >
                  {/* Stage fills all available height */}
                  <div
                    className={`relative flex-1 bg-slate-50 border ${
                      CommentOn ? "" : "w-8/12"
                    } rounded-xl shadow-sm overflow-hidden`}
                  >
                    {/* Remote video fills container */}
                    {remoteStream ? (
                      <ReactPlayer
                        playing
                        height="100%"
                        width="100%"
                        url={remoteStream}
                        className="!absolute !inset-0 !h-full !w-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                        <div className="flex items-center gap-2 text-sm">
                          <BiSolidCameraOff className="text-xl"/>
                          Camera off
                        </div>
                      </div>
                    )}

                    {/* Guest chip */}
                    {Enemy && remoteStream?
                    <div className="absolute left-4 bottom-4">
                      <span className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-xs ring-1 ring-slate-200">
                        {Enemy}
                      </span>
                    </div>:null}

                    {/* Local PiP (responsive width, always visible area) */}
                    <div className="absolute right-6 bottom-2 w-[360px] max-w-[45%]">
                      <div className="rounded-xl bg-white/90 ring-1 ring-slate-200 shadow-lg overflow-hidden">
                        <div className="relative pt-[56.25%]">
                          {" "}
                          {/* 16:9 ratio */}
                          {myStream ? (
                            <ReactPlayer
                              playing
                              muted
                              height="100%"
                              width="100%"
                              url={myStream}
                              className="!absolute !inset-0 !h-full !w-full"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-50">
                              <div className="flex items-center gap-2 text-sm">
                                <BiSolidCameraOff className="text-xl" />
                                Camera off
                              </div>
                              <span className="absolute bottom-4 left-4 px-2 py-1 rounded-full bg-white text-slate-700 text-xs ring-1 ring-slate-200">
                                You
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2"></div>
                    </div>
                  </div>

                  {/* Bottom controls row */}
                  <div className="mt-4 flex items-center justify-center gap-5">
                    <button
                      onClick={toggleMic}
                      aria-label={
                        micOn ? "Mute microphone" : "Unmute microphone"
                      }
                      className={`h-10 w-10 rounded-full  ring-1 ring-slate-200 shadow-m flex items-center justify-center
                 active:scale-95 transition-all duration-300 ${
                   micOn
                     ? "bg-blue-600 hover:bg-blue-700"
                     : "bg-red-600 hover:bg-red-700"
                 }`}
                    >
                      {micOn ? (
                        <CiMicrophoneOn className="text-[18px] text-white" />
                      ) : (
                        <CiMicrophoneOff className="text-[18px] text-white" />
                      )}
                    </button>

                    <button
                      onClick={toggleCamera}
                      aria-label={
                        cameraOn ? "Turn camera off" : "Turn camera on"
                      }
                      className={`h-10 w-10 rounded-full  ring-1 ring-slate-200 shadow-m flex items-center justify-center
                 active:scale-95 transition-all duration-300 ${
                   cameraOn
                     ? "bg-blue-600 hover:bg-blue-700"
                     : "bg-red-600 hover:bg-red-700"
                 }`}
                    >
                      {cameraOn ? (
                        <FaCamera className="text-[20px] text-white" />
                      ) : (
                        <BiSolidCameraOff className="text-[20px] text-white" />
                      )}
                    </button>

                    <button
                      onClick={toggleComments}
                      aria-label={CommentOn ? "Comments On" : "Comments off"}
                      className={`h-10 w-10 rounded-full  ring-1 ring-slate-200 shadow-m flex items-center justify-center
                 active:scale-95 transition-all duration-300 ${
                   CommentOn
                     ? "bg-blue-600 hover:bg-blue-700"
                     : "bg-red-600 hover:bg-red-700"
                 }`}
                    >
                      {CommentOn ? (
                        <FaRegComment className="text-white  text-[20px]" />
                      ) : (
                        <FaCommentSlash className="text-white text-[20px]" />
                      )}
                    </button>

                    <button
                      onClick={cutCall}
                      aria-label="End call"
                      className="h-10 w-10 rounded-full ring-1 bg-red-600 ring-red-700 text-white flex items-center justify-center shadow-sm hover:bg-red-700 active:scale-95 transition"
                    >
                      <MdOutlineCallEnd className="text-[22px]" />
                    </button>
                  </div>

                  {/* Optional original actions */}
                  <div className="mt-3 flex flex-wrap justify-center items-center gap-3">
                    {myStream && (
                      <button
                        onClick={sendStreams}
                        className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition"
                      >
                        Send Stream
                      </button>
                    )}
                    {remoteSocketId && (
                      <button
                        onClick={handleCallUser}
                        className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition"
                      >
                        Call User
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
        {/* <div className="w-4/12 h-screen">
        </div> */}
        <div className={`bg-transparent h-screen  w-full`}>
          {/* Right column: Chat with fixed width, full height */}
          {CommentOn ? (
            <motion.div
              // initial={{ width: 0, opacity: 0 }}
              // animate={{ width: "100%", opacity: 1 }}
              // exit={{ width: 0, opacity: 0 }}
              // transition={{ duration: 0.4, ease: "easeInOut" }}
              key="chatbox"
              initial={{ x: 400, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{
                x: 400,
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.6, ease: "easeInOut" }, // 👈 smooth slide + fade
              }}
              transition={{
                duration: 1,
                ease: [0.25, 0.8, 0.25, 1], // smooth easing curve
              }}
              className="h-full bg-transparent"
            >
              <div className="h-full bg-transparent border-slate-500 border-2 rounded-xl shadow-sm flex flex-col overflow-hidden w-full">
                {/* Header */}
                <div className="h-12 flex items-center gap-2 px-4 border-b bg-white">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-slate-300">
                    <FaUser className="text-[12px] text-slate-700" />
                  </span>
                  <span className="font-medium">Chat</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-0 space-y-3 bg-white hide-scrollbar">
                  {messages.map((item, key) => {
                    const isMe = item.SID === mySocket;
                    return (
                      <div
                        key={key}
                        className={`m-3 flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="flex items-start gap-2 max-w-[80%]">
                          {isMe ? email : Enemy}
                          {new Date().toLocaleString()}
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                              isMe ? "bg-emerald-600" : "bg-slate-600"
                            }`}
                          >
                            <FaUser className="text-[14px]" />
                          </div>
                          <div
                            className={`px-4 py-2 rounded-2xl text-sm shadow-sm border ${
                              isMe
                                ? "bg-emerald-50 text-emerald-900 border-emerald-100"
                                : "bg-slate-50 text-slate-800 border-slate-200"
                            }`}
                          >
                            {item.message}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-white">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg border flex flex-row items-center px-3 w-full border-slate-300">
                      <div className="relative">
                        <AnimatePresence>
                          {isEmojiOpen ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              exit={{ opacity: 0 }}
                            >
                              <div className="flex flex-col gap-2 z-50 absolute bottom-14 left-[-3] bg-slate-50 border border-slate-300 rounded-2xl p-2 w-fit h-fit">
                                {chunkedEmojis.map((itemRow, rowIndex) => (
                                  // each row
                                  <div
                                    key={rowIndex}
                                    className="flex flex-row gap-4"
                                  >
                                    {itemRow.map((item, index) => (
                                      <span
                                        className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-125"
                                        id={`${currEmojiIndex++}-emoji`}
                                        onClick={(e) => addInText(e)}
                                        key={index}
                                      >
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>

                        <MdOutlineEmojiEmotions
                          className="text-2xl cursor-pointer hover:bg-gray-100 rounded-full"
                          onClick={() => setisEmojiOpen((prev) => !prev)}
                        />
                      </div>
                      <input
                        type="text"
                        value={currMsg}
                        onChange={(e) => setcurrMsg(e.target.value)}
                        className={`flex-grow h-12 px-4 rounded-full  text-sm focus:outline-none `}
                        placeholder="Start chatting..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") sendMessage();
                        }}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      className={`h-12 w-12 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white  p-3 transition   ${
                        currMsg.trim() == ""
                          ? "disabled:opacity-50 disabled:cursor-not-allowed"
                          : " active:scale-95 hover:bg-slate-800"
                      }`}
                      aria-label="Send message "
                      disabled={currMsg.trim() === ""}
                    >
                      <IoSend className={`text-[18px]`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default LeftSide;
