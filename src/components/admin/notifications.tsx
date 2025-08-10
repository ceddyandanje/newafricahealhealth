
'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell, Clock, UserPlus, MessageSquare, Mail, Cog, Info, Package, PenSquare, ShoppingBag } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { getAllNotifications, saveAllNotifications, type Notification } from '@/lib/notifications';

const iconMap = {
    new_appointment: UserPlus,
    message: MessageSquare,
    system_update: Cog,
    lab_results: Mail,
    info: Info,
    product_update: Package,
    blog_update: PenSquare,
    service_update: ShoppingBag,
    default: Bell,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetchNotifications = () => {
      const allNotifications = getAllNotifications();
      const sorted = allNotifications.sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setNotifications(sorted);
    }
    
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000); // Poll for new notifications every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const updateNotifications = (updated: Notification[]) => {
    setNotifications(updated);
    saveAllNotifications(updated);
  }

  const handleMarkAsRead = (id: number) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    updateNotifications(updated);
  };
  
  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({...n, read: true}));
    updateNotifications(updated);
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>You have {unreadCount} unread messages.</SheetDescription>
        </SheetHeader>
        <div className="flex justify-end mt-2">
            <Button variant="link" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                Mark all as read
            </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-150px)]">
            <div className="py-4 pr-4 space-y-4">
            {notifications.map(notification => {
                const Icon = iconMap[notification.type as keyof typeof iconMap] || iconMap.default;
                return (
                    <div
                    key={notification.id}
                    className={cn("flex items-start gap-4 p-3 rounded-lg cursor-pointer", !notification.read && "bg-primary/10")}
                    onClick={() => handleMarkAsRead(notification.id)}
                    >
                    <div className={cn("p-2 bg-muted rounded-full", !notification.read && "bg-primary/20 text-primary")}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatTimeAgo(notification.time)}
                        </p>
                    </div>
                    {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"></div>
                    )}
                    </div>
                )
            })}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
