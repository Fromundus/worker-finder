import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MessageButton({
  userId,
}: {
  userId: number;
}) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleClick = async () => {
    try {
      const res = await api.post("/conversations/start", { user_id: userId });
      const conversationId = res.data.conversation_id;
      navigate(`/${user.role}/messages/${conversationId}`);
    } catch (err) {
      console.error("Failed to start conversation", err);
    }
  };

  return <Button className="bg-blue-500 text-white hover:bg-blue-700" onClick={handleClick}><MessageCircle /> Message</Button>;
}
