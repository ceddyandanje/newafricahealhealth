
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, where, addDoc } from 'firebase/firestore';
import { type Appointment } from './types';

const appointmentsCollectionRef = collection(db, 'appointments');

// Hook to fetch appointments. 
// If forAdmin is true, it fetches all appointments.
// If a doctorId is provided, it fetches appointments for that doctor.
// Otherwise, it fetches for a specific patient.
export const useAppointments = (forAdmin = false, userId?: string) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!forAdmin && !userId) {
            setIsLoading(false);
            setAppointments([]); // Clear appointments if no user
            return;
        }

        let q;
        if (forAdmin) {
            q = query(appointmentsCollectionRef, orderBy('appointmentDate', 'desc'));
        } else {
            // Determine if the user is a patient or a doctor to query the correct field
            const userRoleField = userId && userId.startsWith('doc-') ? 'doctorId' : 'patientId';
            q = query(appointmentsCollectionRef, where(userRoleField, '==', userId), orderBy('appointmentDate', 'desc'));
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
    }, [forAdmin, userId]);

    return { appointments, isLoading };
};

// Function to add a new appointment
export const addAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    try {
        await addDoc(appointmentsCollectionRef, appointmentData);
    } catch (error) {
        console.error("Error adding appointment:", error);
        throw error;
    }
};
