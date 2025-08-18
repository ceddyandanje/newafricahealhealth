

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents
  image: string;
  category: string;
  brand: string;
  tags?: string[];
  dataAiHint: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type UserRole = 'admin' | 'user' | 'delivery-driver' | 'emergency-services' | 'doctor' | 'lab-technician';
export type UserStatus = 'active' | 'inactive' | 'on-hold';

export type User = {
    id: string;
    name: string;
    email: string;
    password?: string; // It's optional as we might not always send it to the client
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    avatarUrl?: string;
    location?: string;
    age?: string;
    phone?: string;
    specialty?: string; // For doctors
    vehicleType?: 'motorbike' | 'car' | 'van' | 'bicycle' | 'other'; // For delivery drivers
    labSpecialty?: 'Hematology' | 'Microbiology' | 'Biochemistry' | 'Pathology'; // For lab technicians
    emergencyUnit?: string; // For emergency services
    certificationLevel?: 'EMT' | 'Paramedic' | 'First Responder';
};

export type LoginCredentials = Pick<User, 'email' | 'password'>;
export type SignUpCredentials = Pick<User, 'name' | 'email' | 'password' | 'location' | 'age' | 'phone'>;


export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
export type Log = {
    id: string;
    timestamp: string;
    level: LogLevel;
    message: string;
};


export type NotificationType = 'new_appointment' | 'message' | 'system_update' | 'lab_results' | 'info' | 'product_update' | 'blog_update' | 'service_update' | 'default';

export type Notification = {
    id: string; // Firestore document ID
    recipientId: string; // The ID of the user or role (e.g., 'admin_role') this is for
    type: NotificationType;
    title: string;
    description: string;
    time: string; // ISO 8601 string
    read: boolean;
};


export type RefillRequest = {
    id: string;
    patientId: string;
    patientName: string;
    prescriptionId: string;
    medicationName: string;
    requestDate: string; // ISO 8601 string
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    approverId?: string;
    approverName?: string;
    paymentStatus: 'Unpaid' | 'Paid';
  };


export type DayEvent = {
    id: string;
    type: DayEventType;
    title: string;
    time: string; // ISO 8601 string
    status: 'Done' | 'Due' | 'Upcoming';
};

export type MedicalProfile = {
  bloodType: string;
  allergies: string;
  primaryPhysician: string;
  address: string;
  height?: number; // Height in cm
  emergencyContact: {
    name: string;
    phone: string;
  };
};

export type RoadmapTaskStatus = 'Todo' | 'In Progress' | 'Done';
export type RoadmapTaskCategory = 'Core Feature' | 'AI & Automation' | 'UI/UX' | 'Security' | 'Other';

export type RoadmapTask = {
    id: string;
    title: string;
    description: string;
    status: RoadmapTaskStatus;
    category: RoadmapTaskCategory;
    createdAt: string; // ISO 8601 string
};

export type HealthMetricType = 'bloodSugar' | 'bloodPressure' | 'weight' | 'heartRate' | 'oxygenSaturation' | 'bmi';

export type HealthMetric = {
    id: string;
    type: HealthMetricType; 
    value: number; // For single-value metrics or systolic BP
    value2?: number; // For diastolic BP
    timestamp: string; // ISO 8601 string
};

export type BlogPost = {
    id: string; // Firestore document ID
    slug: string;
    title: string;
    description: string;
    image: string;
    dataAiHint: string;
    category: string;
    date: string; // ISO 8601 string
    content: string; // HTML content
};

export type DayEventType = 'medication' | 'appointment' | 'measurement';

export type Availability = {
    id: string; // e.g., '2024-10-28'
    doctorId: string;
    isAvailable: boolean;
    slots: string[];
};


    