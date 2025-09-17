import { useState, useRef, useEffect } from "react";
import { useConversation } from "../hooks/useConversation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import AdminPage from "./custom/AdminPage";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import QueryLoadingPage from "@/pages/StatusPages/QueryLoadingPage";

export default function ChatWindow({
  conversationId,
  currentUserId,
}: {
  conversationId: number;
  currentUserId: number;
}) {
  const { messages, sendMessage, conversation, loading } = useConversation(conversationId);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(text.trim());
    setText("");
  };

  const otherUser = conversation?.user_one.id === currentUserId ? conversation?.user_two : conversation?.user_one;
  const userName = otherUser?.name?.split("").slice(0, 2).join("").toUpperCase();

  const navigate = useNavigate();

  if(loading){
    return (
      <QueryLoadingPage />
    )
  }

  if(!loading && !conversation){
    return (
      <AdminPage withBackButton={true} title="Message Not Found">
        <div className="min-h-[80vh] flex items-center justify-center">
          <span>Invalid Conversation</span>
        </div>
      </AdminPage>
    )
  }

  return (
    <div className="flex flex-col border rounded-lg shadow-md">
      <div className="w-full bg-card p-4 flex items-center gap-2">
        <Button className='w-fit' variant='outline' type='button' onClick={() => navigate(-1)}>
            <ArrowLeft /> Back
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback className="bg-background border border-border text-foreground">{userName}</AvatarFallback>
        </Avatar>
        {otherUser?.name}
      </div>
      <div className="overflow-auto h-[61vh] p-4 space-y-3">
        {messages.length > 0 ?
        
        messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[70%] w-fit p-3 rounded-xl break-words flex flex-col gap-1 ${
              m.sender.id === currentUserId
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-accent"
            }`}
          >
            {/* <div className="text-sm font-medium">{m.sender.name}</div> */}
            <div>{m.body}</div>
            <div className="text-xs opacity-70 w-full flex justify-end">
              {new Date(m.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))
        :
        <div>
          <span>No Messsages.</span>
        </div>
        }
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 p-3 border-t">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend}><SendHorizonal /></Button>
      </div>
    </div>
  );
}
