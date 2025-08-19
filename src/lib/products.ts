
import { type Product } from "@/lib/types";
import { db } from './firebase';
import { collection, doc, getDocs, writeBatch, addDoc, updateDoc, deleteDoc, query, orderBy, getDoc } from 'firebase/firestore';

const staticProducts: Omit<Product, 'id'>[] = [
  {
    name: "Digital Blood Pressure Monitor",
    description: "Easy-to-use automatic wrist blood pressure monitor for reliable tracking of your cardiovascular health at home.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1620955634992-93e606ebd865?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "blood pressure monitor",
    category: "Cardiovascular",
    brand: "MediTech",
    tags: ["featured", "health monitoring"],
  },
  {
    name: "Portable Nebulizer",
    description: "Compact and silent mesh nebulizer for respiratory treatments, ideal for managing asthma or COPD on the go.",
    price: 7800,
    image: "https://images.unsplash.com/photo-1631590497334-a84803ec581a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "portable nebulizer",
    category: "Respiratory",
    brand: "Respira",
    tags: ["respiratory"],
  },
  {
    name: "Smart Pill Organizer",
    description: "An electronic pill box with reminders and tracking to ensure you never miss a dose of your vital medication.",
    price: 3200,
    image: "https://images.unsplash.com/photo-1631899924208-886828453303?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "pill organizer",
    category: "Chronic Care",
    brand: "PharmaCare",
    tags: ["medication management"],
  },
  {
    name: "Advanced First-Aid Kit",
    description: "Comprehensive 150-piece first-aid kit designed for handling common injuries and minor emergencies.",
    price: 5500,
    image: "https://images.unsplash.com/photo-1564762287292-2865e9340523?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "first aid kit",
    category: "Emergency Response",
    brand: "RescueReady",
    tags: ["featured", "emergency"],
  },
  {
    name: "Emergency Tourniquet",
    description: "A military-grade combat application tourniquet for rapid, one-handed application to stop severe bleeding.",
    price: 2500,
    image: "https://plus.unsplash.com/premium_photo-1678839002206-89ce7f05f32a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "medical tourniquet",
    category: "Emergency Response",
    brand: "RescueReady",
    tags: ["trauma care"],
  },
  {
    name: "Personal CPR Face Shield",
    description: "A compact, single-use CPR mask with a one-way valve, essential for any emergency kit.",
    price: 500,
    image: "https://plus.unsplash.com/premium_photo-1678839002061-e1529a67977a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "cpr mask",
    category: "Emergency Response",
    brand: "RescueReady",
    tags: ["safety"],
  },
  {
    name: "Medical Travel Insurance Plan",
    description: "Specialized travel insurance covering medical emergencies, trip cancellations, and complications during medical tourism.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1560520450-4d241295325b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "travel insurance document",
    category: "Medical Tourism",
    brand: "GlobalGuard",
    tags: ["travel"],
  },
  {
    name: "Compression Socks for Travel",
    description: "High-quality compression stockings to improve circulation and reduce the risk of DVT during long flights.",
    price: 2800,
    image: "https://images.unsplash.com/photo-1616422289691-41395697a39b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "compression socks",
    category: "Medical Tourism",
    brand: "MediTech",
    tags: ["travel", "comfort"],
  },
  {
    name: "Post-Transplant Care Package",
    description: "A curated package including immunosuppressant medication organizers, sterile wound care supplies, and health monitoring tools.",
    price: 12500,
    image: "https://plus.unsplash.com/premium_photo-1664303499426-d66a246d6b6e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "medical care package",
    category: "Organ Transplants",
    brand: "PharmaCare",
    tags: ["featured", "post-op"],
  },
  {
    name: "Tacrolimus (Immunosuppressant)",
    description: "Prescription medication to prevent organ rejection after a transplant. Requires a valid prescription.",
    price: 9800,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "prescription medicine bottle",
    category: "Organ Transplants",
    brand: "PharmaCare",
    tags: ["prescription"],
  },
  {
    name: "Insulin Cooling Travel Case",
    description: "A portable, temperature-controlled case for safely transporting insulin and other temperature-sensitive medications.",
    price: 4200,
    image: "https://images.unsplash.com/photo-1628359230229-873645842839?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "insulin travel case",
    category: "Diabetes Care",
    brand: "MediTech",
    tags: ["diabetes", "travel"],
  },
  {
    name: "Cholesterol Test Strips (50 ct.)",
    description: "High-accuracy test strips for use with digital cholesterol monitors. Provides fast results for total cholesterol.",
    price: 3500,
    image: "https://plus.unsplash.com/premium_photo-1678297334708-875c753381a1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dataAiHint: "test strips box",
    category: "Cardiovascular",
    brand: "MediHealth",
    tags: ["health monitoring"],
  },
  {
    name: 'Baby Nasal Aspirator',
    description: 'A gentle and effective electric nasal aspirator to clear your baby\'s stuffy nose quickly and safely.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1622290242138-02404744d95b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'nasal aspirator baby',
    category: 'Pediatrics',
    brand: 'LittleNose',
    tags: ['baby care', 'featured'],
  },
  {
    name: 'Digital Baby Scale',
    description: 'Track your baby\'s growth with this accurate and easy-to-use digital scale, featuring a comfortable, secure tray.',
    price: 6500,
    image: 'https://plus.unsplash.com/premium_photo-1664298282307-e261783852f4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'digital baby scale',
    category: 'Pediatrics',
    brand: 'GrowWell',
    tags: ['baby care', 'health monitoring'],
  },
  {
    name: 'Hypoallergenic Baby Wipes (3-Pack)',
    description: 'Extra soft and gentle wipes for sensitive skin, made with 99% pure water. Fragrance and alcohol-free.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1596464716123-289b73415a9b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'baby wipes pack',
    category: 'Pediatrics',
    brand: 'PureBaby',
    tags: ['baby care'],
  },
  {
    name: 'Medicated Eczema Cream',
    description: 'A clinically proven cream that provides immediate and long-lasting relief from itching and irritation caused by eczema.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1620917669793-02913511855e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'skincare cream tube',
    category: 'Dermatology',
    brand: 'Dermacure',
    tags: ['skincare', 'featured'],
  },
  {
    name: 'Broad-Spectrum SPF 50+ Sunscreen',
    description: 'A non-greasy, water-resistant sunscreen providing high protection against UVA and UVB rays for all skin types.',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1556228723-839a92401765?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'sunscreen bottle',
    category: 'Dermatology',
    brand: 'SunSafe',
    tags: ['skincare', 'sun protection'],
  },
  {
    name: 'Acne Treatment Gel with Salicylic Acid',
    description: 'A fast-acting spot treatment gel to reduce the size and redness of pimples and prevent future breakouts.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1620917669809-1f97a2f5a34e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'acne gel tube',
    category: 'Dermatology',
    brand: 'ClearSkin',
    tags: ['skincare', 'acne'],
  },
  {
    name: 'Lubricating Eye Drops for Dry Eyes',
    description: 'Provides long-lasting relief for dry, irritated eyes. Preservative-free and safe for use with contact lenses.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1607958066597-9a67e7c8a0a9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'eye drops bottle',
    category: 'Ophthalmology',
    brand: 'ClearView',
    tags: ['eye care', 'featured'],
  },
  {
    name: 'Heated Eye Mask for Styes and Dry Eyes',
    description: 'A reusable, microwave-activated warming compress that helps relieve symptoms of styes, MGD, and blepharitis.',
    price: 3200,
    image: 'https://plus.unsplash.com/premium_photo-1678839002161-5511e6955a5b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'heated eye mask',
    category: 'Ophthalmology',
    brand: 'ThermaEyes',
    tags: ['eye care', 'therapy'],
  },
  {
    name: 'Prescription Eyeglass Cleaning Kit',
    description: 'A complete kit with anti-static cleaning spray and a microfiber cloth for keeping your glasses crystal clear.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1560762458-4f04c6052296?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'eyeglass cleaning spray',
    category: 'Ophthalmology',
    brand: 'LensPro',
    tags: ['eye care'],
  },
  {
    name: 'Arthritis Pain Relief Gel',
    description: 'A fast-acting topical gel that provides deep, penetrating relief from arthritis pain, stiffness, and inflammation.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1620917669784-5f5c8a5c4c2f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'pain relief gel',
    category: 'Arthritis',
    brand: 'JointFlex',
    tags: ['pain relief', 'featured'],
  },
  {
    name: 'Glucosamine & Chondroitin Supplement',
    description: 'A daily supplement designed to support joint health, lubrication, and flexibility for those with arthritis.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1567982269539-2a41a49a942b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'supplement bottle',
    category: 'Arthritis',
    brand: 'PharmaCare',
    tags: ['joint support'],
  },
  {
    name: 'Compression Gloves for Arthritis',
    description: 'Provides gentle compression to reduce pain, swelling, and stiffness in the hands and wrists.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1599493356233-d716f73d523c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'compression gloves',
    category: 'Arthritis',
    brand: 'MediTech',
    tags: ['support'],
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
