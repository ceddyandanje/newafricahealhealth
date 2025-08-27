
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { type EmergencyUnit } from './types';

// Hook to get a real-time list of units for a specific provider
export const useFleet = (providerId?: string) => {
    const [units, setUnits] = useState<EmergencyUnit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!providerId) {
            setIsLoading(false);
            return;
        }

        const unitsCollectionRef = collection(db, 'users', providerId, 'units');
        const q = query(unitsCollectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const unitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyUnit));
            setUnits(unitsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching fleet units:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [providerId]);

    return { units, isLoading };
};

// CRUD functions for managing fleet units

type UnitPayload = Omit<EmergencyUnit, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>;

export const addUnit = async (providerId: string, unitData: UnitPayload) => {
    const unitsCollectionRef = collection(db, 'users', providerId, 'units');
    const now = new Date().toISOString();
    await addDoc(unitsCollectionRef, {
        ...unitData,
        providerId,
        createdAt: now,
        updatedAt: now,
    });
};

export const updateUnit = async (providerId: string, unitId: string, updates: Partial<UnitPayload>) => {
    const unitRef = doc(db, 'users', providerId, 'units', unitId);
    await updateDoc(unitRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
    });
};

export const deleteUnit = async (providerId: string, unitId: string) => {
    const unitRef = doc(db, 'users', providerId, 'units', unitId);
    await deleteDoc(unitRef);
};
