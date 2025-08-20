
'use client';

import { type RefillRequest } from './types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { useState, useEffect } from 'react';


// This is now a hook that provides live-synced requests from Firestore
export const useRequests = () => {
    const [requests, setRequests] = useState<RefillRequest[]>([]);

    useEffect(() => {
        const q = query(collection(db, "refillRequests"), orderBy("requestDate", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const requestsData: RefillRequest[] = [];
            querySnapshot.forEach((doc) => {
                requestsData.push({ id: doc.id, ...doc.data() } as RefillRequest);
            });
            setRequests(requestsData);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return {requests, setRequests};
};


type NewRequestPayload = {
    patientId: string;
    patientName: string;
    prescriptionId: string;
    medicationName: string;
}

export const addRequest = async (payload: NewRequestPayload) => {
    try {
        const newRequest: Omit<RefillRequest, 'id'> = {
            patientId: payload.patientId,
            patientName: payload.patientName,
            prescriptionId: payload.prescriptionId,
            medicationName: payload.medicationName,
            requestDate: new Date().toISOString(),
            status: 'Pending',
            paymentStatus: 'Unpaid'
        };
        await addDoc(collection(db, "refillRequests"), newRequest);
    } catch (error) {
        console.error("Error adding refill request to Firestore: ", error);
        throw error; // Re-throw the error so the calling function can handle it
    }
};
