import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

function CookiePolicy() {
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
          <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">What Are Cookies</h2>
              <p className="leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide useful information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Essential Cookies</h3>
                <p className="text-gray-400">
                  Required for basic website functionality. These cookies enable core features like authentication and security.
                </p>

                <h3 className="text-xl font-semibold text-white">Performance Cookies</h3>
                <p className="text-gray-400">
                  Help us understand how visitors interact with our website by collecting anonymous information.
                </p>

                <h3 className="text-xl font-semibold text-white">Functionality Cookies</h3>
                <p className="text-gray-400">
                  Remember your preferences and settings to enhance your experience.
                </p>

                <h3 className="text-xl font-semibold text-white">Marketing Cookies</h3>
                <p className="text-gray-400">
                  Used to track visitors across websites to display relevant advertisements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Cookie Management</h2>
              <p className="leading-relaxed mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside space-y-3">
                <li>Browser settings to block or delete cookies</li>
                <li>Our cookie consent tool to manage preferences</li>
                <li>Third-party opt-out tools</li>
                <li>Private browsing modes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">Session Cookies</h3>
                  <p className="text-gray-400">Temporary cookies that expire when you close your browser</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">Persistent Cookies</h3>
                  <p className="text-gray-400">Remain on your device until they expire or you delete them</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">Third-Party Cookies</h3>
                  <p className="text-gray-400">Set by third-party services we use, such as analytics or advertising</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Updates to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Contact Us</h2>
              <p className="leading-relaxed">
                If you have questions about our Cookie Policy, please contact us at privacy@tailormycv.com
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CookiePolicy;