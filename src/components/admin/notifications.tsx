
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell, Clock, UserPlus, MessageSquare, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

const initialNotifications = [
  {
    id: 1,
    type: 'new_appointment',
    icon: UserPlus,
    title: 'New Appointment',
    description: 'Dr. Smith has a new appointment with John Doe at 2:30 PM.',
    time: '5 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'message',
    icon: MessageSquare,
    title: 'New Message',
    description: 'You have a new message from Patient #12345.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'system_update',
    icon: Clock,
    title: 'System Maintenance',
    description: 'Scheduled maintenance will occur at 3:00 AM tonight.',
    time: '4 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'new_appointment',
    icon: UserPlus,
    title: 'Appointment Canceled',
    description: 'Patient Jane Doe canceled her appointment for tomorrow.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 5,
    type: 'message',
    icon: Mail,
    title: 'Lab Results Ready',
    description: 'Lab results for patient Michael B. are now available.',
    time: '2 days ago',
    read: true,
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
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
            {notifications.map(notification => (
                <div
                key={notification.id}
                className={cn("flex items-start gap-4 p-3 rounded-lg", !notification.read && "bg-primary/10")}
                onClick={() => handleMarkAsRead(notification.id)}
                >
                <div className={cn("p-2 bg-muted rounded-full", !notification.read && "bg-primary/20 text-primary")}>
                    <notification.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {notification.time}
                    </p>
                </div>
                {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"></div>
                )}
                </div>
            ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
