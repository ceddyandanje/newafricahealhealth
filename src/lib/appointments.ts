
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, getDocs, writeBatch, doc } from 'firebase/firestore';
import { type Appointment } from './types';

const sampleAppointments: Omit<Appointment, 'id'>[] = [
    { 
        appointmentId: 'APT001', 
        patientId: 'user-id-1', 
        patientName: 'John Doe', 
        patientAvatar: 'https://i.pravatar.cc/150?u=p1',
        doctorId: 'doctor-id-1', 
        doctorName: 'Dr. Smith', 
        appointmentDate: new Date('2023-10-27T10:00:00').toISOString(), 
        type: 'Virtual Consultation', 
        status: 'Confirmed' 
    },
    { 
        appointmentId: 'APT002', 
        patientId: 'user-id-2', 
        patientName: 'Jane Smith', 
        patientAvatar: 'https://i.pravatar.cc/150?u=p2',
        doctorId: 'doctor-id-2', 
        doctorName: 'Dr. Jones', 
        appointmentDate: new Date('2023-10-27T11:30:00').toISOString(), 
        type: 'Follow-up', 
        status: 'Pending' 
    },
    { 
        appointmentId: 'APT003', 
        patientId: 'user-id-3', 
        patientName: 'Peter Pan', 
        patientAvatar: 'https://i.pravatar.cc/150?u=p3',
        doctorId: 'doctor-id-1', 
        doctorName: 'Dr. Smith', 
        appointmentDate: new Date('2023-10-28T14:00:00').toISOString(), 
        type: 'Lab Results Review', 
        status: 'Cancelled' 
    },
    { 
        appointmentId: 'APT004', 
        patientId: 'user-id-4', 
        patientName: 'Mary Poppins', 
        patientAvatar: 'https://i.pravatar.cc/150?u=p4',
        doctorId: 'doctor-id-3', 
        doctorName: 'Dr. Brown', 
        appointmentDate: new Date('2023-10-29T09:00:00').toISOString(), 
        type: 'Annual Check-up', 
        status: 'Completed' 
    },
];


const appointmentsCollectionRef = collection(db, 'appointments');

const seedAppointments = async () => {
    const snapshot = await getDocs(appointmentsCollectionRef);
    if (snapshot.empty) {
        console.log('Appointments collection is empty. Seeding data...');
        const batch = writeBatch(db);
        sampleAppointments.forEach(appt => {
            const docRef = doc(appointmentsCollectionRef);
            batch.set(docRef, appt);
        });
        await batch.commit();
        console.log('Appointments seeded successfully.');
    }
}

// Hook to fetch appointments for the admin dashboard
export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const seedAndFetch = async () => {
            await seedAppointments(); // Ensure data exists

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
        }
        seedAndFetch();
    }, []);

    return { appointments, isLoading };
};
