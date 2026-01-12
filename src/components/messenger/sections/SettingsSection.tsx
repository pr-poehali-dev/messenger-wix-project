import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const SettingsSection = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-6">Настройки</h2>

      <div className="space-y-4">
        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Bell" size={20} className="text-primary" />
            Уведомления
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Уведомления о сообщениях</Label>
              <Switch id="notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound">Звук уведомлений</Label>
              <Switch id="sound" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="vibration">Вибрация</Label>
              <Switch id="vibration" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Lock" size={20} className="text-primary" />
            Приватность
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="lastseen">Показывать время активности</Label>
              <Switch id="lastseen" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="readreceipts">Отправлять статус прочтения</Label>
              <Switch id="readreceipts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-photo">Показывать фото профиля</Label>
              <Switch id="profile-photo" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Palette" size={20} className="text-primary" />
            Внешний вид
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkmode">Тёмная тема</Label>
              <Switch id="darkmode" defaultChecked disabled />
            </div>
            <p className="text-sm text-muted-foreground">
              Тёмная тема включена по умолчанию для комфортного использования
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Database" size={20} className="text-primary" />
            Хранилище
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Использовано места</span>
              <span className="text-sm text-muted-foreground">124 МБ</span>
            </div>
            <Button variant="outline" className="w-full">
              Очистить кэш
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="HelpCircle" size={20} className="text-primary" />
            Поддержка
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Icon name="FileText" size={18} className="mr-2" />
              Политика конфиденциальности
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="Mail" size={18} className="mr-2" />
              Связаться с поддержкой
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="Info" size={18} className="mr-2" />
              О приложении
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsSection;
