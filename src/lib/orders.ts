
'use client';

import { type Order, type CartItem, OrderStatus } from './types';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const ordersCollection = collection(db, 'orders');

// Hook to fetch all orders for the admin panel
export const useOrdersForAdmin = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(ordersCollection, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData: Order[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { orders, isLoading };
};


// Hook to fetch orders for a specific user
export const useOrders = (userId?: string) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        const q = query(ordersCollection, where("userId", "==", userId), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData: Order[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching user orders:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();

    }, [userId]);

    return { orders, isLoading };
};


type NewOrderPayload = {
    userId: string;
    name: string;
    email: string;
    address: string;
    city: string;
    items: CartItem[];
    totalPrice: number;
    mpesaCode: string;
    orderId: string;
};

export const addOrder = async (payload: NewOrderPayload) => {
    const newOrder: Omit<Order, 'id'> = {
        ...payload,
        status: 'Pending Verification',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await addDoc(ordersCollection, newOrder);
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString()
    });
};

export { type OrderStatus };
