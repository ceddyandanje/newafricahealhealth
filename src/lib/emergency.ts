

'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, where, addDoc, limit } from 'firebase/firestore';
import { type EmergencyRequest, type EmergencyStatus } from './types';
import { addLog } from './logs';

const emergencyCollectionRef = collection(db, 'emergencies');

// Hook to fetch pending emergency requests for the admin dashboard
export const useEmergencyRequests = () => {
    const [requests, setRequests] = useState<EmergencyRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(
            emergencyCollectionRef,
            orderBy('createdAt', 'desc'),
            limit(50) 
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allRecentRequests: EmergencyRequest[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyRequest));
            
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

// Hook to fetch incident history for a specific provider
export const useIncidentHistory = (providerId?: string) => {
    const [incidents, setIncidents] = useState<EmergencyRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!providerId) {
            setIsLoading(false);
            return;
        }

        // This requires a composite index on resolvedBy (asc) and resolvedAt (desc)
        const q = query(
            emergencyCollectionRef,
            where('resolvedBy', '==', providerId),
            orderBy('resolvedAt', 'desc'),
            limit(50)
        );
        
        // ... rest of the hook
    }, [providerId]);
    
    return { incidents, isLoading };
}


type NewRequestPayload = Omit<EmergencyRequest, 'id' | 'status' | 'createdAt'>;

export const addEmergencyRequest = async (payload: NewRequestPayload) => {
    const now = new Date().toISOString();
    const newRequest: Omit<EmergencyRequest, 'id'> = {
        ...payload,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
    };
    await addDoc(emergencyCollectionRef, newRequest);
    addLog('ERROR', `New emergency request received for ${payload.patientName}. Type: ${payload.serviceType}`);
};

export const updateEmergencyStatus = async (id: string, updates: Partial<Pick<EmergencyRequest, 'status' | 'resolvedBy' | 'resolvedAt' | 'dispatchedUnitId'>>) => {
    // This function will be needed in a future step to manage the incident lifecycle
};
