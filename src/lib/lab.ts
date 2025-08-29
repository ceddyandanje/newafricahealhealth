
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, getDocs, writeBatch, addDoc } from 'firebase/firestore';
import { type LabRequest, LabRequestStatus } from './types';
import { addLog } from './logs';

const labRequestsCollectionRef = collection(db, 'labRequests');

// Sample data for seeding
const sampleLabRequests: Omit<LabRequest, 'id'>[] = [
  { patientId: 'user-1', patientName: 'John Doe', testName: 'Complete Blood Count (CBC)', status: 'Pending', requestedAt: new Date(new Date().setDate(new Date().getDate() -1)).toISOString() },
  { patientId: 'user-2', patientName: 'Jane Smith', testName: 'Lipid Panel', status: 'Pending', requestedAt: new Date().toISOString() },
  { patientId: 'user-3', patientName: 'Peter Jones', testName: 'Thyroid Panel (TSH, T3, T4)', status: 'In Progress', requestedAt: new Date(new Date().setDate(new Date().getDate() -2)).toISOString() },
  { patientId: 'user-4', patientName: 'Mary Williams', testName: 'Basic Metabolic Panel (BMP)', status: 'Completed', requestedAt: new Date(new Date().setDate(new Date().getDate() -3)).toISOString(), completedAt: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(), resultUrl: '#' },
];

// Function to seed lab requests if the collection is empty
const seedLabRequests = async () => {
    const snapshot = await getDocs(labRequestsCollectionRef);

    if (snapshot.empty) {
        console.log("No lab requests found. Seeding sample requests.");
        addLog('INFO', 'Lab requests collection is empty. Seeding initial data.');
        const batch = writeBatch(db);
        sampleLabRequests.forEach(requestData => {
            const newRequestRef = doc(labRequestsCollectionRef);
            batch.set(newRequestRef, requestData);
        });
        await batch.commit();
        console.log('Sample lab requests seeded successfully.');
    } else {
        console.log('Lab requests already exist. No seeding needed.');
    }
}


// Hook to fetch lab requests in real-time
export const useLabRequests = () => {
    const [requests, setRequests] = useState<LabRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const seedAndFetch = async () => {
            await seedLabRequests();

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
        }
        seedAndFetch();
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

