import { useState } from "react";
import Registration from "@/components/messenger/Registration";
import MessengerMain from "@/components/messenger/MessengerMain";

const Index = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState({
    phone: "",
    nickname: "",
    username: "",
    avatar: "",
  });

  const handleRegistrationComplete = (data: typeof userData) => {
    setUserData(data);
    setIsRegistered(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {!isRegistered ? (
        <Registration onComplete={handleRegistrationComplete} />
      ) : (
        <MessengerMain userData={userData} />
      )}
    </div>
  );
};

export default Index;
