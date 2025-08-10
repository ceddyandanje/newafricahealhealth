
'use client';

import { type Log, type LogLevel } from './types';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useState, useEffect, useCallback } from 'react';

// Custom hook to fetch logs from Firestore in real-time
export const useLogs = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const logsCollection = collection(db, 'logs');
    const q = query(logsCollection, orderBy('timestamp', 'desc'), limit(100));

    const fetchLogs = useCallback(async () => {
        const logSnapshot = await getDocs(q);
        const logList = logSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
        setLogs(logList);
    }, [q]);

    useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
            setLogs(logList);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [q]);

    return { logs, setLogs, refetch: fetchLogs };
};

// Function to add a new log document to Firestore
export const addLog = async (level: LogLevel, message: string) => {
    try {
        await addDoc(collection(db, 'logs'), {
            level,
            message,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error adding log to Firestore: ", error);
    }
};
