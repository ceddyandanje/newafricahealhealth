
import { type BlogPost } from "@/lib/types";

// Curated list of articles from the World Health Organization (WHO)
// The local content and slug are no longer the primary focus.
// The main functionality is linking out to the externalUrl.
const whoArticles: Omit<BlogPost, 'id' | 'slug' | 'content'>[] = [
    {
        title: 'Cardiovascular diseases',
        description: 'An overview of cardiovascular diseases (CVDs), the leading cause of death globally. Learn about risk factors and prevention.',
        image: 'https://images.unsplash.com/photo-1623942289163-837887373f62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        dataAiHint: 'healthy heart',
        category: 'Heart Health',
        date: '2024-05-17T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)'
    },
    {
        title: 'Diabetes',
        description: 'Understand the different types of diabetes, its health impact, and key strategies for prevention and management.',
        image: 'https://images.unsplash.com/photo-1522040432323-9944a6f477e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        dataAiHint: 'blood sugar test',
        category: 'Diabetes Care',
        date: '2024-04-05T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/diabetes'
    },
    {
        title: 'Chronic respiratory diseases',
        description: 'Learn about chronic respiratory diseases like COPD and asthma, which affect hundreds of millions of people worldwide.',
        image: 'https://images.unsplash.com/photo-1604015343469-536767b6d6f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        dataAiHint: 'person breathing',
        category: 'Respiratory Health',
        date: '2024-05-16T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/chronic-respiratory-diseases'
    },
     {
        title: 'Chronic kidney disease',
        description: 'An in-depth look at chronic kidney disease, its causes, and how it can be managed to improve patient outcomes.',
        image: 'https://images.unsplash.com/photo-1599494324393-52c424a737a4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        dataAiHint: 'kidney medical',
        category: 'Kidney Health',
        date: '2024-03-14T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/chronic-kidney-disease'
    },
    {
        title: 'Neurological disorders',
        description: 'Neurological disorders are diseases of the central and peripheral nervous system. Learn more about these complex conditions.',
        image: 'https://images.unsplash.com/photo-1550428499-033c4a29a008?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        dataAiHint: 'brain scan',
        category: 'Neurology',
        date: '2024-04-25T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/neurological-disorders'
    },
    {
        title: 'Fact sheet on Organ Transplantation',
        description: 'Key facts about organ transplantation from WHO, covering global practices, safety, and ethical considerations.',
        image: 'https://images.unsplash.com/photo-1582719471384-894c86c97e54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        dataAiHint: 'surgical team',
        category: 'Transplants',
        date: '2023-07-26T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/organ-transplantation'
    },
    {
        title: 'Healthy diet',
        description: 'A healthy diet is essential for good health and nutrition. It protects you against many chronic noncommunicable diseases.',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17025?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        dataAiHint: 'healthy food',
        category: 'General Wellness',
        date: '2024-04-28T10:00:00Z',
        externalUrl: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
    },
    {
        title: 'Physical activity',
        description: 'Regular physical activity is proven to help prevent and manage noncommunicable diseases such as heart disease and diabetes.',
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80',
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
