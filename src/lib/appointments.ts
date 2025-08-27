
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { type Appointment } from './types';

const appointmentsCollectionRef = collection(db, 'appointments');

// Hook to fetch appointments. 
// If forAdmin is true, it fetches all appointments.
// Otherwise, it fetches for a specific patient.
export const useAppointments = (forAdmin = false, patientId?: string) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!forAdmin && !patientId) {
            setIsLoading(false);
            return;
        }

        let q;
        if (forAdmin) {
            q = query(appointmentsCollectionRef, orderBy('appointmentDate', 'desc'));
        } else {
            q = query(appointmentsCollectionRef, where('patientId', '==', patientId), orderBy('appointmentDate', 'desc'));
        }
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appointmentsData: Appointment[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
            setAppointments(appointmentsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching appointments:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [forAdmin, patientId]);

    return { appointments, isLoading };
};
