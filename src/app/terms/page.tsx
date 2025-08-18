
export default function TermsOfServicePage() {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto glassmorphic p-8 md:p-12">
          <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          <div className="prose dark:prose-invert max-w-none space-y-4 text-foreground">
            <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <h2 className="font-headline text-2xl font-bold pt-4">1. Agreement to Terms</h2>
            <p>By accessing or using the Africa Heal Health website and its related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">2. Medical Disclaimer</h2>
            <p><strong>Our Service does not provide medical advice.</strong> The content on our platform, including text, graphics, images, information from our AI assistant, and other material, is for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on the Service.</p>
            <p><strong>If you think you may have a medical emergency, call your doctor, go to the emergency department, or call emergency services immediately.</strong></p>

            <h2 className="font-headline text-2xl font-bold pt-4">3. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">4. Services and Products</h2>
            <p>We provide various services, including but not limited to, the sale and delivery of health products, chronic disease management programs, facilitation of medical tourism, and emergency service coordination. All purchases through our Service are subject to product availability. We may, in our sole discretion, limit or cancel the quantities offered on our Service or limit the sales of our products or services to any person, household, geographic region, or jurisdiction.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">5. Payments and Billing</h2>
            <p>For any purchases made through the Service, you agree to provide current, complete, and accurate purchase and account information. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in the currency specified at the time of purchase.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">6. Intellectual Property</h2>
            <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Africa Heal Health and its licensors. The Service is protected by copyright, trademark, and other laws of both the local jurisdiction and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Africa Heal Health.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">7. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">8. Limitation of Liability</h2>
            <p>In no event shall Africa Heal Health, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">9. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">10. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

            <h2 className="font-headline text-2xl font-bold pt-4">Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p><strong>Email:</strong> <a href="mailto:support@africahealhealth.com" className="text-primary hover:underline">support@africahealhealth.com</a></p>
          </div>
        </div>
      </div>
    );
  }
