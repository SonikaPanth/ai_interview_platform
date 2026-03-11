import Image from "next/image";
import React from "react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

const agent = ({ userName }: AgentProps) => {
  const isSpeaking = true;
  const callstatus = CallStatus.FINISHED;
  const messages = [
    "What is your name?",
    "My name is sonika, nice to meet you",
  ];
  const lastMessage = [messages[messages.length - 1]];

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
        {callstatus != "ACTIVE" ? (
          <button className="relative btn-call">
            <span>
              {" "}
              {callstatus === "INACTIVE" || callstatus === "FINISHED"
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default agent;
