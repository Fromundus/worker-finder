export type Conversation = {
    id: number;
    user_one: { id: number; first_name: string; middle_name: string; last_name: string; suffix: string;};
    user_two: { id: number; first_name: string; middle_name: string; last_name: string; suffix: string;};
    messages: { id: number; body: string }[];
    last_message_at: string;
}