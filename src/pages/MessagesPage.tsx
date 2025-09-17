import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";
import AdminPageMain from "@/components/custom/AdminPageMain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";
import { Conversation } from "@/types/Conversation";

type OutleProps = {
  conversations: Conversation[];
  fetchConversations: () => void;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { conversations, fetchConversations }: OutleProps = useOutletContext();
    
  const navigate = useNavigate();

  const currentUserId = user.id;

  const getOtherUser = (c: Conversation) =>
  c.user_one.id === currentUserId ? c.user_two : c.user_one;

  React.useEffect(() => {
    fetchConversations();
  }, []);

  return (

    <AdminPageMain title="Messages" description="">
      <div className="space-y-2">
        {conversations.map((c) => {
          const other = getOtherUser(c);

          const userName = other?.name?.split("").slice(0, 2).join("").toUpperCase();

          return (
            <Card
              key={c.id}
              className="bg-card hover:bg-accent p-4 flex justify-between cursor-pointer w-full"
              onClick={() => navigate(`/${user.role}/messages/${c.id}`)}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-background border border-border text-foreground">
                    {userName}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="font-semibold">{other.name}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {c.messages[0]?.body || "No messages yet"}
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(c.last_message_at), { addSuffix: true })}
                </span>
              </div>
            </Card>

          );
        })}
      </div>
    </AdminPageMain>
  );
}
