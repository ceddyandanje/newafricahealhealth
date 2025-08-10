
'use client';

import { type Notification, type NotificationType } from './types';
import initialNotifications from './data/notifications.json';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Dispatch, SetStateAction } from 'react';

// This is now a hook that provides live-synced notifications
export const useNotifications = (): [Notification[], Dispatch<SetStateAction<Notification[]>>] => {
    return useLocalStorage<Notification[]>('app-notifications', initialNotifications as Notification[]);
};

// The functions below are for components that cannot use hooks (e.g., non-component files)
// They will write to localStorage, and the hook will pick up the changes.

const getNotificationsSnapshot = (): Notification[] => {
    if (typeof window === 'undefined') {
        return initialNotifications as Notification[];
    }
    const storedNotifications = localStorage.getItem('app-notifications');
    return storedNotifications ? JSON.parse(storedNotifications) : (initialNotifications as Notification[]);
}

const saveNotificationsSnapshot = (notifications: Notification[]) => {
     if (typeof window === 'undefined') return;
    localStorage.setItem('app-notifications', JSON.stringify(notifications));
    // Manually dispatch event for the current window to update UI
    window.dispatchEvent(new StorageEvent('storage', { key: 'app-notifications' }));
}


type NewNotificationPayload = {
    type: NotificationType;
    title: string;
    description: string;
}

export const addNotification = (payload: NewNotificationPayload) => {
    const notifications = getNotificationsSnapshot();
    const newNotification: Notification = {
        id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
        type: payload.type,
        title: payload.title,
        description: payload.description,
        time: new Date().toISOString(),
        read: false,
    };
    const updatedNotifications = [newNotification, ...notifications];
    saveNotificationsSnapshot(updatedNotifications);
};
