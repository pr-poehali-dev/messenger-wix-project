import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface ProfileSectionProps {
  userData: {
    phone: string;
    nickname: string;
    username: string;
    avatar: string;
  };
}

const ProfileSection = ({ userData }: ProfileSectionProps) => {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <Card className="w-full max-w-md p-8 bg-card border-border">
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32 bg-primary text-6xl flex items-center justify-center mb-6">
            {userData.avatar}
          </Avatar>
          
          <h2 className="text-2xl font-bold mb-1">{userData.nickname}</h2>
          <p className="text-muted-foreground mb-6">@{userData.username}</p>

          <div className="w-full space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <Icon name="Phone" className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Телефон</p>
                <p className="font-medium">{userData.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <Icon name="AtSign" className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Юзернейм</p>
                <p className="font-medium">@{userData.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <Icon name="User" className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Никнейм</p>
                <p className="font-medium">{userData.nickname}</p>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
            <Icon name="Pencil" size={18} className="mr-2" />
            Редактировать профиль
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;
