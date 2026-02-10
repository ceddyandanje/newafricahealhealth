# Africa Heal Health 🏥

A comprehensive healthcare platform designed to provide reliable medical solutions, chronic care management, emergency response services, and medical tourism support for patients across Africa.

## Overview

Africa Heal Health is a modern web application built with Next.js and Firebase that connects patients with healthcare services, products, and AI-powered health assistance. The platform offers an intuitive interface for browsing medical products, managing subscriptions, booking appointments, and accessing emergency medical services.

## Key Features

- **🛒 E-commerce Platform**: Browse and purchase healthcare products with an integrated shopping cart and checkout system
- **🤖 AI Health Assistant**: Get personalized health recommendations powered by Google's Gemini AI
- **💊 Chronic Care Management**: Specialized support for diabetes, cardiovascular diseases, kidney disease, and more
- **🚑 Emergency Services**: Quick access to emergency medical response and ambulance services
- **✈️ Medical Tourism**: Coordinate international medical treatments and organ transplants
- **👨‍⚕️ Doctor Consultations**: Book appointments and connect with healthcare professionals
- **📋 Prescription Upload**: Upload and manage prescriptions with OCR support
- **💳 Subscription Services**: Recurring medication deliveries and wellness programs
- **📱 Responsive Design**: Glassmorphic UI with light/dark mode support
- **🔒 Secure**: Role-based access control with Firebase Authentication and Firestore

## Technology Stack

- **Framework**: Next.js 15 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with glassmorphism effects
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions, Storage)
- **AI**: Google Gemini AI via Genkit
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20.x or higher
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Firestore, Authentication, and Storage enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ceddyandanje/newafricahealhealth.git
   cd newafricahealhealth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with your Firebase and API credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```

4. **Deploy Firebase rules** (Optional, for production)
   ```bash
   firebase login
   firebase deploy --only firestore:rules,storage:rules
   ```

## Getting Started

1. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at [http://localhost:9002](http://localhost:9002)

2. **Access the application**
   - Home page: http://localhost:9002
   - Admin panel: http://localhost:9002/admin (requires admin role)
   - Products: http://localhost:9002/products
   - Services: http://localhost:9002/services

3. **Run the AI Genkit development server** (Optional)
   ```bash
   npm run genkit:dev
   ```

## Available Scripts

- `npm run dev` - Start development server on port 9002 with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run typecheck` - Run TypeScript compiler for type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with hot reload

## Project Structure

```
newafricahealhealth/
├── src/
│   ├── app/              # Next.js app directory (pages and routes)
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── patient/      # Patient portal
│   │   ├── doctor/       # Doctor interface
│   │   └── ...           # Various service pages
│   ├── components/       # Reusable React components
│   │   ├── ui/          # Base UI components (shadcn)
│   │   ├── forms/       # Form components
│   │   ├── health/      # Health-specific components
│   │   └── layout/      # Layout components
│   ├── lib/             # Utility functions and configurations
│   ├── hooks/           # Custom React hooks
│   ├── ai/              # AI/Genkit integration
│   └── functions/       # Utility functions
├── functions/           # Firebase Cloud Functions
├── docs/                # Project documentation
├── firestore.rules      # Firestore security rules
├── storage.rules        # Firebase Storage security rules
└── firebase.json        # Firebase configuration
```

## Key Features Details

### Admin Dashboard
Administrators can manage products, orders, users, blog posts, and view analytics through a secure admin interface.

### AI Health Assistant
Powered by Google Gemini, the AI assistant helps users with health queries and provides personalized product recommendations.

### Chronic Care Programs
Specialized management programs for:
- Diabetes care and monitoring
- Cardiovascular health
- Kidney disease management
- Respiratory conditions
- Neurological disorders
- Arthritis treatment

### Security
- Firestore security rules with role-based access control
- Secure authentication with Firebase Auth
- Input validation using Zod schemas
- Environment variable management for sensitive data

## Development

The application uses modern development practices:

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-driven architecture
- Server and client component separation (Next.js 15)

## Contributing

This is a private project. For authorized contributors:

1. Create a feature branch from `main`
2. Make your changes following the existing code style
3. Test your changes thoroughly
4. Submit a pull request with a clear description

## License

Private and proprietary. All rights reserved.

## Support

For issues or questions, please contact the development team or create an issue in the repository.
