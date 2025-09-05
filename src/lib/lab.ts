
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { type LabRequest, LabRequestStatus } from './types';
import { addLog } from './logs';

const labRequestsCollectionRef = collection(db, 'labRequests');

// Hook to fetch lab requests in real-time
export const useLabRequests = () => {
    const [requests, setRequests] = useState<LabRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(labRequestsCollectionRef, orderBy('requestedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestsData: LabRequest[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LabRequest));
            setRequests(requestsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching lab requests:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { requests, isLoading };
};


// Function to update the status of a lab request
export const updateLabRequestStatus = async (id: string, status: LabRequestStatus) => {
    const requestDoc = doc(db, 'labRequests', id);
    const updates: Partial<LabRequest> = { status };
    if (status === 'Completed') {
        updates.completedAt = new Date().toISOString();
        // In a real app, you would also handle the result file upload here
        updates.resultUrl = '#'; // Placeholder
    }
    await updateDoc(requestDoc, updates);
};
