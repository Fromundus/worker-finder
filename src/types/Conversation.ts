export type Conversation = {
    id: number;
    user_one: { id: number; name: string };
    user_two: { id: number; name: string };
    messages: { id: number; body: string }[];
    last_message_at: string;
}