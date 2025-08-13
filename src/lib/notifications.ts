
'use client';

import { type Notification, type NotificationType, type UserRole } from './types';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, where, doc, updateDoc, writeBatch, getDocs, deleteDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const notificationsCollection = collection(db, 'notifications');

// --- Real-time Hook for Notifications ---
export const useNotifications = (userId?: string, userRole?: UserRole) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!userId) return;

        // Query for notifications sent to the specific user OR their role (e.g., 'admin_role')
        const q = query(
            notificationsCollection, 
            where('recipientId', 'in', [userId, `${userRole}_role`]),
            orderBy('time', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notificationsData: Notification[] = [];
            querySnapshot.forEach(doc => {
                notificationsData.push({ id: doc.id, ...doc.data() } as Notification);
            });
            setNotifications(notificationsData);
        }, (error) => {
            console.error("Error fetching notifications:", error);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [userId, userRole]);

    return { notifications, setNotifications };
};


// --- Functions to Manage Notifications ---

type NewNotificationPayload = {
    recipientId: string; // User ID or a role like 'admin_role'
    type: NotificationType;
    title: string;
    description: string;
}

export const addNotification = async (payload: NewNotificationPayload) => {
    try {
        await addDoc(notificationsCollection, {
            ...payload,
            time: new Date().toISOString(),
            read: false,
        });
    } catch (error) {
        console.error("Error adding notification:", error);
    }
};

export const updateNotification = async (id: string, updates: Partial<Notification>) => {
    const notificationDoc = doc(db, 'notifications', id);
    try {
        await updateDoc(notificationDoc, updates);
    } catch (error) {
        console.error("Error updating notification:", error);
    }
}

export const clearAllNotifications = async (userId: string, userRole: UserRole) => {
    try {
        const q = query(
            notificationsCollection, 
            where('recipientId', 'in', [userId, `${userRole}_role`]),
        );
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

    } catch (error) {
         console.error("Error clearing notifications:", error);
    }
}
