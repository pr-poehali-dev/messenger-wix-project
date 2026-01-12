import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Contact {
  id: string;
  name: string;
  username: string;
  phone: string;
  avatar: string;
}

const ContactsSection = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    name: "",
    username: "",
    phone: "",
    avatar: "👤",
  });

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([
        ...contacts,
        { ...newContact, id: Date.now().toString() },
      ]);
      setNewContact({ name: "", username: "", phone: "", avatar: "👤" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      username: contact.username,
      phone: contact.phone,
      avatar: contact.avatar,
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingContact) {
      setContacts(
        contacts.map((c) =>
          c.id === editingContact.id ? { ...c, ...newContact } : c
        )
      );
      setEditingContact(null);
      setNewContact({ name: "", username: "", phone: "", avatar: "👤" });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Контакты</h2>
          <Button
            onClick={() => {
              setEditingContact(null);
              setNewContact({ name: "", username: "", phone: "", avatar: "👤" });
              setIsAddDialogOpen(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Icon name="UserPlus" size={18} className="mr-2" />
            Добавить
          </Button>
        </div>
        <div className="relative">
          <Icon
            name="Search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Поиск контактов"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-0"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Icon name="Users" size={64} className="text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-2">
              {contacts.length === 0 ? "Нет контактов" : "Контакты не найдены"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Добавьте контакты, чтобы начать общение
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 bg-primary text-2xl flex items-center justify-center">
                    {contact.avatar}
                  </Avatar>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{contact.username} · {contact.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditContact(contact)}
                  >
                    <Icon name="Pencil" size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Icon name="Trash2" size={18} className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Редактировать контакт" : "Добавить контакт"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Имя</Label>
              <Input
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="Имя контакта"
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Юзернейм</Label>
              <Input
                value={newContact.username}
                onChange={(e) =>
                  setNewContact({ ...newContact, username: e.target.value })
                }
                placeholder="username"
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Телефон</Label>
              <Input
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                placeholder="+7 (___) ___-__-__"
                className="bg-muted border-border"
              />
            </div>
            <Button
              onClick={editingContact ? handleSaveEdit : handleAddContact}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {editingContact ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsSection;
