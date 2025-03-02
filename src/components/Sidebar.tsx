import React from 'react';
import { Home, FileText, Settings, HelpCircle, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'My Resumes', path: '/resumes', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#BCE784] text-black p-3 rounded-full shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-black/40 backdrop-blur-md border-r border-white/10 h-screen fixed top-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:sticky lg:top-0 lg:h-screen`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-[#BCE784]">AI Resume Builder</h2>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#BCE784]/20 text-[#BCE784]'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#BCE784]"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#BCE784] mb-2">Pro Tip</h3>
              <p className="text-xs text-white/70">
                Tailor your resume for each job application to increase your chances of getting an interview.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;