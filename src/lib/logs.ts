
'use client';

import { type Log, type LogLevel } from './types';
import initialLogs from './data/logs.json';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Dispatch, SetStateAction } from 'react';

// This is now a hook that provides live-synced logs
export const useLogs = (): [Log[], Dispatch<SetStateAction<Log[]>>] => {
    return useLocalStorage<Log[]>( 'app-logs', initialLogs as Log[]);
};


// The functions below are for components that cannot use hooks (e.g., non-component files)
// They will write to localStorage, and the hook will pick up the changes.

const getLogsSnapshot = (): Log[] => {
    if (typeof window === 'undefined') {
        return initialLogs as Log[];
    }
    const storedLogs = localStorage.getItem('app-logs');
    return storedLogs ? JSON.parse(storedLogs) : (initialLogs as Log[]);
}

const saveLogsSnapshot = (logs: Log[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('app-logs', JSON.stringify(logs));
    window.dispatchEvent(new StorageEvent('storage', { key: 'app-logs' }));
}

export const addLog = (level: LogLevel, message: string) => {
    const logs = getLogsSnapshot();
    const newLog: Log = {
        id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
        level,
        message,
        timestamp: new Date().toISOString(),
    };
    const updatedLogs = [...logs, newLog];
    saveLogsSnapshot(updatedLogs);
};
