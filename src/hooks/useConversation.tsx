import { useEffect, useState } from "react";
import echo from "../lib/echo";
import api from "@/api/axios";

export type Message = {
  id: number;
  conversation_id: number;
  sender: { id: number; name: string };
  body: string;
  created_at: string;
};

export function useConversation(conversationId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    if (!conversationId) return;

    // Fetch initial messages
    const fetchMessages = () => {
      api.get(`/conversations/${conversationId}/messages`).then((res) => {
        setMessages(res.data.data);
        // console.log(res)
        setConversation(res.data.conversation);
      });
    }

    fetchMessages();

    console.log("Subscribed to conversation", conversationId);

    // Listen for new messages
    const channel = echo.private(`conversation.${conversationId}`);

    channel.listen('.MessageSent', (e: any) => {
      console.log("Received new message:", e.message);
      fetchMessages();
      // setMessages(prev => [...prev, e.message]);
    });
    
    return () => {
      echo.leave(`conversation.${conversationId}`);
    };
  }, [conversationId]);

  const sendMessage = async (body: string) => {
    const res = await api.post(`/conversations/${conversationId}/messages`, { body });
    // setMessages((prev) => [...prev, res.data]);
  };

  return { messages, sendMessage, conversation };
}
