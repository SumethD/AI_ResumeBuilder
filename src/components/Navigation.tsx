import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import Logo from './Logo';
import { ArrowLeft } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
}

interface NavigationProps {
  links?: NavLink[];
  showAuth?: boolean;
  isDark?: boolean;
  showBack?: boolean;
}

export default function Navigation({ 
  links = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ],
  showAuth = true,
  isDark = true,
  showBack = false
}: NavigationProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const textColorClass = isDark ? 'text-white' : 'text-gray-900';
  const hoverColorClass = isDark ? 'hover:text-[#BCE784]' : 'hover:text-[#9fb76a]';

  return (
    <nav className={`${isDark ? 'bg-black/90' : 'bg-white'} border-b ${isDark ? 'border-white/10' : 'border-gray-200'} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {showBack && (
              <button
                onClick={() => navigate('/')}
                className={`flex items-center space-x-2 ${textColorClass} ${hoverColorClass} transition-colors`}
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            )}
            <Logo />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`${textColorClass} ${hoverColorClass} transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            
            {showAuth && (
              isAuthenticated ? (
                <UserMenu />
              ) : (
                <Link
                  to="/auth"
                  className="bg-[#BCE784] hover:bg-[#BCE784]/90 text-black px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}