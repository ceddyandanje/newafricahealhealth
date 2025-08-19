

import { type Product } from "@/lib/types";
import { db } from './firebase';
import { collection, doc, getDocs, writeBatch, addDoc, updateDoc, deleteDoc, query, orderBy, getDoc } from 'firebase/firestore';

const staticProducts: Omit<Product, 'id'>[] = [
  {
    name: "Digital Blood Pressure Monitor",
    description: "Easy-to-use automatic wrist blood pressure monitor for reliable tracking of your cardiovascular health at home.",
    price: 450000,
    image: "https://images.unsplash.com/photo-1616027393583-1d625346e92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxibG9vJTIwcHJlc3N1cmUlMjBtb25pdG9yfGVufDB8fHx8MTc1NDE5NDQzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "blood pressure monitor",
    category: "Cardiovascular",
    brand: "MediTech",
    tags: ["featured", "health monitoring"],
  },
  {
    name: "Portable Nebulizer",
    description: "Compact and silent mesh nebulizer for respiratory treatments, ideal for managing asthma or COPD on the go.",
    price: 780000,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0YWJsZSUyMG5lYnVsZXplcnxlbnwwfHx8fDE3NTQxOTQ0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "portable nebulizer",
    category: "Respiratory",
    brand: "Respira",
    tags: ["respiratory"],
  },
  {
    name: "Smart Pill Organizer",
    description: "An electronic pill box with reminders and tracking to ensure you never miss a dose of your vital medication.",
    price: 320000,
    image: "https://images.unsplash.com/photo-1631549921209-a7970a27e3e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwaWxsJTIwb3JnYW5pemVyfGVufDB8fHx8MTc1NDE5NDQ0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "pill organizer",
    category: "Chronic Care",
    brand: "PharmaCare",
    tags: ["medication management"],
  },
  {
    name: "Advanced First-Aid Kit",
    description: "Comprehensive 150-piece first-aid kit designed for handling common injuries and minor emergencies.",
    price: 550000,
    image: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaXJzdCUyMGFpZCUyMGtpdHxlbnwwfHx8fDE3NTQxOTQ0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "first aid kit",
    category: "Emergency Response",
    brand: "RescueReady",
    tags: ["featured", "emergency"],
  },
  {
    name: "Emergency Tourniquet",
    description: "A military-grade combat application tourniquet for rapid, one-handed application to stop severe bleeding.",
    price: 250000,
    image: "https://images.unsplash.com/photo-1618938228695-364245644421?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdG91cm5pcXVldHxlbnwwfHx8fDE3NTQxOTQ0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "medical tourniquet",
    category: "Emergency Response",
    brand: "RescueReady",
    tags: ["trauma care"],
  },
  {
    name: "Personal CPR Face Shield",
    description: "A compact, single-use CPR mask with a one-way valve, essential for any emergency kit.",
    price: 50000,
    image: "https://plus.unsplash.com/premium_photo-1661769390234-8c8052f68903?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjcHIlMjBtYXNrfGVufDB8fHx8MTc1NDE5NDQ0NHww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "cpr mask",
    category: "Emergency Response",
    brand: "RescueReady",
    tags: ["safety"],
  },
  {
    name: "Medical Travel Insurance Plan",
    description: "Specialized travel insurance covering medical emergencies, trip cancellations, and complications during medical tourism.",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1560520653-9e2e60b9ea1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBpbnN1cmFuY2UlMjBkb2N1bWVudHxlbnwwfHx8fDE3NTQxOTQ0NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "travel insurance document",
    category: "Medical Tourism",
    brand: "GlobalGuard",
    tags: ["travel"],
  },
  {
    name: "Compression Socks for Travel",
    description: "High-quality compression stockings to improve circulation and reduce the risk of DVT during long flights.",
    price: 280000,
    image: "https://images.unsplash.com/photo-1606813907291-d86e97d37a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb21wcmVzc2lvbiUyMHNvY2tzfGVufDB8fHx8MTc1NDE5NDQ0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "compression socks",
    category: "Medical Tourism",
    brand: "MediTech",
    tags: ["travel", "comfort"],
  },
  {
    name: "Post-Transplant Care Package",
    description: "A curated package including immunosuppressant medication organizers, sterile wound care supplies, and health monitoring tools.",
    price: 1250000,
    image: "https://images.unsplash.com/photo-1603048589922-8d388c3a115e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2FyZSUyMHBhY2thZ2V8ZW58MHx8fHwxNzU0MTk0NDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "medical care package",
    category: "Organ Transplants",
    brand: "PharmaCare",
    tags: ["featured", "post-op"],
  },
  {
    name: "Tacrolimus (Immunosuppressant)",
    description: "Prescription medication to prevent organ rejection after a transplant. Requires a valid prescription.",
    price: 980000,
    image: "https://images.unsplash.com/photo-1584308666744-8480404b63ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcmVzY3JpcHRpb24lMjBtZWRpY2luZSUyMGJvdHRsZXxlbnwwfHx8fDE3NTQxOTQ0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "prescription medicine bottle",
    category: "Organ Transplants",
    brand: "PharmaCare",
    tags: ["prescription"],
  },
  {
    name: "Insulin Cooling Travel Case",
    description: "A portable, temperature-controlled case for safely transporting insulin and other temperature-sensitive medications.",
    price: 420000,
    image: "https://plus.unsplash.com/premium_photo-1678112195828-56f731115e84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbnN1bGluJTIwdHJhdmVsJTIwY2FzZXxlbnwwfHx8fDE3NTQxOTQ0NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "insulin travel case",
    category: "Diabetes Care",
    brand: "MediTech",
    tags: ["diabetes", "travel"],
  },
  {
    name: "Cholesterol Test Strips (50 ct.)",
    description: "High-accuracy test strips for use with digital cholesterol monitors. Provides fast results for total cholesterol.",
    price: 350000,
    image: "https://images.unsplash.com/photo-1627483262294-a2b1b3b2b2b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0ZXN0JTIwc3RyaXBzJTIwYm94fGVufDB8fHx8MTc1NDE5NDQ1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "test strips box",
    category: "Cardiovascular",
    brand: "MediHealth",
    tags: ["health monitoring"],
  },
  {
    name: 'Baby Nasal Aspirator',
    description: 'A gentle and effective electric nasal aspirator to clear your baby\'s stuffy nose quickly and safely.',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1599406859344-933658252273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuYXNhbCUyMGFzcGlyYXRvciUyMGJhYnl8ZW58MHx8fHwxNzU0MTk0NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'nasal aspirator baby',
    category: 'Pediatrics',
    brand: 'LittleNose',
    tags: ['baby care', 'featured'],
  },
  {
    name: 'Digital Baby Scale',
    description: 'Track your baby\'s growth with this accurate and easy-to-use digital scale, featuring a comfortable, secure tray.',
    price: 650000,
    image: 'https://plus.unsplash.com/premium_photo-1664302175249-11b05869a84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYmFieSUyMHNjYWxlfGVufDB8fHx8MTc1NDE5NDQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'digital baby scale',
    category: 'Pediatrics',
    brand: 'GrowWell',
    tags: ['baby care', 'health monitoring'],
  },
  {
    name: 'Hypoallergenic Baby Wipes (3-Pack)',
    description: 'Extra soft and gentle wipes for sensitive skin, made with 99% pure water. Fragrance and alcohol-free.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1560942485-0679b08a54a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwd2lwZXMlMjBwYWNrfGVufDB8fHx8MTc1NDE5NDQ1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'baby wipes pack',
    category: 'Pediatrics',
    brand: 'PureBaby',
    tags: ['baby care'],
  },
  {
    name: 'Medicated Eczema Cream',
    description: 'A clinically proven cream that provides immediate and long-lasting relief from itching and irritation caused by eczema.',
    price: 220000,
    image: 'https://images.unsplash.com/photo-1629117621997-84252b41178b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNyZWFtJTIwdHViZXxlbnwwfHx8fDE3NTQxOTQ0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'skincare cream tube',
    category: 'Dermatology',
    brand: 'Dermacure',
    tags: ['skincare', 'featured'],
  },
  {
    name: 'Broad-Spectrum SPF 50+ Sunscreen',
    description: 'A non-greasy, water-resistant sunscreen providing high protection against UVA and UVB rays for all skin types.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1580477673528-9f2d5924b40e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdW5zY3JlZW4lMjBib3R0bGV8ZW58MHx8fHwxNzU0MTk0NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'sunscreen bottle',
    category: 'Dermatology',
    brand: 'SunSafe',
    tags: ['skincare', 'sun protection'],
  },
  {
    name: 'Acne Treatment Gel with Salicylic Acid',
    description: 'A fast-acting spot treatment gel to reduce the size and redness of pimples and prevent future breakouts.',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1629117621997-84252b41178b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhY25lJTIwZ2VsJTIwdHViZXxlbnwwfHx8fDE3NTQxOTQ0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'acne gel tube',
    category: 'Dermatology',
    brand: 'ClearSkin',
    tags: ['skincare', 'acne'],
  },
  {
    name: 'Lubricating Eye Drops for Dry Eyes',
    description: 'Provides long-lasting relief for dry, irritated eyes. Preservative-free and safe for use with contact lenses.',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1607958058249-a6e45340673f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxleWUlMjBkcm9wcyUyMGJvdHRsZXxlbnwwfHx8fDE3NTQxOTQ0NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'eye drops bottle',
    category: 'Ophthalmology',
    brand: 'ClearView',
    tags: ['eye care', 'featured'],
  },
  {
    name: 'Heated Eye Mask for Styes and Dry Eyes',
    description: 'A reusable, microwave-activated warming compress that helps relieve symptoms of styes, MGD, and blepharitis.',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1628191011802-b24e6a457a1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    dataAiHint: 'heated eye mask',
    category: 'Ophthalmology',
    brand: 'ThermaEyes',
    tags: ['eye care', 'therapy'],
  },
  {
    name: 'Prescription Eyeglass Cleaning Kit',
    description: 'A complete kit with anti-static cleaning spray and a microfiber cloth for keeping your glasses crystal clear.',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1614208691522-7722745a7664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxleWVnbGFzcyUyMGNsZWFuaW5nJTIwc3ByYXl8ZW58MHx8fHwxNzU0MTk0NDYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'eyeglass cleaning spray',
    category: 'Ophthalmology',
    brand: 'LensPro',
    tags: ['eye care'],
  },
  {
    name: 'Arthritis Pain Relief Gel',
    description: 'A fast-acting topical gel that provides deep, penetrating relief from arthritis pain, stiffness, and inflammation.',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1629117621997-84252b41178b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwYWluJTIwcmVsaWVmJTIwZ2VsfGVufDB8fHx8fDE3NTQxOTQ0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'pain relief gel',
    category: 'Arthritis',
    brand: 'JointFlex',
    tags: ['pain relief', 'featured'],
  },
  {
    name: 'Glucosamine & Chondroitin Supplement',
    description: 'A daily supplement designed to support joint health, lubrication, and flexibility for those with arthritis.',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1627483262294-a2b1b3b2b2b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdXBwbGVtZW50JTIwYm90dGxlfGVufDB8fHx8fDE3NTQxOTQ0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'supplement bottle',
    category: 'Arthritis',
    brand: 'PharmaCare',
    tags: ['joint support'],
  },
  {
    name: 'Compression Gloves for Arthritis',
    description: 'Provides gentle compression to reduce pain, swelling, and stiffness in the hands and wrists.',
    price: 220000,
    image: 'https://images.unsplash.com/photo-1606813907291-d86e97d37a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb21wcmVzc2lvbiUyMGdsb3Zlc3xlbnwwfHx8fDE3NTQxOTQ0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'compression gloves',
    category: 'Arthritis',
    brand: 'MediTech',
    tags: ['support'],
  },
  {
    name: 'Sterile Surgical Scalpels (Box of 10)',
    description: 'High-grade stainless steel disposable scalpels for precision surgical procedures. Individually wrapped and sterilized.',
    price: 300000,
    image: 'https://images.unsplash.com/photo-1588776848248-53508898493a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdXJnaWNhbCUyMHNjYWxwZWx8ZW58MHx8fHwxNzE5MjM0MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'surgical scalpel',
    category: 'Surgical Equipment',
    brand: 'SurgiPro',
    tags: ['instruments'],
  },
  {
    name: 'Hemostatic Forceps (Kelly)',
    description: 'Durable, locking hemostatic forceps for clamping vessels and holding tissues during surgery. Stainless steel, 5.5 inch.',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1630919245849-035b6f3c05c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdXJnaWNhbCUyMGZvcmNlcHN8ZW58MHx8fHwxNzE5MjM0MjcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'surgical forceps',
    category: 'Surgical Equipment',
    brand: 'SurgiPro',
    tags: ['instruments', 'featured'],
  },
  {
    name: 'Sterile Surgical Gloves (Box of 100)',
    description: 'Latex-free, powder-free surgical gloves providing excellent tactile sensitivity and barrier protection.',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1606813907291-d86e97d37a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdXJnaWNhbCUyMGdsb3Zlc3xlbnwwfHx8fDE3MTkyMzQyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'surgical gloves',
    category: 'Surgical Equipment',
    brand: 'GloveGuard',
    tags: ['disposables'],
  }
];

