
'use client';

import { type RefillRequest } from './types';
import initialRequests from './data/refillRequests.json';
import { useLocalStorage } from '@/hooks/use-local-storage';

// This is now a hook that provides live-synced requests
export const useRequests = () => {
    return useLocalStorage<RefillRequest[]>('app-refill-requests', initialRequests as RefillRequest[]);
};

// The functions below are for components that cannot use hooks
const getRequestsSnapshot = (): RefillRequest[] => {
    if (typeof window === 'undefined') {
        return initialRequests as RefillRequest[];
    }
    const stored = localStorage.getItem('app-refill-requests');
    return stored ? JSON.parse(stored) : (initialRequests as RefillRequest[]);
}

const saveRequestsSnapshot = (requests: RefillRequest[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('app-refill-requests', JSON.stringify(requests));
    window.dispatchEvent(new StorageEvent('storage', { key: 'app-refill-requests' }));
}

type NewRequestPayload = {
    patientId: string;
    patientName: string;
    prescriptionId: string;
    medicationName: string;
}

export const addRequest = (payload: NewRequestPayload) => {
    const requests = getRequestsSnapshot();
    const newRequest: RefillRequest = {
        id: `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        patientId: payload.patientId,
        patientName: payload.patientName,
        prescriptionId: payload.prescriptionId,
        medicationName: payload.medicationName,
        requestDate: new Date().toISOString(),
        status: 'Pending',
        paymentStatus: 'Unpaid'
    };
    const updatedRequests = [newRequest, ...requests];
    saveRequestsSnapshot(updatedRequests);
};
