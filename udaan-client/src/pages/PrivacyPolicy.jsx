import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy — Udaan Vidyapeeth</title>
        <meta name="description" content="Privacy Policy for Udaan Vidyapeeth" />
      </Helmet>
      <Navbar />

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>
          
          <div className="font-body text-gray-700 space-y-6 leading-relaxed">
            <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
            
            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">1. Introduction</h2>
              <p>Welcome to Udaan Vidyapeeth. We are deeply committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy outlines the types of information we collect, how we use it, and the steps we take to protect it when you use our website, purchase our courses, or interact with our educational services.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">2. Information We Collect</h2>
              <p>We may collect the following types of information when you interact with our platform:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Personal Data:</strong> Name, email address, phone number, and account credentials when you register.</li>
                <li><strong>Payment Information:</strong> Billing details and payment history (processed securely via our third-party payment gateways; we do not store full credit or debit card numbers).</li>
                <li><strong>Educational Data:</strong> Course progress, quiz scores, certificates obtained, and your interactions on the platform.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage metrics collected automatically via cookies.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">3. How We Use Your Information</h2>
              <p>We utilize the collected information to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Process course enrollments, secure transactions, and manage your account.</li>
                <li>Deliver our educational content and provide personalized learning experiences.</li>
                <li>Communicate with you regarding updates, promotions, support responses, and course announcements.</li>
                <li>Analyze site performance and user behavior to improve our platform and services.</li>
                <li>Comply with legal obligations and enforce our Terms of Use.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">4. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to track the activity on our platform and hold certain information. These technologies help us remember your preferences, keep you logged in, and understand how you interact with our site. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">5. Data Sharing and Third-Party Services</h2>
              <p>Your privacy is paramount. We do not sell or rent your personal information to third parties. We may share your data with trusted third-party service providers (such as payment processors, email service providers, and analytics services) solely to perform functions on our behalf and under strict confidentiality agreements. We may also disclose information if required to do so by law or in response to valid requests by public authorities.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">6. Data Security and Retention</h2>
              <p>We implement commercially acceptable security policies, rules, and technical measures to protect your personal data from unauthorized access, modification, or deletion. However, no method of transmission over the Internet or electronic storage is 100% secure. We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy and to fulfill our legal obligations.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">7. Your Privacy Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to access, update, correct, or delete the personal information we hold about you. If you wish to exercise these rights, please contact our support team. Note that certain data may need to be retained for legal and record-keeping purposes.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">8. Account and Data Deletion Policy</h2>
              <p>You have the right to request the deletion of your account and all associated personal data.</p>
              <h3 className="font-heading font-medium text-lg mt-4 mb-2 text-gray-800">How to delete your data:</h3>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Option 1 (Inside the App):</strong> Open the Udaan app, navigate to the Profile screen, and tap the Delete Account button at the bottom. Your data will be erased immediately.</li>
                <li><strong>Option 2 (Via Web/Email):</strong> If you no longer have the app installed, you can request account deletion by emailing us at <a href="mailto:tech.udaanvp@gmail.com" className="text-blue-600 hover:underline">tech.udaanvp@gmail.com</a> from your registered email address. Please use the subject line "Account Deletion Request". We will process your request and permanently delete your account data within 7 business days.</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600"><em>Note: We may retain certain transaction data (such as purchase history) for legal and tax compliance purposes.</em></p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">9. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. We encourage you to review this Privacy Policy periodically for any changes.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">10. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, your personal data, or our practices, please contact our support team at <a href="mailto:tech.udaanvp@gmail.com" className="text-blue-600 hover:underline">tech.udaanvp@gmail.com</a>.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
