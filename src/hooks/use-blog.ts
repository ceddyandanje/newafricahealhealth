
'use client';

import { useState, useEffect } from 'react';
import { type BlogPost } from "@/lib/types";
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const blogCollection = collection(db, 'blog');

// --- Client-side Hook for Real-time Updates (for Admin Panel) ---
export const useBlogPosts = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(blogCollection, orderBy('date', 'desc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData: BlogPost[] = [];
            querySnapshot.forEach(doc => {
                postsData.push({ id: doc.id, ...doc.data() } as BlogPost);
            });
            setPosts(postsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching blog posts:", error);
            setIsLoading(false);
        });
        
        return () => unsubscribe();
    }, []);

    return { posts, isLoading };
};
