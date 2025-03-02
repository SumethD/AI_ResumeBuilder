import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-black/90 border-b border-white/10 transition-smooth">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-white hover:text-[#BCE784] transition-smooth button-hover"
                aria-label="Go back to home"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <Logo />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Introduction</h2>
              <p className="leading-relaxed">
                At TailorMyCV, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Name and contact information</li>
                  <li>Resume content and professional history</li>
                  <li>Account credentials</li>
                  <li>Payment information</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">Usage Information</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and preferences</li>
                  <li>Interaction with our services</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-3">
                <li>To provide and maintain our services</li>
                <li>To improve and personalize user experience</li>
                <li>To process payments and transactions</li>
                <li>To communicate with you about our services</li>
                <li>To comply with legal obligations</li>
                <li>To detect and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Your Rights</h2>
              <ul className="list-disc list-inside space-y-3">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Contact Us</h2>
              <p className="leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at privacy@tailormycv.com
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;