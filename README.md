# **Africa Heal Health** 🏥✨

**A comprehensive healthcare platform for Africa, combining AI-powered health assistance, secure prescription management, emergency services, and seamless product delivery.**

![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-039BE5.svg?style=for-the-badge&logo=firebase&logoColor=white)

---

## ✨ **Features**

### **🤖 AI-Powered Health Assistant**
- **Smart health queries** with context-aware responses
- **Product recommendations** based on medical conditions
- **Cost estimates** and step-by-step guidance for services

### **🏥 Secure Prescription & Refill Management**
- **Doctor-approved refills** with real-time notifications
- **Automated inventory alerts** for critical medications
- **Role-based access control** for patient-doctor interactions

### **🚑 Emergency & Ambulance Services**
- **Real-time incident tracking** with GPS integration
- **Automated dispatch** to nearest emergency units
- **SMS/notification alerts** for patients and providers

### **📦 Product Delivery & Inventory**
- **AI-powered product enrichment** from PDFs
- **Glassmorphic UI** for a modern, frosted-glass aesthetic
- **Multi-role support** (doctors, patients, delivery drivers, emergency services)

### **📊 Analytics & Admin Dashboard**
- **Real-time analytics** for inventory, orders, and patient insights
- **Customizable role-based permissions**
- **Dark/light mode** for accessibility

---

## 🛠️ **Tech Stack**

| Category          | Technologies Used                                                                 |
|-------------------|----------------------------------------------------------------------------------|
| **Language**      | TypeScript                                                                       |
| **Framework**     | Next.js (App Router), React, GenKit (AI), Firebase                              |
| **Database**      | Firestore (with optimized indexes)                                              |
| **Authentication**| Firebase Auth                                                                   |
| **AI/ML**         | Google AI (Gemini), GenKit for AI workflows                                     |
| **UI/UX**         | Tailwind CSS, Radix UI, Lucide Icons, Shadcn UI                                |
| **State Management** | Zustand                                                                      |
| **PDF Processing** | Tesseract.js, PDF.js                                                           |
| **Deployment**    | Firebase Hosting, Vercel (optional)                                            |

---

## 📦 **Installation**

