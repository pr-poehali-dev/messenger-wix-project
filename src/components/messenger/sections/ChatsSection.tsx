import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import ChatWindow from "../ChatWindow";

interface ChatsSectionProps {
  userData: {
    phone: string;
    nickname: string;
    username: string;
    avatar: string;
  };
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const ChatsSection = ({ userData }: ChatsSectionProps) => {
  const [chats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold mb-3">Чаты</h2>
          <div className="relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Icon name="MessageSquare" size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Нет активных чатов</p>
              <p className="text-sm text-muted-foreground">
                Начните общение через раздел "Контакты"
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 hover:bg-muted transition-colors text-left ${
                    selectedChat?.id === chat.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 bg-primary text-2xl flex items-center justify-center">
                      {chat.avatar}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{chat.name}</span>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} onClose={() => setSelectedChat(null)} userData={userData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="MessageCircle" size={64} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Выберите чат</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsSection;
