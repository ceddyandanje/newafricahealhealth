
'use client';

import { type Log, type LogLevel } from './types';
import initialLogs from './data/logs.json';

const LOGS_STORAGE_KEY = 'app-logs';

export const getAllLogs = (): Log[] => {
    if (typeof window === 'undefined') {
        return initialLogs as Log[];
    }
    try {
        const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
        if (storedLogs) {
            return JSON.parse(storedLogs);
        } else {
            localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(initialLogs));
            return initialLogs as Log[];
        }
    } catch (error) {
        console.error('Error reading logs from localStorage:', error);
        return initialLogs as Log[];
    }
};

export const saveAllLogs = (logs: Log[]) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
        console.error('Error writing logs to localStorage:', error);
    }
};

export const addLog = (level: LogLevel, message: string) => {
    const logs = getAllLogs();
    const newLog: Log = {
        id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
        level,
        message,
        timestamp: new Date().toISOString(),
    };
    const updatedLogs = [...logs, newLog];
    saveAllLogs(updatedLogs);
};