### **Prerequisites**
- **Node.js** (v18+ recommended)
- **npm** or **yarn** (v2+ recommended)
- **Firebase Account** (for Firestore, Auth, and Hosting)
- **Google Cloud AI API Key** (for GenKit integration)

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/newafricahealhealth.git
   cd newafricahealhealth
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore, Authentication, and Hosting**.
   - Add your Firebase config to `.env.local`:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     ```

4. **Set up GenKit AI**
   - Get a **Google AI API key** from [Google Cloud Console](https://console.cloud.google.com/).
   - Add it to `.env.local`:
     ```env
     GENKIT_GOOGLEAI_API_KEY=your-google-ai-key
     ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:9002](http://localhost:9002) to view it in your browser.

---

## 🎯 **Usage**

### **Basic AI Health Assistant**
```typescript
import { healthAssistantQuery } from '@/ai/flows/health-assistant-query';

// Example usage in a React component
const handleQuery = async () => {
  const response = await healthAssistantQuery({
    query: "I have chronic knee pain. What can I do?"
  });
  console.log(response);
  // Output:
  // {
  //   answer: "Chronic knee pain can be managed with...",
  //   suggestedProducts: ["Knee Support Brace", "Anti-Inflammatory Gel", "Joint Supplement"],
  //   estimatedCost: "KES 1,500 - 5,000",
  //   procedure: "Step-by-step guide..."
  // }
};
```

### **Product Import from PDF**
```typescript
import { enrichProductData } from '@/ai/flows/product-importer-flow';

// Example usage in a React component
const handlePDFUpload = async (file: File) => {
  const rawText = await extractTextFromPDF(file); // Implement PDF text extraction
  const enrichedProducts = await enrichProductData({ rawProductData: rawText });
  console.log(enrichedProducts);
  // Output: Array of structured product objects
};
```

### **Emergency Response Suggestions**
```typescript
import { suggestEmergencyResponse } from '@/ai/flows/suggest-emergency-response-flow';

// Example usage in a React component
const handleEmergencyRequest = async () => {
  const response = await suggestEmergencyResponse({
    serviceType: "Ground Ambulance",
    location: { latitude: -1.286389, longitude: 36.817223 },
    patientName: "John Doe",
    situationDescription: "Car accident with multiple injuries",
    bloodGroup: "O+",
    timeSinceRequest: "5 minutes ago"
  });
  console.log(response);
  // Output:
  // {
  //   summary: "Dispatch the nearest ground ambulance to Aga Khan University Hospital...",
  //   lawEnforcementNeeded: true,
  //   nearestHospital: "Aga Khan University Hospital"
  // }
};
```

---

## 📁 **Project Structure**

```
newafricahealhealth/
├── src/
│   ├── ai/                  # AI workflows and GenKit configurations
│   ├── app/                 # Next.js application routes
│   │   ├── admin/           # Admin dashboard and management pages
│   │   ├── doctor/          # Doctor-specific features
│   │   ├── emergency/       # Emergency services dashboard
│   │   ├── delivery/        # Delivery driver dashboard
│   │   └── ...              # Other public routes
│   ├── components/          # Reusable UI components
│   │   ├── admin/           # Admin-specific components
│   │   ├── doctor/          # Doctor-specific components
│   │   ├── emergency/       # Emergency services components
│   │   └── layout/          # Layout components (header, footer, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and services
│   │   ├── firebase/        # Firebase SDK configurations
│   │   ├── ai/              # AI-related utilities
│   │   └── types/           # TypeScript type definitions
│   ├── styles/              # Global styles and themes
│   └── ...
├── public/                  # Static assets
├── .env.local               # Environment variables
├── firebase.json             # Firebase configuration
├── firestore.indexes.json    # Firestore security indexes
├── package.json             # Project dependencies
└── README.md                # This file
```

---

## 🔧 **Configuration**

### **Environment Variables**
| Variable                     | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| `NEXT_PUBLIC_FIREBASE_*`     | Firebase project configuration (Auth, Firestore, etc.)                       |
| `GENKIT_GOOGLEAI_API_KEY`   | Google AI API key for GenKit integration                                    |
| `TWILIO_ACCOUNT_SID`        | Twilio account SID for SMS notifications                                   |
| `TWILIO_AUTH_TOKEN`         | Twilio authentication token                                                 |
| `TWILIO_PHONE_NUMBER`       | Twilio phone number for sending SMS                                         |

### **Customization**
- **Theming**: Modify `tailwind.config.ts` and `globals.css` for custom colors.
- **AI Prompts**: Edit prompts in `src/ai/flows/*.ts` for tailored responses.
- **Firebase Rules**: Update `firestore.rules` and `database.rules.json` for security.

---

## 🤝 **Contributing**

### **How to Contribute**
1. **Fork the repository** and clone it locally.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** with a clear description of your changes.

### **Development Setup**
- Use `npm run dev` to start the development server.
- Use `npm run typecheck` to run TypeScript type checking.
- Use `npm run lint` to check for linting errors.

### **Code Style Guidelines**
- Follow **TypeScript best practices** (strict mode, proper typing).
- Use **ESLint** for consistent code formatting.
- Write **clear, concise commit messages** (e.g., "Fix bug in emergency response flow").

---

## 📝 **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👥 **Authors & Contributors**

| Name          | Role                          | GitHub Profile                     |
|---------------|-------------------------------|------------------------------------|
| CEDRICK MSILA   | Project Lead & Developer      | [@dev](https://github.com/ceddyandanje) |
| CEDRICK | AI Workflows & GenKit Setup    | [@contributor](https://github.com/ceddyandanje) |

### **Acknowledgments**
- **Firebase** for backend services and real-time database.
- **GenKit** for seamless AI integration.
- **Shadcn UI** for beautiful, accessible components.
- **Lucide Icons** for elegant UI icons.

---

## 🐛 **Issues & Support**

### **Reporting Issues**
- Open an issue on GitHub with a clear description of the problem.
- Include steps to reproduce and any relevant logs or screenshots.

### **Getting Help**
- Join our **Discord community** (link in project documentation).
- Ask questions on **Stack Overflow** (tagged with `africa-heal-health`).
- Check the **FAQ** section for common questions.

---

## 🗺️ **Roadmap**

### **Planned Features**
- **📱 Mobile App**: iOS and Android versions of Africa Heal Health.
- **🔒 Enhanced Security**: Multi-factor authentication and audit logs.
- **🌍 Multi-Language Support**: Localization for African languages.
- **📊 Advanced Analytics**: Predictive analytics for patient health trends.

### **Known Issues**
- [#123] Firestore rules optimization for large datasets.
- [#456] PDF text extraction improvements for complex layouts.

### **Future Improvements**
- **🤖 Chatbot Integration**: Direct patient-doctor chat via AI.
- **🚀 Automated Refill Orders**: AI-driven refill suggestions.
- **📊 AI-Powered Insights**: Personalized health recommendations.

---

## **Get Started Today!** 🚀

Join us in building a healthier Africa, one line of code at a time. Whether you're a developer, designer, or healthcare professional, your contributions are welcome!

👉 **Star this repository** to show your support.
💬 **Open an issue** to report bugs or suggest features.
📩 **Reach out** for collaboration opportunities.

Let's heal Africa, together! 🌍💚
