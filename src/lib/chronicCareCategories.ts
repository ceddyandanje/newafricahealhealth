
import { Heart, Droplets, Wind, Filter, Bone, Brain } from 'lucide-react';
import { type ServiceCategory } from './serviceCategories';

export interface ChronicCareCategory extends ServiceCategory {
    description: string;
}

export const chronicCareCategories: ChronicCareCategory[] = [
    { 
        id: 'cardiovascular', 
        name: 'Cardiovascular Health', 
        icon: Heart,
        description: 'Support for hypertension, high cholesterol, and other heart-related conditions.'
    },
    { 
        id: 'diabetes-care', 
        name: 'Diabetes Care', 
        icon: Droplets,
        description: 'A full range of supplies, from monitoring devices to insulin and medication.'
    },
    { 
        id: 'respiratory-conditions', 
        name: 'Respiratory Conditions', 
        icon: Wind,
        description: 'Management for asthma, COPD, and other respiratory ailments with medication and devices.'
    },
    { 
        id: 'kidney-disease', 
        name: 'Kidney Disease', 
        icon: Filter,
        description: 'Support for chronic kidney disease (CKD) including medication and monitoring supplies.'
    },
    { 
        id: 'arthritis', 
        name: 'Arthritis', 
        icon: Bone,
        description: 'Pain management solutions and support for various forms of arthritis.'
    },
    { 
        id: 'neurological-disorders', 
        name: 'Neurological Disorders', 
        icon: Brain,
        description: 'Medication and support for conditions like epilepsy, Parkinson\'s, and multiple sclerosis.'
    },
];
