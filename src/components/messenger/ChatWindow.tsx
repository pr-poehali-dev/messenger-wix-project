import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface ChatWindowProps {
  chat: {
    id: string;
    name: string;
    avatar: string;
  };
  onClose: () => void;
  userData: {
    avatar: string;
  };
}

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  type: "text" | "voice" | "location" | "music";
}

const ChatWindow = ({ chat, userData }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = (type: "text" | "voice" | "location" | "music" = "text") => {
    if (type === "text" && !inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: type === "text" ? inputValue : `[${type}]`,
      sender: "me",
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 bg-primary text-xl flex items-center justify-center">
            {chat.avatar}
          </Avatar>
          <div>
            <h3 className="font-semibold">{chat.name}</h3>
            <p className="text-xs text-muted-foreground">онлайн</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Phone" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Video" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Начните переписку</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[70%]">
                  {message.sender === "other" && (
                    <Avatar className="w-8 h-8 bg-muted text-sm flex items-center justify-center">
                      {chat.avatar}
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.sender === "me"
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.type === "text" && <p>{message.text}</p>}
                      {message.type === "voice" && (
                        <div className="flex items-center gap-2">
                          <Icon name="Mic" size={16} />
                          <div className="w-32 h-1 bg-white/30 rounded-full" />
                          <span className="text-xs">0:12</span>
                        </div>
                      )}
                      {message.type === "location" && (
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} />
                          <span>Геолокация</span>
                        </div>
                      )}
                      {message.type === "music" && (
                        <div className="flex items-center gap-2">
                          <Icon name="Music" size={16} />
                          <span>Аудиофайл</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {message.time}
                    </p>
                  </div>
                  {message.sender === "me" && (
                    <Avatar className="w-8 h-8 bg-primary text-sm flex items-center justify-center">
                      {userData.avatar}
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => sendMessage("voice")}
          >
            <Icon name="Mic" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => sendMessage("music")}
          >
            <Icon name="Music" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => sendMessage("location")}
          >
            <Icon name="MapPin" size={20} />
          </Button>
          <Input
            placeholder="Сообщение..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-muted border-0"
          />
          <Button
            size="icon"
            className="rounded-full bg-primary"
            onClick={() => sendMessage()}
            disabled={!inputValue.trim()}
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
