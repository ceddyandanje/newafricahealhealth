
'use client';

import { type Log, type LogLevel } from './types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Custom hook to fetch logs from Firestore
export const useLogs = (): [Log[], Dispatch<SetStateAction<Log[]>>] => {
    const [logs, setLogs] = useState<Log[]>([]);
    
    useEffect(() => {
        const fetchLogs = async () => {
            const logsCollection = collection(db, 'logs');
            const q = query(logsCollection, orderBy('timestamp', 'desc'), limit(100));
            const logSnapshot = await getDocs(q);
            const logList = logSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
            setLogs(logList);
        };

        fetchLogs();
    }, []);

    return [logs, setLogs];
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
