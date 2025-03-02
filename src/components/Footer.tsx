import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="mb-6">
              <Logo />
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#BCE784] transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#BCE784] transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#BCE784] transition-colors">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-[#BCE784] transition-colors">About</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-[#BCE784] transition-colors">Features</a></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-[#BCE784] transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#BCE784] transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#BCE784] transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#BCE784] transition-colors">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-[#BCE784] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-[#BCE784] transition-colors">Terms</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-400 hover:text-[#BCE784] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} TailorMyCV. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;