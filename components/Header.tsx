import React, { useState } from 'react';
import BarsIcon from './icons/BarsIcon';
import XMarkIcon from './icons/XMarkIcon';

type Page = 'home' | 'store' | 'admin';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
  currentPage: Page;
  serverName: string;
  serverIconUrl: string;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentPage, serverName, serverIconUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const NavLink: React.FC<{ page: Page, children: React.ReactNode }> = ({ page, children }) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => {
          setCurrentPage(page);
          setIsOpen(false);
        }}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand text-black'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </button>
    );
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center font-pixel text-brand text-2xl overflow-hidden">
                {serverIconUrl ? (
                  <img src={serverIconUrl} alt={`${serverName} icon`} className="w-full h-full object-cover" />
                ) : (
                  serverName.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold font-pixel text-white tracking-wider">{serverName}</h1>
            </div>
          </div>
          <div className="hidden md:flex items-baseline space-x-4">
            <NavLink page="home">Home</NavLink>
            <NavLink page="store">Store</NavLink>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Discord
            </a>
            <NavLink page="admin">Admin</NavLink>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <XMarkIcon /> : <BarsIcon />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink page="home">Home</NavLink>
            <NavLink page="store">Store</NavLink>
             <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Discord
            </a>
            <NavLink page="admin">Admin</NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;