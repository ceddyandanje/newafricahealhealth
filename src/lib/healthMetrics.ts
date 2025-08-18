
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, getDocs, writeBatch, addDoc } from 'firebase/firestore';
import { type HealthMetric } from './types';

// Hardcoded sample metrics for blood sugar
const sampleMetrics: Omit<HealthMetric, 'id'>[] = [
    { type: "bloodSugar", value: 140, timestamp: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString() },
    { type: "bloodSugar", value: 135, timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
    { type: "bloodSugar", value: 150, timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString() },
    { type: "bloodSugar", value: 142, timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
    { type: "bloodSugar", value: 160, timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
    { type: "bloodSugar", value: 155, timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
    { type: "bloodSugar", value: 148, timestamp: new Date().toISOString() },
    { type: "weight", value: 85, timestamp: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString() },
    { type: "weight", value: 85.5, timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
    { type: "weight", value: 84, timestamp: new Date().toISOString() },
    { type: "bloodPressure", value: 120, value2: 80, timestamp: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString() },
    { type: "bloodPressure", value: 122, value2: 81, timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString() },
    { type: "bloodPressure", value: 125, value2: 85, timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
];

// Function to seed metrics for a specific user IF they don't have any
const seedUserMetrics = async (userId: string) => {
    const metricsCollectionRef = collection(db, 'users', userId, 'healthMetrics');
    const snapshot = await getDocs(metricsCollectionRef);

    if (snapshot.empty) {
        console.log(`No metrics found for user ${userId}. Seeding sample metrics.`);
        const batch = writeBatch(db);
        sampleMetrics.forEach(metricData => {
            const newMetricRef = doc(metricsCollectionRef);
            batch.set(newMetricRef, metricData);
        });
        await batch.commit();
        console.log('Sample metrics seeded successfully.');
    } else {
        console.log(`User ${userId} already has metrics. No seeding needed.`);
    }
}

// Hook to fetch real-time metrics for a specific user
export const useHealthMetrics = (userId?: string) => {
    const [metrics, setMetrics] = useState<HealthMetric[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        // Ensure sample data exists for the test user
        if (userId === '2') { // Assuming '2' is the ID for 'user@example.com'
             seedUserMetrics(userId);
        }

        const metricsCollectionRef = collection(db, 'users', userId, 'healthMetrics');
        const q = query(metricsCollectionRef, orderBy('timestamp'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const metricsData: HealthMetric[] = [];
            querySnapshot.forEach((doc) => {
                metricsData.push({ id: doc.id, ...doc.data() } as HealthMetric);
            });
            setMetrics(metricsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching health metrics:", error);
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [userId]);

    return { metrics, isLoading };
};

// Function to add a new health metric
export const addHealthMetric = async (userId: string, metric: Omit<HealthMetric, 'id'>) => {
    try {
        const metricsCollectionRef = collection(db, 'users', userId, 'healthMetrics');
        await addDoc(metricsCollectionRef, metric);
    } catch (error) {
        console.error("Error adding health metric:", error);
    }
};

    