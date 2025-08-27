
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, where, addDoc, doc, updateDoc, limit } from 'firebase/firestore';
import { type EmergencyRequest, type EmergencyStatus } from './types';
import { addLog } from './logs';

const emergencyCollectionRef = collection(db, 'emergencies');

// Hook to fetch emergency requests. Can fetch all active or only pending.
export const useEmergencyRequests = (fetchAllActive = false) => {
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
            
            if (fetchAllActive) {
                // Return all requests that are not resolved or cancelled
                const activeRequests = allRecentRequests.filter(req => req.status !== 'Resolved' && req.status !== 'Cancelled');
                setRequests(activeRequests);
            } else {
                // Default behavior: only return pending requests
                const pendingRequests = allRecentRequests.filter(req => req.status === 'Pending');
                setRequests(pendingRequests);
            }
            
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching emergency requests:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [fetchAllActive]);

    return { requests, isLoading };
};


// Hook to fetch incident history for a specific provider
export const useIncidentHistory = (responderId?: string) => {
    const [incidents, setIncidents] = useState<EmergencyRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!responderId) {
            setIsLoading(false);
            return;
        }

        // This requires a composite index on responderId (asc) and createdAt (desc)
        const q = query(
            emergencyCollectionRef,
            where('responderId', '==', responderId),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const incidentsData: EmergencyRequest[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyRequest));
            setIncidents(incidentsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching incident history:", error);
            addLog("ERROR", `Firestore query failed for incident history. Check indexes for responderId. Details: ${error.message}`);
            setIsLoading(false);
        });

        return () => unsubscribe();

    }, [responderId]);
    
    return { incidents, isLoading };
}


type NewRequestPayload = Omit<EmergencyRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

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

export const updateEmergencyStatus = async (id: string, updates: Partial<EmergencyRequest>) => {
    const emergencyDoc = doc(db, 'emergencies', id);
    await updateDoc(emergencyDoc, {
        ...updates,
        updatedAt: new Date().toISOString(),
    });
};
