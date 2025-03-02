import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

function Terms() {
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
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">1. Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing or using TailorMyCV, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">2. User Accounts</h2>
              <ul className="list-disc list-inside space-y-3">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must provide accurate and complete information</li>
                <li>You must notify us of any unauthorized access</li>
                <li>We reserve the right to terminate accounts at our discretion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">3. Service Usage</h2>
              <ul className="list-disc list-inside space-y-3">
                <li>Use of the service is at your own risk</li>
                <li>You must not misuse our services</li>
                <li>We may modify or discontinue services at any time</li>
                <li>You are responsible for all content you submit</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">4. Intellectual Property</h2>
              <p className="leading-relaxed">
                The service and its original content, features, and functionality are owned by TailorMyCV and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">5. Payment Terms</h2>
              <ul className="list-disc list-inside space-y-3">
                <li>Subscription fees are billed in advance</li>
                <li>All payments are non-refundable</li>
                <li>You are responsible for all applicable taxes</li>
                <li>We may change pricing with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                TailorMyCV shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">7. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Terms;