import { useState } from "react";
import Icon from "@/components/ui/icon";
import ChatsSection from "./sections/ChatsSection";
import ContactsSection from "./sections/ContactsSection";
import ProfileSection from "./sections/ProfileSection";
import GotSection from "./sections/GotSection";
import SettingsSection from "./sections/SettingsSection";
import PremiumSection from "./sections/PremiumSection";

interface MessengerMainProps {
  userData: {
    phone: string;
    nickname: string;
    username: string;
    avatar: string;
  };
}

type Section = "got" | "chats" | "contacts" | "profile" | "settings" | "premium";

const MessengerMain = ({ userData }: MessengerMainProps) => {
  const [activeSection, setActiveSection] = useState<Section>("chats");

  const navItems = [
    { id: "got" as Section, icon: "Bot", label: "Got" },
    { id: "chats" as Section, icon: "MessageSquare", label: "Чаты" },
    { id: "contacts" as Section, icon: "Users", label: "Контакты" },
    { id: "profile" as Section, icon: "User", label: "Профиль" },
    { id: "settings" as Section, icon: "Settings", label: "Настройки" },
    { id: "premium" as Section, icon: "Crown", label: "Премиум" },
  ];

  return (
    <div className="flex h-screen bg-background">
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-6 space-y-6">
        <div className="text-3xl font-bold text-primary mb-4">w</div>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeSection === item.id
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon name={item.icon} size={22} />
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {activeSection === "got" && <GotSection />}
        {activeSection === "chats" && <ChatsSection userData={userData} />}
        {activeSection === "contacts" && <ContactsSection />}
        {activeSection === "profile" && <ProfileSection userData={userData} />}
        {activeSection === "settings" && <SettingsSection />}
        {activeSection === "premium" && <PremiumSection />}
      </div>
    </div>
  );
};

export default MessengerMain;
