
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, where, addDoc } from 'firebase/firestore';
import { type EmergencyRequest } from './types';
import { addLog } from './logs';

const emergencyCollectionRef = collection(db, 'emergencies');

// Hook to fetch pending emergency requests for the admin dashboard
export const useEmergencyRequests = () => {
    const [requests, setRequests] = useState<EmergencyRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(
            emergencyCollectionRef,
            where('status', '==', 'Pending'),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestData: EmergencyRequest[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyRequest));
            setRequests(requestData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching emergency requests:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { requests, isLoading };
};


type NewRequestPayload = Omit<EmergencyRequest, 'id' | 'status' | 'createdAt'>;

export const addEmergencyRequest = async (payload: NewRequestPayload) => {
    const newRequest: Omit<EmergencyRequest, 'id'> = {
        ...payload,
        status: 'Pending',
        createdAt: new Date().toISOString(),
    };
    await addDoc(emergencyCollectionRef, newRequest);
    addLog('ERROR', `New emergency request received for ${payload.patientName}. Type: ${payload.serviceType}`);
};
