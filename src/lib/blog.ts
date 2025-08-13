
import { type BlogPost } from "@/lib/types";
import { db } from './firebase';
import { collection, doc, getDocs, onSnapshot, writeBatch, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { addLog } from './logs';

const staticBlogPosts: Omit<BlogPost, 'id'>[] = [
    {
        slug: 'benefits-of-moringa',
        title: 'The Amazing Health Benefits of Moringa',
        description: 'Discover why this superfood is a game-changer for your health, packed with vitamins, minerals, and antioxidants.',
        image: 'https://placehold.co/1200x600.png',
        dataAiHint: 'moringa leaves',
        category: 'Superfoods',
        date: '2023-10-26T10:00:00Z',
        content: `
<p>Moringa oleifera, often called the "drumstick tree" or "miracle tree," has been used for centuries for its medicinal properties and health benefits. Native to the sub-Himalayan areas of India, Pakistan, Bangladesh, and Afghanistan, it is now grown across the tropics.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">Rich in Nutrients</h3>
<p>Moringa leaves are an excellent source of many vitamins and minerals. One cup of fresh, chopped leaves (21 grams) contains:</p>
<ul class="list-disc list-inside my-4 space-y-1">
  <li><strong>Protein:</strong> 2 grams</li>
  <li><strong>Vitamin B6:</strong> 19% of the RDA</li>
  <li><strong>Vitamin C:</strong> 12% of the RDA</li>
  <li><strong>Iron:</strong> 11% of the RDA</li>
  <li><strong>Riboflavin (B2):</strong> 11% of the RDA</li>
  <li><strong>Vitamin A (from beta-carotene):</strong> 9% of the RDA</li>
  <li><strong>Magnesium:</strong> 8% of the RDA</li>
</ul>
<p>The dried leaves are often sold as dietary supplements, either in powder or capsule form.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">Powerful Antioxidants</h3>
<p>Antioxidants are compounds that act against free radicals in your body. High levels of free radicals may lead to oxidative stress, which is associated with chronic diseases like heart disease and type 2 diabetes. Several antioxidant plant compounds have been found in the leaves of Moringa oleifera. In addition to vitamin C and beta-carotene, these include Quercetin and Chlorogenic acid.</p>
`
    },
    {
        slug: 'natural-skincare-guide',
        title: 'A Guide to Natural Skincare with Shea Butter and Black Soap',
        description: 'Learn how to nourish your skin with traditional African ingredients for a radiant, healthy glow.',
        image: 'https://placehold.co/1200x600.png',
        dataAiHint: 'shea butter skincare',
        category: 'Skincare',
        date: '2023-10-22T10:00:00Z',
        content: `
<p>For generations, African ingredients like shea butter and black soap have been staples in beauty regimens. Their natural healing and moisturizing properties make them perfect for a simple, effective skincare routine.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">The Magic of Shea Butter</h3>
<p>Shea butter is a fat extracted from the nuts of the shea tree. It's rich in vitamins A, E, and F, and offers UV protection (it is SPF ~6). It provides the skin with essential fatty acids and the nutrients necessary for collagen production.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">African Black Soap</h3>
<p>Authentic African black soap is made from the ash of locally harvested plants and barks such as plantain, cocoa pods, palm tree leaves, and shea tree bark. It's known for its ability to cleanse, exfoliate, and fight acne without stripping the skin of its natural oils. It's a gentle, all-natural alternative to harsh chemical cleansers.</p>
`
    },
];

const blogCollection = collection(db, 'blog');

// --- One-time Data Seeding ---
const seedPosts = async () => {
    const snapshot = await getDocs(blogCollection);
    if (snapshot.empty) {
        console.log('Blog collection is empty. Seeding data...');
        addLog('INFO', 'Blog collection is empty. Seeding initial posts.');
        const batch = writeBatch(db);
        staticBlogPosts.forEach(post => {
            const docRef = doc(blogCollection); // Let Firestore generate ID
            batch.set(docRef, post);
        });
        await batch.commit();
        console.log('Blog posts seeded successfully.');
    } else {
        console.log('Blog collection already has data. No seeding needed.');
    }
};

// --- Server-side Data Fetching ---
export const getAllPosts = async (): Promise<BlogPost[]> => {
    await seedPosts(); // Ensure data is seeded before fetching if needed
    const snapshot = await getDocs(query(blogCollection, orderBy('date', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    await seedPosts(); // Ensure data is seeded before fetching
    const q = query(blogCollection, where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
};

// --- CRUD Functions for Admin Panel ---
export const addPost = async (post: Omit<BlogPost, 'id'>) => {
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
