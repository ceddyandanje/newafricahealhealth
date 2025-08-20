
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell, Clock, UserPlus, MessageSquare, Cog, Info, Package, PenSquare, ShoppingBag, Trash2, Mail, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { useNotifications, updateNotification, clearAllNotifications } from '@/lib/notifications';
import { useAuth } from '@/hooks/use-auth';
import { useMemo } from 'react';
import { type Notification, type NotificationType } from '@/lib/types';
import { Separator } from '../ui/separator';

const iconMap: { [key in NotificationType]: React.ElementType } = {
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

// Define priority and display properties for each notification type
const notificationConfig = {
    info: { priority: 1, group: 'New Orders & Requests', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    product_update: { priority: 2, group: 'Content & Product Updates', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    blog_update: { priority: 2, group: 'Content & Product Updates', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    service_update: { priority: 2, group: 'Content & Product Updates', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    message: { priority: 3, group: 'Communications', color: 'text-green-500', bg: 'bg-green-500/10' },
    new_appointment: { priority: 3, group: 'Communications', color: 'text-green-500', bg: 'bg-green-500/10' },
    lab_results: { priority: 3, group: 'Communications', color: 'text-green-500', bg: 'bg-green-500/10' },
    system_update: { priority: 4, group: 'System', color: 'text-gray-500', bg: 'bg-gray-500/10' },
    default: { priority: 5, group: 'Other', color: 'text-gray-500', bg: 'bg-gray-500/10' },
};


export default function Notifications() {
  const { user } = useAuth();
  const { notifications } = useNotifications(user?.id, user?.role);
  
  const groupedAndSortedNotifications = useMemo(() => {
    // First, sort all notifications by time (most recent first)
    const sorted = [...notifications].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
    // Then, group them by the defined categories
    const grouped = sorted.reduce((acc, notification) => {
        const config = notificationConfig[notification.type as keyof typeof notificationConfig] || notificationConfig.default;
        if (!acc[config.group]) {
            acc[config.group] = [];
        }
        acc[config.group].push(notification);
        return acc;
    }, {} as Record<string, Notification[]>);

    // Finally, sort the groups by priority
    return Object.entries(grouped).sort(([groupA], [groupB]) => {
        const priorityA = notificationConfig[grouped[groupA][0].type as keyof typeof notificationConfig]?.priority || 99;
        const priorityB = notificationConfig[grouped[groupB][0].type as keyof typeof notificationConfig]?.priority || 99;
        return priorityA - priorityB;
    });

  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    updateNotification(id, { read: true });
  };
  
  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
        if (!n.read) {
            updateNotification(n.id, { read: true });
        }
    });
  }

  const handleClearAll = () => {
    clearAllNotifications(user!.id, user!.role);
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
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
           {notifications.length > 0 ? (
            <SheetDescription>You have {unreadCount} unread messages.</SheetDescription>
           ) : (
            <SheetDescription>You have no new notifications.</SheetDescription>
           )}
        </SheetHeader>
        <div className="flex justify-between items-center mt-2 border-b pb-2">
            <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={notifications.length === 0} className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4"/> Clear All
            </Button>
            <Button variant="link" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                <CheckCircle className="mr-2 h-4 w-4"/> Mark all as read
            </Button>
        </div>
        <ScrollArea className="flex-grow">
            <div className="py-4 pr-4 space-y-4">
            {notifications.length === 0 ? (
                <div className="text-center text-muted-foreground pt-24">
                    <Bell className="mx-auto h-12 w-12 mb-4" />
                    <p className="font-semibold">All caught up!</p>
                    <p className="text-sm">You have no new notifications.</p>
                </div>
            ) : (
                groupedAndSortedNotifications.map(([group, notifications]) => (
                    <div key={group} className="mb-4">
                        <h3 className="font-semibold text-sm mb-2 px-3">{group}</h3>
                        {notifications.map(notification => {
                            const config = notificationConfig[notification.type as keyof typeof notificationConfig] || notificationConfig.default;
                            const Icon = iconMap[notification.type as keyof typeof iconMap] || iconMap.default;
                            return (
                                <div
                                key={notification.id}
                                className={cn("flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50", !notification.read && "bg-primary/5")}
                                onClick={() => handleMarkAsRead(notification.id)}
                                >
                                <div className={cn("p-2 rounded-full", config.bg, config.color)}>
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
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 flex-shrink-0 animate-pulse"></div>
                                )}
                                </div>
                            )
                        })}
                    </div>
                ))
            )}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
