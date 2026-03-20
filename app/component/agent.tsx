'use client'

import { vapi } from "@/lib/vapi.sdk";
import { error } from "console";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { id } from "zod/locales";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

interface SavedMessage{
 role:'user' | 'system' | 'assistant';
 content:string;
}

const agent = ({ userName,userId,type }: AgentProps) => {
  const router = useRouter();
  const[isSpeaking,setIsSpeaking]=useState(false);
  const[callStatus,setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const[messages,setMessages]=useState<SavedMessage[]>([]);

  
  useEffect(()=>{
   
    const onCallStart = ()=> setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)
    

    const onMessage = (message:Message)=>{
      if(message.type === 'transcript' && message.transcriptType === 'final'){
        const newMessage = {role:message.role,content:message.transcript}
        setMessages((prev)=>[...prev,newMessage])
      }
    }

    const onSpeechStart= ()=> setIsSpeaking(true);
    const onSpeechEnd = ()=> setIsSpeaking(false);

    const onError =(error: Error) => console.log(error,'Error')
    vapi.on('call-start',onCallStart)
    vapi.on('call-end',onCallEnd)
    vapi.on('message',onMessage)
    vapi.on('speech-start',onSpeechStart)
    vapi.on('speech-end',onSpeechEnd)
    vapi.on('error', onError)

    return () => {
    vapi.off('call-start',onCallStart)
    vapi.off('call-end',onCallEnd)
    vapi.off('message',onMessage)
    vapi.off('speech-start',onSpeechStart)
    vapi.off('speech-end',onSpeechEnd)
    vapi.off('error', onError)
    }

  },[])

  useEffect (()=>{
    if(callStatus === CallStatus.FINISHED)
      router.push('/');
  },[messages,callStatus,type,id])

  const handleCall = async()=>{

    setCallStatus(CallStatus.CONNECTING)
     console.log(
    "Workflow ID:",
    process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID
  ); 
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
      
      variableValues:{
        username:userName,
        userid:userId ,
      }
      
    })
    
  }

  const handleDisconnect = async()=>{
    setCallStatus(CallStatus.FINISHED)
    vapi.stop()
  }
  
  const lastMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = CallStatus.INACTIVE || CallStatus.FINISHED

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="Vapi"
              height={54}
              width={54}
              className=" object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>ai interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user-image"
              height={540}
              width={540}
              className=" object-cover rounded-full size-[120px]"
            />

            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border mt-6">
          <div className="transcript">
            <p key={lastMessage} className="">
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="justify-center w-full flex mt-6">
        {callStatus != "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opacity-75',callStatus!='CONNECTING' && 'hidden')}/>

           
            <span>
              {" "}
              {isCallInactiveOrFinished
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>End</button>
        )}
      </div>
    </>
  );
};

export default agent;
