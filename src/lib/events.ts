
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, getDocs, writeBatch } from 'firebase/firestore';
import { type DayEvent } from './types';

// Hardcoded sample events
const sampleEvents: Omit<DayEvent, 'id'>[] = [
    { type: "medication", title: "Take Metformin", time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(), status: "Done" },
    { type: "measurement", title: "Log Blood Sugar", time: new Date(new Date().setHours(8, 5, 0, 0)).toISOString(), status: "Due" },
    { type: "appointment", title: "Dr. Chen's Appointment", time: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(), status: "Upcoming" },
];

// Function to seed events for a specific user IF they don't have any
const seedUserEvents = async (userId: string) => {
    const eventsCollectionRef = collection(db, 'users', userId, 'events');
    const snapshot = await getDocs(eventsCollectionRef);

    if (snapshot.empty) {
        console.log(`No events found for user ${userId}. Seeding sample events.`);
        const batch = writeBatch(db);
        sampleEvents.forEach(eventData => {
            const newEventRef = doc(eventsCollectionRef); // Create a new doc with a random ID
            batch.set(newEventRef, eventData);
        });
        await batch.commit();
        console.log('Sample events seeded successfully.');
    } else {
        console.log(`User ${userId} already has events. No seeding needed.`);
    }
}

// Hook to fetch real-time events for a specific user
export const useEvents = (userId?: string) => {
    const [events, setEvents] = useState<DayEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        // Seed data for the specific test user if needed
        if (userId === '2') { // Assuming '2' is the ID for 'user@example.com'
             seedUserEvents(userId);
        }

        const eventsCollectionRef = collection(db, 'users', userId, 'events');
        const q = query(eventsCollectionRef, orderBy('time'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsData: DayEvent[] = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() } as DayEvent);
            });
            setEvents(eventsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching events:", error);
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [userId]);

    return { events, isLoading };
};
