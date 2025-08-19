
import { type BlogPost } from "@/lib/types";

// Curated list of articles from the World Health Organization (WHO)
// The local content and slug are no longer the primary focus.
// The main functionality is linking out to the externalUrl.
const whoArticles: Omit<BlogPost, 'id' | 'slug' | 'content'>[] = [
    {
        title: 'Cardiovascular diseases',
        description: 'An overview of cardiovascular diseases (CVDs), the leading cause of death globally. Learn about risk factors and prevention.',
        image: 'https://placehold.co/870x489.png',
        dataAiHint: 'healthy heart',
        category: 'Heart Health',
        date: '2024-05-17T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)'
    },
    {
        title: 'Diabetes',
        description: 'Understand the different types of diabetes, its health impact, and key strategies for prevention and management.',
        image: 'https://placehold.co/870x580.png',
        dataAiHint: 'blood sugar test',
        category: 'Diabetes Care',
        date: '2024-04-05T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/diabetes'
    },
    {
        title: 'Chronic respiratory diseases',
        description: 'Learn about chronic respiratory diseases like COPD and asthma, which affect hundreds of millions of people worldwide.',
        image: 'https://placehold.co/870x580.png',
        dataAiHint: 'person breathing',
        category: 'Respiratory Health',
        date: '2024-05-16T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/chronic-respiratory-diseases'
    },
     {
        title: 'Chronic kidney disease',
        description: 'An in-depth look at chronic kidney disease, its causes, and how it can be managed to improve patient outcomes.',
        image: 'https://placehold.co/870x580.png',
        dataAiHint: 'kidney medical',
        category: 'Kidney Health',
        date: '2024-03-14T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/chronic-kidney-disease'
    },
    {
        title: 'Neurological disorders',
        description: 'Neurological disorders are diseases of the central and peripheral nervous system. Learn more about these complex conditions.',
        image: 'https://placehold.co/870x580.png',
        dataAiHint: 'brain scan',
        category: 'Neurology',
        date: '2024-04-25T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/neurological-disorders'
    },
    {
        title: 'Fact sheet on Organ Transplantation',
        description: 'Key facts about organ transplantation from WHO, covering global practices, safety, and ethical considerations.',
        image: 'https://placehold.co/870x580.png',
        dataAiHint: 'surgical team',
        category: 'Transplants',
        date: '2023-07-26T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/organ-transplantation'
    },
    {
        title: 'Healthy diet',
        description: 'A healthy diet is essential for good health and nutrition. It protects you against many chronic noncommunicable diseases.',
        image: 'https://placehold.co/870x580.png',
        dataAiHint: 'healthy food',
        category: 'General Wellness',
        date: '2024-04-28T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
    },
    {
        title: 'Physical activity',
        description: 'Regular physical activity is proven to help prevent and manage noncommunicable diseases such as heart disease and diabetes.',
        image: 'https://placehold.co/870x580.png',
        dataAiHint: 'person jogging',
        category: 'Fitness',
        date: '2023-10-05T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity'
    },
];

// --- Static Data Provider ---
// This function now prepares the articles with a unique ID and a placeholder slug/content.
export const getAllPosts = async (): Promise<BlogPost[]> => {
    const processedPosts: BlogPost[] = whoArticles.map((post, index) => ({
        ...post,
        id: `who-${index}`,
        slug: post.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
        content: post.description, // Placeholder content
    }));
    return processedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// getPostBySlug is no longer needed for the new functionality but is kept to prevent build errors
// in case it's referenced somewhere unexpectedly. It will not be used by the new blog page.
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const posts = await getAllPosts();
    const post = posts.find(p => p.slug === slug);
    return post || null;
};

// The Firestore-related functions are no longer needed for this implementation.
// They can be removed or kept for a future 'internal blog' feature. For now, we'll keep them.
import { db } from './firebase';
import { collection, doc, writeBatch, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { addLog } from './logs';

const blogCollection = collection(db, 'blog');

export const seedPosts = async () => {
    // This seeding is now for internal posts, not the WHO feed.
};
export const addPost = async (post: Omit<BlogPost, 'id' | 'externalUrl'>) => {
    return await addDoc(blogCollection, post);
};
export const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    const docRef = doc(db, 'blog', id);
    return await updateDoc(docRef, updates);
};
export const deletePost = async (id: string) => {
    const docRef = doc(db, 'blog', id);
    return await deleteDoc(docRef);
};
