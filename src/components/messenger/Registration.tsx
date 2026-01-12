import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

interface RegistrationProps {
  onComplete: (data: {
    phone: string;
    nickname: string;
    username: string;
    avatar: string;
  }) => void;
}

const EMOJIS = ["😀", "😎", "🚀", "💜", "🌟", "🔥", "💎", "🎨", "🎭", "🎪"];

const Registration = ({ onComplete }: RegistrationProps) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [sentCode, setSentCode] = useState("");

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setSentCode(code);
      alert(`Код подтверждения: ${code}`);
      setStep(2);
    }
  };

  const handleCodeVerification = () => {
    if (verificationCode === sentCode) {
      setStep(3);
    } else {
      alert("Неверный код!");
    }
  };

  const handleCredentialsSubmit = () => {
    if (password && nickname && username) {
      setStep(4);
    }
  };

  const handleAvatarSelect = async () => {
    if (selectedAvatar) {
      try {
        const response = await fetch('https://functions.poehali.dev/5177b43f-2ac2-4e49-9505-46314bd3e396', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'register',
            phone,
            nickname,
            username,
            avatar: selectedAvatar,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem('wix_user', JSON.stringify(data.user));
          onComplete({ phone, nickname, username, avatar: selectedAvatar });
        } else {
          alert(data.error || 'Ошибка регистрации');
        }
      } catch (error) {
        alert('Ошибка подключения к серверу');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">wix</h1>
          <p className="text-muted-foreground">
            {step === 1 && "Введите номер телефона"}
            {step === 2 && "Введите код подтверждения"}
            {step === 3 && "Создайте профиль"}
            {step === 4 && "Выберите аватар"}
          </p>
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <Button
                onClick={handlePhoneSubmit}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={phone.length < 10}
              >
                Продолжить
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Код подтверждения</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="____"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="bg-muted border-border text-center text-2xl tracking-widest"
                  maxLength={4}
                />
              </div>
              <Button
                onClick={handleCodeVerification}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={verificationCode.length !== 4}
              >
                Подтвердить
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">Никнейм</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Ваше имя"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Юзернейм</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="@username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <Button
                onClick={handleCredentialsSubmit}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!password || !nickname || !username}
              >
                Продолжить
              </Button>
            </>
          )}

          {step === 4 && (
            <>
              <div className="space-y-4">
                <Label>Выберите аватар</Label>
                <div className="grid grid-cols-5 gap-3">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`text-4xl p-3 rounded-xl transition-all ${
                        selectedAvatar === emoji
                          ? "bg-primary scale-110"
                          : "bg-muted hover:bg-muted/80 hover:scale-105"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-border"
                  onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setSelectedAvatar(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    fileInput.click();
                  }}
                >
                  <Icon name="Upload" className="mr-2" size={18} />
                  Загрузить фото
                </Button>
              </div>
              <Button
                onClick={handleAvatarSelect}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!selectedAvatar}
              >
                Завершить регистрацию
              </Button>
            </>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full transition-all ${
                s === step ? "bg-primary w-8" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Registration;