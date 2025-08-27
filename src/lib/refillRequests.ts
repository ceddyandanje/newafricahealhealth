
'use client';

import { type RefillRequest } from './types';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useState, useEffect } from 'react';


// This is now a hook that provides live-synced requests from Firestore
export const useRequests = () => {
    const [requests, setRequests] = useState<RefillRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "refillRequests"), orderBy("requestDate", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const requestsData: RefillRequest[] = [];
            querySnapshot.forEach((doc) => {
                requestsData.push({ id: doc.id, ...doc.data() } as RefillRequest);
            });
            setRequests(requestsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to fetch refill requests:", error);
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return {requests, setRequests, isLoading};
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

export const updateRequestStatus = async (requestId: string, status: 'Approved' | 'Rejected', approverId: string, approverName: string) => {
    const requestDocRef = doc(db, "refillRequests", requestId);
    await updateDoc(requestDocRef, {
        status: status,
        approverId: approverId,
        approverName: approverName,
        actionDate: new Date().toISOString(),
    });
};
