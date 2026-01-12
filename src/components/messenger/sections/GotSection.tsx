import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "got";
  time: string;
}

const GotSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Привет! Я Got — твой AI-помощник в wix. Чем могу помочь?",
      sender: "got",
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const gotResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Это демо-версия Got. Скоро я смогу помогать с переводами, поиском информации и многим другим!",
        sender: "got",
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, gotResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Icon name="Bot" size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Got AI</h2>
            <p className="text-sm text-muted-foreground">Всегда онлайн</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[70%]">
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gradient-to-br from-primary/10 to-secondary/10 text-foreground border border-border"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Input
            placeholder="Спросите Got..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-muted border-0"
          />
          <Button
            size="icon"
            className="rounded-full bg-primary w-12 h-12"
            onClick={sendMessage}
            disabled={!inputValue.trim()}
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GotSection;
