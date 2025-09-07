
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import { type LabRequest, LabRequestStatus } from './types';
import { addLog } from './logs';

const labRequestsCollectionRef = collection(db, 'labRequests');


// --- Pre-defined Sample Lab Requests for Seeding ---
const sampleLabRequests: Omit<LabRequest, 'id' | 'requestedAt'>[] = [
    {
        patientId: '2',
        patientName: 'John Doe',
        testName: 'Complete Blood Count (CBC)',
        status: 'Pending',
        requestType: 'Routine',
        sampleType: 'Blood',
        sampleStatus: 'Collected',
        requestedBy: 'Dr. Chen',
    },
    {
        patientId: '2',
        patientName: 'Jane Smith',
        testName: 'Lipid Panel',
        status: 'Pending',
        requestType: 'Follow-up',
        sampleType: 'Blood',
        sampleStatus: 'Not Collected',
        requestedBy: 'Dr. Patel',
    }
];

// --- Seeding Function (run once if needed, e.g., in a development setup script) ---
export const seedLabRequests = async () => {
    // This is a simple seeding function. In a real app, you might want to
    // check if data already exists to avoid duplication.
    console.log("Seeding lab requests...");
    const batch = writeBatch(db);
    sampleLabRequests.forEach(req => {
        const docRef = doc(labRequestsCollectionRef);
        batch.set(docRef, { ...req, requestedAt: new Date().toISOString() });
    });
    await batch.commit();
    console.log("Seeding complete.");
}


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

// Function to add a new lab request
export const addLabRequest = async (payload: Omit<LabRequest, 'id' | 'status' | 'requestedAt'>) => {
    try {
        await addDoc(labRequestsCollectionRef, {
            ...payload,
            status: 'Pending',
            requestedAt: new Date().toISOString()
        });
        addLog('INFO', `New lab request created for ${payload.patientName} - ${payload.testName}`);
    } catch (error) {
        console.error("Error creating lab request:", error);
        addLog('ERROR', `Failed to create lab request for ${payload.patientName}. Error: ${error}`);
    }
};