// Fallback static products for initial load or if Firestore is unavailable
export const products: Product[] = staticProducts.map((p, i) => ({ id: `P${i + 1}`, ...p }));

const productsCollection = collection(db, 'products');

// --- One-time Data Seeding ---
export const seedProducts = async () => {
    const snapshot = await getDocs(productsCollection);
    if (snapshot.empty) {
        console.log('Products collection is empty. Seeding data...');
        const batch = writeBatch(db);
        staticProducts.forEach(product => {
            const docRef = doc(productsCollection); // Let Firestore generate ID
            batch.set(docRef, product);
        });
        await batch.commit();
        console.log('Products seeded successfully.');
    } else {
        console.log('Products collection already has data. No seeding needed.');
    }
};

// --- Server-side Data Fetching ---
export const getAllProducts = async (): Promise<Product[]> => {
    try {
        await seedProducts(); // Ensure data is seeded before fetching if needed
        const snapshot = await getDocs(query(productsCollection, orderBy('name')));
        if (snapshot.empty) {
            // Fallback to static data if Firestore is empty after attempting to seed
            return products;
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.warn("Could not fetch products from Firestore, using static data. Error:", error);
        return products;
    }
};

export const getProduct = async (id: string): Promise<Product | undefined> => {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        }
    } catch (error) {
        console.warn(`Could not fetch product ${id} from Firestore, falling back to static data. Error:`, error);
    }
    // Fallback to static data
    return products.find(p => p.id === id);
};


// --- CRUD Functions for Admin Panel ---
export const addProduct = async (product: Omit<Product, 'id'>) => {
    return await addDoc(productsCollection, product);
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
    const docRef = doc(db, 'products', id);
    return await updateDoc(docRef, updates);
};

export const deleteProduct = async (id: string) => {
    const docRef = doc(db, 'products', id);
    return await deleteDoc(docRef);
};


// --- Utility functions that can run on both server and client ---
export const getBrands = (products: Product[]) => [...new Set(products.map(p => p.brand))];
export const getCategories = (products: Product[]) => [...new Set(products.map(p => p.category))];
export const getMaxPrice = (products: Product[]) => products.length > 0 ? Math.max(...products.map(p => p.price)) : 15000;
