"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // FIX 1: Use a ref to track messages so event listeners always see the latest state
  const messagesRef = useRef<SavedMessage[]>([]);

  // Sync ref with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // FIX 2: Move Feedback Logic to a stable function
  const processFeedback = useCallback(async () => {
    // Check if we actually have messages to process
    if (messagesRef.current.length === 0) {
      router.push("/");
      return;
    }

    if (type === "generate") {
      router.push("/");
    } else {
      console.log("Generating feedback...");
      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messagesRef.current, // Use Ref here to get full transcript
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    }
  }, [interviewId, userId, feedbackId, router, type]);

  useEffect(() => {
    const onCallStart = () => {
      console.log("Call started");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setCallStatus(CallStatus.FINISHED);
      // We wait a brief moment for state to settle, then process
      setTimeout(() => processFeedback(), 500);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        
        // Update both state (for UI) and Ref (for logic)
        setMessages((prev) => {
          const updated = [...prev, newMessage];
          messagesRef.current = updated; 
          return updated;
        });
        setLastMessage(message.transcript);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    // FIX 3: Handle the specific "Ejection" error gracefully
    const onError = (error: any) => {
      // Check for the specific "Meeting ended" error string
      const isEjectionError = error?.error?.msg?.includes("Meeting ended");

      if (isEjectionError) {
        // Log as a warning (yellow) instead of error (red) to prevent Next.js Error Overlay
        console.warn("Vapi Warning: Meeting ended due to ejection (ignoring in dev mode)");
        
        // Handle logic gracefully
        setCallStatus(CallStatus.FINISHED);
      } else {
        // Log real errors normally
        console.error("Vapi Error:", error);
      }
    };

    // Attach Listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // FIX 4: Robust Cleanup to prevent double-mounting issues
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
      
      // Try/Catch stop to prevent errors if already stopped
      try {
        vapi.stop(); 
      } catch (e) {
        // ignore
      }
    };
  }, [processFeedback]); // Only re-run if processFeedback changes (it shouldn't due to useCallback)

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setMessages([]); // Reset messages on new call
    messagesRef.current = [];

    try {
      if (type === "generate") {
        await vapi.start(
          undefined,
          undefined,
          undefined,
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
          {
            variableValues: {
              username: userName,
              userid: userId,
            },
          }
        );
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (err) {
      console.error("Failed to start call", err);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    vapi.stop();
    // onCallEnd listener will trigger the feedback generation
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={messages.length} // Use length to trigger animation on new message
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button 
            className="relative btn-call" 
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "CONNECTING" ? "Connecting..." : "Start Interview"}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End Interview
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;