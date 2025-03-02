import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

function About() {
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
          <h1 className="text-4xl font-bold text-white mb-8">About TailorMyCV</h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Our Mission</h2>
              <p className="leading-relaxed">
                At TailorMyCV, we're dedicated to revolutionizing the way professionals present themselves in today's competitive job market. Our AI-powered platform combines cutting-edge technology with deep industry insights to help you create resumes that truly stand out.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Our Story</h2>
              <p className="leading-relaxed">
                TailorMyCV was founded in 2025 by two passionate developers who saw a gap in the market for truly intelligent resume optimization. What started as a collaborative project between friends quickly evolved into a comprehensive platform that's changing how people approach job applications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">What Sets Us Apart</h2>
              <ul className="list-disc list-inside space-y-3">
                <li>Advanced AI Technology: Our proprietary algorithms analyze and optimize your resume in real-time</li>
                <li>Industry Expertise: Built with insights from HR professionals across various sectors</li>
                <li>User-Centric Design: Intuitive interface that makes resume creation effortless</li>
                <li>Continuous Innovation: Regular updates based on the latest hiring trends and user feedback</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#BCE784] mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
                  <p className="text-gray-400">Constantly pushing the boundaries of what's possible in resume creation</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Integrity</h3>
                  <p className="text-gray-400">Maintaining the highest standards of data privacy and security</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Impact</h3>
                  <p className="text-gray-400">Making a real difference in people's professional lives</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Inclusion</h3>
                  <p className="text-gray-400">Creating tools that work for everyone, regardless of background</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;