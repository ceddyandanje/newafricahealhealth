

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
  stock: number;
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
    termsAccepted?: boolean;
    smsAlertsEnabled?: boolean;
};

export type LoginCredentials = {
    email: string;
    password; string;
}
export type SignUpCredentials = Pick<User, 'name' | 'email' | 'location' | 'age' | 'phone'>;


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
    actionDate?: string;
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
    externalUrl?: string; // URL to the original article
};

export type DayEventType = 'medication' | 'appointment' | 'measurement';

export type Availability = {
    id: string; // e.g., '2024-10-28'
    doctorId: string;
    isAvailable: boolean;
    slots: string[];
};

export type OrderStatus = 'Pending Verification' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'On Hold';

export type Order = {
    id: string; // Firestore ID
    orderId: string; // Human-readable ID like AHH-123456
    userId: string;
    name: string;
    email: string;
    address: string;
    city: string;
    items: CartItem[];
    totalPrice: number; // in cents
    status: OrderStatus;
    mpesaCode: string;
    createdAt: string; // ISO 8601 string
    updatedAt: string; // ISO 8601 string
};

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'Confirmed' | 'Pending';

export type Appointment = {
    id: string; // Firestore ID
    appointmentId: string; // Human-readable ID like APT001
    patientId: string;
    patientName: string;
    patientAvatar?: string;
    doctorId: string;
    doctorName: string;
    appointmentDate: string; // ISO String for date and time
    type: string; // e.g., 'Virtual Consultation'
    status: AppointmentStatus;
    notes?: string;
};

export type EmergencyServiceType = 'First Aid' | 'Ground Ambulance' | 'Air Ambulance';
export type EmergencyStatus = 'Pending' | 'Acknowledged' | 'Unit Dispatched' | 'On Scene' | 'Resolved' | 'Cancelled';


export type EmergencyRequest = {
  id: string; // Firestore ID
  userId?: string; // Optional if non-user requests
  userName: string;
  patientName: string;
  serviceType: EmergencyServiceType;
  location: {
    latitude: number;
    longitude: number;
  };
  bloodGroup?: string;
  allergies?: string;
  situationDescription?: string;
  status: EmergencyStatus;
  createdAt: string; // ISO String
  updatedAt?: string; // ISO String
  responderId?: string; // ID of the dispatcher who first handles the request
  dispatchedUnitId?: string;
  resolvedBy?: string; // ID of the user who resolved the incident
  resolvedAt?: string; // ISO String
};

export type EmergencyUnit = {
    id: string; // Firestore ID
    providerId: string; // ID of the emergency-services user
    type: 'Ground' | 'Air' | 'Motorbike Medic' | 'Other';
    licensePlate: string;
    capacity: number;
    responseTime: number; // in minutes
    hasLifeSupport: boolean;
    status: 'Available' | 'En Route' | 'At Scene' | 'Transporting' | 'At Hospital' | 'Unavailable';
    stationedLocation: string;
    createdAt: string;
    updatedAt: string;
};

export type LabRequestStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type LabRequestType = 'Routine' | 'Urgent' | 'Pre-Op' | 'Follow-up';
export type SampleType = 'Blood' | 'Urine' | 'Saliva' | 'Tissue' | 'Other';
export type SampleStatus = 'Collected' | 'Not Collected' | 'In Transit';

export type LabRequest = {
    id: string; // Firestore ID
    patientId: string;
    patientName: string;
    testName: string;
    status: LabRequestStatus;
    requestedAt: string; // ISO String
    completedAt?: string; // ISO String
    resultUrl?: string; // Link to the PDF/file in Firebase Storage
    requestType: LabRequestType;
    reason?: string;
    sampleType: SampleType;
    sampleStatus: SampleStatus;
    requestedBy: string; // e.g., 'Dr. Smith' or 'Patient Request'
};

    