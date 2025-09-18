import { useEffect, useState } from "react";
import api from "@/api/axios";
import { createEcho } from "@/lib/echo";
import { useAuth } from "@/store/auth";

export type Message = {
  id: number;
  conversation_id: number;
  sender: { id: number; name: string };
  body: string;
  created_at: string;
};

export function useConversation(conversationId: number) {
  const [loading, setLoading] = useState<boolean>(false); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!conversationId) return;

    // Fetch initial messages
    const fetchMessages = (load = true) => {
      setLoading(load);
      api.get(`/conversations/${conversationId}/messages`)
        .then((res) => {
        setMessages(res.data.data);
        // console.log(res)
        setConversation(res.data.conversation);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
    }

    fetchMessages();

    console.log("Subscribed to conversation", conversationId);

    const echo = createEcho(token);

    // Listen for new messages
    const channel = echo.private(`conversation.${conversationId}`);

    channel.listen('.MessageSent', (e: any) => {
      console.log("Received new message:", e.message);
      fetchMessages(false);
      // setMessages(prev => [...prev, e.message]);
    });
    
    return () => {
      echo.leave(`conversation.${conversationId}`);
    };
  }, [conversationId, token]);

  const sendMessage = async (body: string) => {
    const res = await api.post(`/conversations/${conversationId}/messages`, { body });
    // setMessages((prev) => [...prev, res.data]);
  };

  return { messages, sendMessage, conversation, loading };
}
