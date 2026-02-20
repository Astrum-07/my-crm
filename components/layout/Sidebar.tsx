"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, FiUsers, FiShield, FiBriefcase, FiUserCheck, 
  FiLayers, FiBookOpen, FiCreditCard, FiSettings, FiLogOut, FiArrowRight 
} from 'react-icons/fi';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.clear();
    router.push('/login');
    router.refresh();
  };

  const activeClass = "group flex items-center justify-between px-4 py-3 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const inactiveClass = "group flex items-center justify-between px-4 py-3 text-slate-500 border-2 border-transparent hover:border-black hover:text-black hover:bg-slate-50 transition-all";

  const menuItems = [
    { name: "Asosiy", path: "/", icon: <FiHome size={20} /> },
    { name: "Menajerlar", path: "/managers", icon: <FiBriefcase size={20} /> },
    { name: "Adminlar", path: "/admins", icon: <FiShield size={20} /> },
    { name: "Ustozlar", path: "/teachers", icon: <FiUserCheck size={20} /> },
    { name: "Studentlar", path: "/students", icon: <FiUsers size={20} /> },
    { name: "Guruhlar", path: "/groups", icon: <FiLayers size={20} /> },
    { name: "Kurslar", path: "/courses", icon: <FiBookOpen size={20} /> },
    { name: "To'lovlar", path: "/payments", icon: <FiCreditCard size={20} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-black border-r-2 border-black">
      <div className="p-8">
        <h1 className="text-2xl font-black tracking-tighter border-b-4 border-black inline-block uppercase">
          CRM.ADMIN
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} className={pathname === item.path ? activeClass : inactiveClass}>
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="font-bold text-xs uppercase">{item.name}</span>
            </div>
            {pathname !== item.path && <FiArrowRight className="opacity-0 group-hover:opacity-100" />}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t-2 border-black bg-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-white border-2 border-black text-black font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1"
        >
          <FiLogOut size={16} />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;