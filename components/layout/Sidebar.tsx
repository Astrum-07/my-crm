"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiBriefcase, 
  FiShield, 
  FiMonitor, 
  FiUser, 
  FiLayers, 
  FiBook, 
  FiCreditCard, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('role', { path: '/' });
    localStorage.clear();
    router.push('/login');
    router.refresh();
  };

  const activeClass = "flex items-center gap-4 px-4 py-3 bg-white text-black border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all";
  const inactiveClass = "flex items-center gap-4 px-4 py-3 text-black border-2 border-transparent hover:border-black hover:rounded-xl transition-all";

  const menuItems = [
    { name: "Asosiy", path: "/", icon: <FiHome size={24} /> },
    { name: "Menajerlar", path: "/managers", icon: <FiBriefcase size={24} /> },
    { name: "Adminlar", path: "/admins", icon: <FiShield size={24} /> },
    { name: "Ustozlar", path: "/teachers", icon: <FiMonitor size={24} /> },
    { name: "Studentlar", path: "/students", icon: <FiUser size={24} /> },
    { name: "Guruhlar", path: "/groups", icon: <FiLayers size={24} /> },
    { name: "Kurslar", path: "/courses", icon: <FiBook size={24} /> },
    { name: "Payment", path: "/payments", icon: <FiCreditCard size={24} /> },
  ];

  const secondaryItems = [
    { name: "Sozlamalar", path: "/settings", icon: <FiSettings size={24} /> },
    { name: "Profile", path: "/profile", icon: <FiUser size={24} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-black border-r-2 border-black font-sans">
      <div className="p-6">
        <h1 className="text-2xl font-black tracking-tight uppercase">Admin CRM</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[2px] mb-4 px-2 text-slate-400">Asosiy Menu</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={pathname === item.path ? activeClass : inactiveClass}
              >
                {item.icon}
                <span className="font-bold text-lg">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[2px] mb-4 px-2 text-slate-400">Boshqalar</h2>
          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={pathname === item.path ? activeClass : inactiveClass}
              >
                {item.icon}
                <span className="font-bold text-lg">{item.name}</span>
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 text-red-600 border-2 border-transparent hover:border-red-600 hover:rounded-xl transition-all"
            >
              <FiLogOut size={24} />
              <span className="font-bold text-lg uppercase tracking-wider">Chiqish</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;