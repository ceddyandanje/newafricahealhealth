
import { 
    Heart, Bandage, Activity, ShieldQuestion, Stethoscope, Dna, Leaf, Bed, User, Brain, Syringe, Baby, Eye, Bone, Ear, Beaker, CircleUser, ShieldPlus, Cog, Star, Wind, HeartPulse 
} from 'lucide-react';

export type ServiceCategory = {
    id: string;
    name: string;
    icon: React.ElementType;
};

export const serviceCategories: ServiceCategory[] = [
    { id: 'allergy-immunology', name: 'Allergist / Immunologist', icon: ShieldQuestion },
    { id: 'anesthesiology', name: 'Anesthesiologist', icon: Syringe },
    { id: 'cardiology', name: 'Cardiologist', icon: Heart },
    { id: 'colon-rectal-surgery', name: 'Colorectal Surgeon', icon: Stethoscope },
    { id: 'dermatology', name: 'Dermatologist', icon: Bandage },
    { id: 'emergency-medicine', name: 'Emergency Medicine Physician', icon: HeartPulse },
    { id: 'family-medicine', name: 'Family Medicine Physician', icon: User },
    { id: 'forensic-pathology', name: 'Forensic Pathologist', icon: Beaker },
    { id: 'general-surgery', name: 'General Surgeon', icon: Stethoscope },
    { id: 'genetics-genomics', name: 'Geneticist', icon: Dna },
    { id: 'hospice-palliative', name: 'Palliative Care Specialist', icon: Leaf },
    { id: 'hospital-medicine', name: 'Hospitalist', icon: Bed },
    { id: 'internal-medicine', name: 'Internist', icon: User },
    { id: 'neurology', name: 'Neurologist', icon: Brain },
    { id: 'neurological-surgery', name: 'Neurosurgeon', icon: Brain },
    { id: 'obstetrics-gynecology', name: 'Obstetrician/Gynecologist (OB/GYN)', icon: Baby },
    { id: 'ophthalmic-surgery', name: 'Ophthalmologist', icon: Eye },
    { id: 'orthopaedic-surgery', name: 'Orthopaedic Surgeon', icon: Bone },
    { id: 'otolaryngology', name: 'Otolaryngologist (ENT)', icon: Ear },
    { id: 'pathology', name: 'Pathologist', icon: Beaker },
    { id: 'pediatrics', name: 'Pediatrician', icon: Baby },
    { id: 'physical-medicine', name: 'Physiatrist', icon: Activity },
    { id: 'plastic-surgery', name: 'Plastic Surgeon', icon: Star },
    { id: 'preventive-medicine', name: 'Preventive Medicine Specialist', icon: ShieldPlus },
    { id: 'psychiatry', name: 'Psychiatrist', icon: Cog },
    { id: 'radiology', name: 'Radiologist', icon: Wind },
    { id: 'rheumatology', name: 'Rheumatologist', icon: Bone },
];
