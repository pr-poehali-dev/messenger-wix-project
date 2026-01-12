import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const PremiumSection = () => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"sbp" | "card" | null>(null);
  const { toast } = useToast();

  const premiumFeatures = [
    {
      icon: "Sparkles",
      title: "Улучшенные статусы",
      description: "Больше вариантов кастомизации вашего статуса",
    },
    {
      icon: "Palette",
      title: "Темы оформления",
      description: "Эксклюзивные темы и цветовые схемы",
    },
    {
      icon: "Zap",
      title: "Ускоренная отправка",
      description: "Приоритетная доставка сообщений",
    },
    {
      icon: "Shield",
      title: "Расширенная приватность",
      description: "Дополнительные настройки безопасности",
    },
    {
      icon: "CloudUpload",
      title: "Больше хранилища",
      description: "До 10 ГБ для файлов и медиа",
    },
    {
      icon: "Users",
      title: "Большие группы",
      description: "Создавайте группы до 10 000 участников",
    },
  ];

  const handlePayment = async () => {
    if (!paymentMethod) return;

    const user = JSON.parse(localStorage.getItem('wix_user') || '{}');
    
    if (!user.id) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/fc0ca1b0-e625-494f-8c69-db73c0cadfa4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          payment_method: paymentMethod,
          amount: 299,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        user.is_premium = true;
        localStorage.setItem('wix_user', JSON.stringify(user));
        
        toast({
          title: "Успешно!",
          description: data.message,
        });
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Ошибка обработки платежа",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка подключения к серверу",
        variant: "destructive",
      });
    }
    
    setIsPaymentDialogOpen(false);
    setPaymentMethod(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6">
            <Icon name="Crown" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">wix Premium</h1>
          <p className="text-xl text-muted-foreground">
            Получите все преимущества за 299₽/месяц
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {premiumFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={feature.icon} className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-2 mb-6">
              <span className="text-5xl font-bold">299₽</span>
              <span className="text-muted-foreground">/месяц</span>
            </div>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8"
              onClick={() => setIsPaymentDialogOpen(true)}
            >
              <Icon name="Crown" size={20} className="mr-2" />
              Оформить подписку
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Первые 7 дней бесплатно · Отмена в любой момент
            </p>
          </div>
        </Card>

        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Выберите способ оплаты</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("sbp")}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === "sbp"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Smartphone" className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold">Система Быстрых Платежей</p>
                    <p className="text-sm text-muted-foreground">
                      Мгновенный перевод через СБП
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Icon name="CreditCard" className="text-secondary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold">Банковская карта</p>
                    <p className="text-sm text-muted-foreground">
                      Visa, MasterCard, МИР
                    </p>
                  </div>
                </div>
              </button>

              <Button
                onClick={handlePayment}
                disabled={!paymentMethod}
                className="w-full bg-primary hover:bg-primary/90 mt-4"
              >
                Оплатить 299₽
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PremiumSection;