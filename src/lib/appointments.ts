
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { type Appointment } from './types';

const appointmentsCollectionRef = collection(db, 'appointments');

// Hook to fetch appointments for the admin dashboard
export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(appointmentsCollectionRef, orderBy('appointmentDate', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appointmentsData: Appointment[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
            setAppointments(appointmentsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching appointments:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { appointments, isLoading };
};
