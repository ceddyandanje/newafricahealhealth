
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, where, addDoc, limit } from 'firebase/firestore';
import { type EmergencyRequest } from './types';
import { addLog } from './logs';

const emergencyCollectionRef = collection(db, 'emergencies');

// Hook to fetch pending emergency requests for the admin dashboard
export const useEmergencyRequests = () => {
    const [requests, setRequests] = useState<EmergencyRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simplified query: Order by date, then filter for "Pending" on the client.
        // This avoids the need for a composite index in Firestore.
        const q = query(
            emergencyCollectionRef,
            orderBy('createdAt', 'desc'),
            limit(50) // Limit to a reasonable number of recent incidents
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allRecentRequests: EmergencyRequest[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyRequest));
            
            // Filter for pending requests on the client side
            const pendingRequests = allRecentRequests.filter(req => req.status === 'Pending');
            
            setRequests(pendingRequests);
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
