
'use client';

import { useState, useEffect } from 'react';
import { type Product } from "@/lib/types";
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// --- Client-side Hook for Real-time Updates ---
export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const productsCollection = collection(db, 'products');
        const q = query(productsCollection, orderBy('name'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData: Product[] = [];
            querySnapshot.forEach(doc => {
                productsData.push({ id: doc.id, ...doc.data() } as Product);
            });
            setProducts(productsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setIsLoading(false);
        });

        // Seed functionality is handled by server-side fetching now, 
        // so we don't need to call it here. We just subscribe to changes.
        
        return () => unsubscribe();
    }, []);

    return { products, isLoading };
};
