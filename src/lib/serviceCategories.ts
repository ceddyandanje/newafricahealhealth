
import { 
    Heart, Bandage, Activity, ShieldQuestion, Stethoscope, Dna, Leaf, Bed, User, Brain, Syringe, Baby, Eye, Bone, Ear, Beaker, CircleUser, ShieldPlus, Cog, Star, Wind, HeartPulse 
} from 'lucide-react';

export type ServiceCategory = {
    id: string;
    name: string;
    icon: React.ElementType;
};

export const serviceCategories: ServiceCategory[] = [
    { id: 'allergy-immunology', name: 'Allergy and Immunology', icon: ShieldQuestion },
    { id: 'anesthesiology', name: 'Anesthesiology', icon: Syringe },
    { id: 'cardiology', name: 'Cardiology', icon: Heart },
    { id: 'colon-rectal-surgery', name: 'Colon and Rectal Surgery', icon: Stethoscope }, // Using Stethoscope as a generic surgery icon
    { id: 'dermatology', name: 'Dermatology', icon: Bandage },
    { id: 'emergency-medicine', name: 'Emergency Medicine', icon: HeartPulse },
    { id: 'family-medicine', name: 'Family Medicine', icon: User },
    { id: 'forensic-pathology', name: 'Forensic Pathology', icon: Beaker },
    { id: 'general-surgery', name: 'General Surgery', icon: Stethoscope },
    { id: 'genetics-genomics', name: 'Genetics and Genomics', icon: Dna },
    { id: 'hospice-palliative', name: 'Hospice and Palliative', icon: Leaf },
    { id: 'hospital-medicine', name: 'Hospital Medicine', icon: Bed },
    { id: 'internal-medicine', name: 'Internal Medicine', icon: User },
    { id: 'neurology', name: 'Neurology', icon: Brain },
    { id: 'neurological-surgery', name: 'Neurological Surgery', icon: Brain },
    { id: 'obstetrics-gynecology', name: 'Obstetrics and Gynecology', icon: Baby },
    { id: 'ophthalmic-surgery', name: 'Ophthalmic Surgery', icon: Eye },
    { id: 'orthopaedic-surgery', name: 'Orthopaedic Surgery', icon: Bone },
    { id: 'otolaryngology', name: 'Otolaryngology', icon: Ear },
    { id: 'pathology', name: 'Pathology', icon: Beaker },
    { id: 'pediatrics', name: 'Pediatrics', icon: Baby },
    { id: 'physical-medicine', name: 'Physical Medicine', icon: Activity },
    { id: 'plastic-surgery', name: 'Plastic Surgery', icon: Star },
    { id: 'preventive-medicine', name: 'Preventive Medicine', icon: ShieldPlus },
    { id: 'psychiatry', name: 'Psychiatry', icon: Cog },
    { id: 'radiology', name: 'Radiology', icon: Wind }, // Using Wind to represent rays/scans
    { id: 'rheumatology', name: 'Rheumatology', icon: Bone },
];
