

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

export type UserRole = 'admin' | 'user' | 'delivery-driver' | 'emergency-services' | 'doctor';
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
    id: number;
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


export type DayEventType = 'medication' | 'appointment' | 'measurement';

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


