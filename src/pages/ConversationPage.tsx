import { useParams } from "react-router-dom";
import { useConversation } from "@/hooks/useConversation";
import ChatWindow from "@/components/ChatWindow";
import { useAuth } from "@/store/auth";

export default function ConversationPage() {
    const { user } = useAuth();
    const { conversationId } = useParams();
    if (!conversationId) return <div>No conversation selected</div>;

    const currentUserId = user.id;

    return (
        <ChatWindow
            conversationId={parseInt(conversationId)}
            currentUserId={currentUserId}
        />
    );
}
