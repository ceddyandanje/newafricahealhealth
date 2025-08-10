
'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, getDocs, writeBatch, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { type RoadmapTask, RoadmapTaskStatus } from './types';
import initialTasks from './data/roadmap.json';
import { addLog } from './logs';

// Function to seed tasks if the collection is empty
const seedRoadmapTasks = async () => {
    const tasksCollectionRef = collection(db, 'roadmap');
    const snapshot = await getDocs(tasksCollectionRef);

    if (snapshot.empty) {
        console.log("No roadmap tasks found. Seeding initial tasks.");
        addLog('INFO', 'Roadmap collection is empty. Seeding initial tasks.');
        const batch = writeBatch(db);
        initialTasks.forEach(taskData => {
            const taskRef = doc(db, 'roadmap', taskData.id); // Use the ID from JSON
            batch.set(taskRef, taskData);
        });
        await batch.commit();
        console.log('Roadmap tasks seeded successfully.');
    } else {
        console.log('Roadmap tasks already exist. No seeding needed.');
    }
}

// Hook to fetch real-time tasks from Firestore
export const useRoadmapTasks = () => {
    const [tasks, setTasks] = useState<RoadmapTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const seedAndFetch = async () => {
            await seedRoadmapTasks(); // Ensure data exists

            const tasksCollectionRef = collection(db, 'roadmap');
            const q = query(tasksCollectionRef, orderBy('createdAt'));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tasksData: RoadmapTask[] = [];
                querySnapshot.forEach((doc) => {
                    tasksData.push({ id: doc.id, ...doc.data() } as RoadmapTask);
                });
                setTasks(tasksData);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching roadmap tasks:", error);
                setIsLoading(false);
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        };
        
        seedAndFetch();

    }, []);

    return { tasks, isLoading, setTasks };
};

// CRUD functions for managing tasks
export const addTask = async (task: Omit<RoadmapTask, 'id' | 'createdAt'>) => {
    const newTaskRef = await addDoc(collection(db, 'roadmap'), {
        ...task,
        createdAt: new Date().toISOString()
    });
    addLog('INFO', `New roadmap task added: "${task.title}" (ID: ${newTaskRef.id})`);
};

export const updateTaskStatus = async (taskId: string, status: RoadmapTaskStatus) => {
    const taskRef = doc(db, 'roadmap', taskId);
    await updateDoc(taskRef, { status });
    addLog('INFO', `Roadmap task (ID: ${taskId}) status updated to ${status}.`);
};

export const deleteTask = async (taskId: string) => {
    const taskRef = doc(db, 'roadmap', taskId);
    await deleteDoc(taskRef);
    addLog('WARN', `Roadmap task (ID: ${taskId}) was deleted.`);
};
