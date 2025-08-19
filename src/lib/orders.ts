
'use client';

import { type Order, type CartItem, OrderStatus } from './types';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const ordersCollection = collection(db, 'orders');

export const useOrders = () => {
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
