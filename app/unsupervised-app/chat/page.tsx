"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
} from "lucide-react";
import ChatInterface from "@/unsupervised-components/chat-interface";
import ChatSidebar from "@/unsupervised-components/chat-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatPage() {
  const isMobile = useIsMobile();
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [activeChat, setActiveChat] = useState<any | null>(null);

  const handleSelectChat = (chat) => {
    setActiveChatId(chat.id);
    setActiveChat(chat);
  };

  const handleBackToList = () => {
    setActiveChatId(null);
    setActiveChat(null);
  };

  // Mobile: Show either chat list or chat detail
  if (isMobile) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {!activeChatId ? (
          // Chat list view
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h1 className="text-2xl font-bold font-montserrat">Team Chat</h1>
              <p className="text-gray-500">
                Communicate with your team and coaches
              </p>
            </div>

            <Card className="flex-grow flex flex-col overflow-hidden">
              <CardHeader className="px-4 py-3 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search chats..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden flex-grow">
                <ChatSidebar onSelectChat={handleSelectChat} />
              </CardContent>
            </Card>
          </div>
        ) : (
          // Chat detail view
          <div className="flex flex-col h-full">
            <Card className="flex-grow flex flex-col overflow-hidden">
              <CardHeader className="px-4 py-3 border-b flex-shrink-0">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackToList}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-3 flex-grow">
                    <Avatar>
                      <AvatarImage
                        src={
                          activeChat?.avatar ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={activeChat?.name}
                      />
                      <AvatarFallback>
                        {activeChat?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {activeChat?.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {activeChat?.isGroup
                          ? "25 members, 5 online"
                          : activeChat?.online
                            ? "Online"
                            : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow overflow-hidden flex flex-col">
                <ChatInterface />
                <div className="p-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      className="flex-grow"
                    />
                    <Button size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Desktop: Show both chat list and chat detail
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat">Team Chat</h1>
          <p className="text-gray-500">
            Communicate with your team and coaches
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow overflow-hidden">
        {/* Chat sidebar */}
        <div className="lg:col-span-1 h-full">
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="px-4 py-3 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-8" />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden flex-grow">
              <ChatSidebar onSelectChat={handleSelectChat} />
            </CardContent>
          </Card>
        </div>

        {/* Chat main */}
        <div className="lg:col-span-3 h-full">
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="px-4 py-3 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Team Chat"
                    />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Team General</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      25 members, 5 online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden flex flex-col">
              <ChatInterface />
              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-grow"
                  />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
