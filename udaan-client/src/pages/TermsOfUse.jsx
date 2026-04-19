import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Terms of Use — Udaan Vidyapeeth</title>
        <meta name="description" content="Terms of Use for Udaan Vidyapeeth" />
      </Helmet>
      <Navbar />

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-8 border-b pb-4">Terms of Use</h1>
          
          <div className="font-body text-gray-700 space-y-6 leading-relaxed">
            <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
            
            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">1. Acceptance of Terms</h2>
              <p>By accessing, browsing, or using the Udaan Vidyapeeth website and our educational services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform or purchase any courses.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">2. Account Registration and Security</h2>
              <p>To purchase or access certain courses and educational materials, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to keep your account details updated. You are entirely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">3. Course Purchases, Pricing, and Payments</h2>
              <p>All prices for courses and services are subject to change without notice. We reserve the right to modify or discontinue any course at any time. Payments for courses must be made through our authorized payment gateways. By submitting payment information, you authorize us and our third-party payment processors to charge the applicable fees to your designated payment method.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">4. Refunds and Cancellations</h2>
              <p>Refunds are subject to our specific course refund policies outlined at the time of purchase. Generally, if you are unsatisfied with a course, you may request a refund within a specified window (within 12 hours of purchase), provided you have not consumed a significant portion of the course content. We reserve the right to decline refund requests that violate our policy guidelines or show signs of abuse.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">5. Intellectual Property Rights</h2>
              <p>All content on the Udaan Vidyapeeth platform, including but not limited to video lectures, course materials, text, graphics, logos, and software, is the exclusive property of Udaan Vidyapeeth or its licensors. You are granted a limited, non-exclusive, non-transferable license to access and view the courses you have purchased specifically for your personal, non-commercial, educational purposes. You may not reproduce, redistribute, transmit, assign, sell, broadcast, rent, share, lend, modify, adapt, edit, or create derivative works of any course content.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">6. User Conduct and Restrictions</h2>
              <p>You agree not to use our platform for any unlawful purpose. You shall not upload or transmit any viruses or malicious code, attempt to gain unauthorized access to our systems, or engage in any conduct that restricts or inhibits any other user from using or enjoying the platform. Account sharing is strictly prohibited and can lead to immediate account termination without refund or prior notice.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">7. Disclaimers and Limitation of Liability</h2>
              <p>Our courses and educational materials are provided on an "as is" and "as available" basis. Udaan Vidyapeeth makes no representations or warranties of any kind, express or implied, as to the operation of the platform or the information, content, materials, or products included. In no event shall Udaan Vidyapeeth be liable for any direct, indirect, incidental, punitive, or consequential damages arising from your use of an educational product or service.</p>
            </div>
            
            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">8. Amendments to Terms</h2>
              <p>We reserve the right to update or modify these Terms of Use at any time. Any changes will be effective immediately upon posting to the website. Your continued use of our services following the posting of revised terms means that you accept and agree to the changes.</p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-xl mb-3 text-gray-900">9. Governing Law</h2>
              <p>These Terms of Use and your use of the platform are governed by and construed in accordance with the applicable regional laws, without regard to its conflict of law principles. Any legal action or proceeding related to our platform shall be brought exclusively in the competent courts of jurisdiction.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
