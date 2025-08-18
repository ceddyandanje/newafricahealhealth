
export default function PrivacyPolicyPage() {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto glassmorphic p-8 md:p-12">
          <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose dark:prose-invert max-w-none space-y-4 text-foreground">
            <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <p>Welcome to Africa Heal Health ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">1. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <h3 className="font-headline text-xl font-semibold mt-2">Personal Data</h3>
            <p>Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age and location, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.</p>
            <h3 className="font-headline text-xl font-semibold mt-2">Health & Medical Information</h3>
            <p>As a health services platform, we may collect sensitive health information that you provide, including:</p>
            <ul className="list-disc list-inside space-y-1">
                <li>Prescriptions you upload for fulfillment.</li>
                <li>Health metrics you log (e.g., blood sugar, weight, blood pressure).</li>
                <li>Information about your medical conditions, allergies, and medical history provided in your profile or during consultations.</li>
                <li>Queries you make to our AI Health Assistant, which may contain health-related information.</li>
            </ul>
            <p>This information is treated with the highest level of confidentiality and security.</p>
             <h3 className="font-headline text-xl font-semibold mt-2">Financial Data</h3>
            <p>Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, or exchange. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor.</p>
             <h3 className="font-headline text-xl font-semibold mt-2">Derivative Data</h3>
            <p>Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">2. How We Use Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
             <ul className="list-disc list-inside space-y-1">
                <li>Create and manage your account.</li>
                <li>Process your orders and manage your subscriptions for products and services.</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                <li>Email you regarding your account or order.</li>
                <li>Enable user-to-user communications.</li>
                <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                <li>Anonymize health data for the purpose of improving our AI models and services, without linking it back to your personal identity.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                <li>Notify you of updates to the Site.</li>
                <li>Request feedback and contact you about your use of the Site.</li>
            </ul>

            <h2 className="font-headline text-2xl font-bold pt-4">3. Disclosure of Your Information</h2>
            <p>We do not share your personally identifiable information or protected health information with any third parties except in the circumstances described below:</p>
             <ul className="list-disc list-inside space-y-1">
                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                <li><strong>Medical Professionals:</strong> Your information may be shared with doctors, pharmacists, and other healthcare providers who are part of your care team through our platform to provide you with medical services.</li>
             </ul>

            <h2 className="font-headline text-2xl font-bold pt-4">4. Data Security</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
            
            <h2 className="font-headline text-2xl font-bold pt-4">5. Your Rights</h2>
            <p>You have the right to:</p>
             <ul className="list-disc list-inside space-y-1">
                <li>Access the personal information we hold about you.</li>
                <li>Request that we correct any incorrect personal information.</li>
                <li>Request that we delete your personal information.</li>
                <li>Object to the processing of your personal information.</li>
             </ul>
            <p>To exercise these rights, please contact us using the contact information provided below.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">Contact Us</h2>
            <p>If you have any questions or comments about this Privacy Policy, please contact us at:</p>
            <p><strong>Email:</strong> <a href="mailto:privacy@africahealhealth.com" className="text-primary hover:underline">privacy@africahealhealth.com</a></p>
          </div>
        </div>
      </div>
    );
  }
