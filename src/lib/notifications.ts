
'use client';

import { type Notification, type NotificationType } from './types';
import initialNotifications from './data/notifications.json';
import { UserPlus, MessageSquare, Cog, Mail, Bell } from 'lucide-react';

const NOTIFICATIONS_STORAGE_KEY = 'app-notifications';

export const getAllNotifications = (): Notification[] => {
    if (typeof window === 'undefined') {
        return initialNotifications as Notification[];
    }
    try {
        const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        if (storedNotifications) {
            return JSON.parse(storedNotifications);
        } else {
            localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications));
            return initialNotifications as Notification[];
        }
    } catch (error) {
        console.error('Error reading notifications from localStorage:', error);
        return initialNotifications as Notification[];
    }
};

export const saveAllNotifications = (notifications: Notification[]) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
        console.error('Error writing notifications to localStorage:', error);
    }
};

type NewNotificationPayload = {
    type: NotificationType;
    title: string;
    description: string;
}

export const addNotification = (payload: NewNotificationPayload) => {
    const notifications = getAllNotifications();
    const newNotification: Notification = {
        id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
        type: payload.type,
        title: payload.title,
        description: payload.description,
        time: new Date().toISOString(),
        read: false,
    };
    const updatedNotifications = [...notifications, newNotification];
    saveAllNotifications(updatedNotifications);
};
