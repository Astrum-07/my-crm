"use client";

import React from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="h-20 bg-white border-b-2 border-black flex items-center justify-between px-6 sticky top-0 z-40 text-black">
      <button 
        onClick={toggleSidebar}
        className="p-2 border-2 border-black bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
      >
        <FiMenu size={20} />
      </button>

      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <FiBell size={20} />
        </div>
        <div className="flex items-center space-x-3 pl-4 border-l-2 border-black">
          <div className="hidden md:block">
            <p className="text-[10px] font-black uppercase">Admin</p>
          </div>
          <div className="w-10 h-10 border-2 border-black bg-blue-400 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FiUser size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;