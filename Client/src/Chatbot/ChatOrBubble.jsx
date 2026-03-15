import { useState } from "react";
import Chat from "./Chat";
import Bubble from "./Bubble";


function ChatOrBubble({isLightMode,setisLightMode}) {

  const [isChatOpen,setisChatOpen] = useState(false);

  return (
    <>

    {!isChatOpen && (<Bubble setisChatOpen={setisChatOpen} isLightMode={isLightMode} setisLightMode={setisLightMode}/>)}
    {isChatOpen && (<Chat setisChatOpen={setisChatOpen} isLightMode={isLightMode} setisLightMode={setisLightMode}/>)}
    </>
  );
}

export default ChatOrBubble;